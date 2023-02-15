import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

type Data =
  | {
      message: string;
    }
  | IOrder[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getOrdersInfo(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getOrdersInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);
  // console.log({ session });

  if (!session) {
    return res.status(401).json({ message: "Auth required" });
  }

  try {
    await db.connect();

    const dbOrders = await Order.find()
      .sort({
        createdAt: "desc",
      })
      .populate("user", "name email")
      .lean();

    await db.disconnect();

    return res.status(200).json({ orders: dbOrders });
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};
