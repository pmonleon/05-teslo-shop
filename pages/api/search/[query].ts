import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = { message: string } | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return searchProducts(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  let { query = "" } = req.query;

  query = query.toString().toLowerCase();

  await db.connect();
  const products = await Product.find({ $text: { $search: query } }).lean();
  await db.disconnect();
  if (!products) {
    return res.status(200).json({ message: "" });
  }
  return res.status(200).json(products);
};