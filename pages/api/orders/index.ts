import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, Product } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

type Data = { message: string } | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const { orderItems, total } = body as IOrder;

  // verificar sesion de usuario
  // @ts-ignore
  const session: any = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "unauthorized " });
  }
  // verificar precios -> arreglo con los productos elegidos
  const productsIds = orderItems.map((item) => item._id);
  await db.connect();
  const products = await Product.find({ _id: { $in: productsIds } });
  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const productPrice = products.find(
        (item) => item.id === current._id
      )!.price;
      if (!productPrice) {
        throw new Error("Verifique el carriro de nuevo, producto no existe");
      }
      return productPrice * current.quantity + prev;
    }, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (1 + taxRate);

    if (total !== backendTotal) {
      throw new Error("El total no cuadra con el monte");
    }
    // Grabar orden en base de datos
    const userId = session.user._id;
    const newOrder = new Order({
      ...body,
      user: userId,
      isPaid: false,
    });

    newOrder.total = Math.round(newOrder.total * 100) / 100;

    await newOrder.save();
    await db.disconnect();
    console.log(newOrder);
    return res.status(200).json({ order: newOrder });
  } catch (error: any) {
    console.log(error);
    await db.disconnect();
    return res
      .status(400)
      .json({ message: error?.message || "Revise logs del servidor" });
  }
};
