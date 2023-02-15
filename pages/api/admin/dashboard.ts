import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

type Data =
  | {
      message: string;
    }
  | {
      numberOfOrders: number;
      paidOrders: number; // isPaid: true
      notPaidOrders: number;
      numberOfClients: number; // role: client
      numberOfProducts: number;
      numberOfProductsWithNoInventory: number;
      numberOfProductsWithLowInventory: number; // < 10 ud
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getDashboardInfo(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getDashboardInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log({ req });
  // const token: any = await getToken({
  //   req: req,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);
  // console.log({ session });

  if (!session) {
    return res.status(401).json({ message: "Auth required" });
  }

  try {
    await db.connect();

    const [
      dbOrdersCount,
      dbPaidOrders,
      dbProductsCount,
      dbProductWithoutStock,
      dbProductWithLessStock,
      dbUsersFiltered,
    ] = await Promise.all([
      Order.count(),
      Order.find({ isPaid: true }).count(),
      Product.count(),
      Product.find({ inStock: 0 }).count(),
      Product.find({ inStock: { $lte: 10 } }).count(),
      User.find({ role: "client" }).count(),
    ]);

    // const dbProducts = await Product.find();
    // const dbProductsfiltered = await Product.find({ inStock: 0 }); 
    // const dbUsersFiltered = await User.find({ role: "admin" });

    await db.disconnect();

    const dashboardInfo = {
      numberOfOrders: dbOrdersCount,
      paidOrders: dbPaidOrders, // dbOrders.filter((order) => order.isPaid === true).length, // isPaid: true
      notPaidOrders: dbOrdersCount - dbPaidOrders, // dbOrders.filter((order) => order.isPaid !== true).length,
      numberOfClients: dbUsersFiltered, // dbUsers.filter(user => user.role === 'client').length, // role: client
      numberOfProducts: dbProductsCount,
      numberOfProductsWithNoInventory: dbProductWithoutStock, // dbProducts.filter(product => product.inStock === 0).length,
      numberOfProductsWithLowInventory: dbProductWithLessStock, // dbProducts.filter(
      //     (product) => product.inStock < 10 && product.inStock > 0
      //   ).length,
    };
    return res.status(200).json({ ...dashboardInfo });
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};
