import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (!product) {
    return null;
  }
  // serializar la response
  return JSON.parse(JSON.stringify(product));
};

interface ProductsSlug {
  slug: string;
}

export const getAllProductsSlugs = async (): Promise<ProductsSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select("slug -_id").lean();
  await db.disconnect();

  return slugs;
};

export const getProductsByTerms = async (
  query: string
): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find({
    $text: { $search: query.toString().toLowerCase() },
  })
    .select("title images price inStock slug -_id")
    .lean();
  await db.disconnect();
  await db.connect();

  return products;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();

  // serializar la response
  return JSON.parse(JSON.stringify(products));
};
