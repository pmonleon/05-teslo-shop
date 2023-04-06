import { LeanDocument, isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL!);

type Data =
  | {
      message: string;
    }
  | IProduct
  | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return createProduct(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log({ session });

  if (!session) {
    return res.status(401).json({ message: "Auth required" });
  }

  try {
    await db.connect();

    const dbProducts = await Product.find()
      .sort({
        title: "asc",
      })
      .lean();

    await db.disconnect();

    // actualizar imagenes

    const updatedProducts:IProduct[] = dbProducts.map((product) => {
      // procesar imagenes al subirlas al server
      product.images = product.images.map((item) => {
        return item.includes("http")
          ? item
          : `${process.env.HOST_NAME}products/${item}`;
      });
      return product;
    });

    return res.status(200).json({ products: updatedProducts });
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  } finally {
    await db.disconnect();
  }
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log({ session });

  if (!session) {
    return res.status(401).json({ message: "Auth required" });
  }

  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ messgae: "Invalid id" });
  }
  if (images.length < 2) {
    return res.status(400).json({ message: "Invalid images" });
  }

  try {
    await db.connect();

    const dbProduct = await Product.findById(_id);

    if (!dbProduct) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "No existe ningun producto con ese ID" });
    }

    await dbProduct.update(req.body);

    await db.disconnect();

    // actualizar imagenes
    dbProduct.images.forEach(async (item) => {
      if (!images.includes(item)) {
        // borrar de cloudinary -> obtener ID del string
        const [fileId, extension] = item
          .substring(item.lastIndexOf("/") + 1)
          .split(".");
        console.log({ fileId, extension });
        await cloudinary.uploader.destroy(fileId);
      }
    });

    return res.status(200).json({ product: dbProduct });
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  } finally {
    await db.disconnect();
  }
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log({ session });

  if (!session) {
    return res.status(401).json({ message: "Auth required" });
  }

  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: "Invalid images" });
  }

  try {
    await db.connect();

    const productInDB = await Product.findOne({ slug: req.body.slug });
    if (!!productInDB) {
      await db.disconnect();
      console.log(productInDB);
      return res.status(400).json({ message: "Producto ya existe" });
    }

    const newProduct = new Product(req.body);

    await newProduct.save();

    await db.disconnect();

    // actualizar imagenes

    return res.status(200).json({ product: newProduct });
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  } finally {
    await db.disconnect();
  }
};
