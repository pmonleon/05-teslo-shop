import { SignLanguage } from "@mui/icons-material";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Product } from "../../../models";
import { IProduct } from "../../../interfaces/products";

type Data = { message: string } | IProduct;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getProductsBySlug(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getProductsBySlug = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.url;

  const slug = url?.split("/") as string[];

  await db.connect();
  const product = await Product.findOne({
    slug: slug[slug?.length - 1],
  })
  .lean();
  await db.disconnect();

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  } 

  // procesar imagenes al subirlas al server
  product.images = product.images.map((item) => {
    return item.includes("http")
      ? item
      : `${process.env.HOST_NAME}products/${item}`;
  });

  return res.status(200).json(product);
};
