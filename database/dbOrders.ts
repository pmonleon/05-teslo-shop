import { isValidObjectId } from "mongoose";
import { db } from ".";
import { IOrder } from "../interfaces";
import { Order } from "../models";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId) {
    return null;
  }
  await db.connect();
  const order = await Order.findById(id).lean();
  await db.disconnect();
  if (!order) {
    return null;
  }
  // serializar la response
  return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async (
  userId: string
): Promise<IOrder[] | null> => {
  if (!isValidObjectId) {
    return null;
  }
  await db.connect();
  const orders = await Order.find({ user: userId }).lean();
  await db.disconnect();
  if (!orders) {
    return null;
  }
  // serializar la response
  return JSON.parse(JSON.stringify(orders));
};
