import { CleaningServices } from "@mui/icons-material";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { db, SHOP_CONSTANTS } from "../../../database";
import { IPaypal } from "../../../interfaces";
import { Order } from "../../../models";

type Data = { message: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getBearerTokenPaypal = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID!}:${PAYPAL_CLIENT_SECRET!}`,
    "utf-8"
  ).toString("base64");

  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log({ error });
    }
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const paypalBearerToken = await getBearerTokenPaypal();
  if (!paypalBearerToken) {
    return res
      .status(400)
      .json({ message: "No se pudo generar el token de Paypal" });
  }

  const { transactionid = "", orderId = "" } = req.body;
  try {
    const { data } = await axios.get<IPaypal.IPaypalOrderStatusResponse>(
      `${process.env.PAYPAL_ORDERS_URL}/${transactionid}` || "",
      {
        headers: {
          Authorization: `Bearer ${paypalBearerToken}`,
        },
      }
    );
    if (data.status !== "COMPLETED") {
      return res.status(401).json({ message: "Orden no reconocida" });
    }
    await db.connect();
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      await db.disconnect();
      return res
        .status(404)
        .json({ message: "Orden no existe en base de datos" });
    }

    if (dbOrder.total !== +data.purchase_units[0].amount.value) {
      console.log(dbOrder.total);
      console.log(+data.purchase_units[0].amount.value);
      await db.disconnect();
      return res
        .status(404)
        .json({ message: "Los montos de Paypal no son correctos" });
    }

    dbOrder.transactionId = transactionid;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();
    return res.status(200).json({ message: "Orden Pagada" });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log({ error });
    }
  }
};
