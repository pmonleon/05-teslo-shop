import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedDataBase } from "../../database";
import { Product, User, Order } from "../../models";

/***
 * Archivo solo para desarrollo
 * Llenar la base de datos con info de prueba
 */

type Data = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({
      msg: "No tiene accesos a este servicio",
    });
  }

  await db.connect();
  // Productos
  await Product.deleteMany();
  await Product.insertMany(seedDataBase.initialData.products);
  // Usuarios
  await User.deleteMany();
  await User.insertMany(seedDataBase.initialData.users);
  // Ordenes
  await Order.deleteMany();

  await db.disconnect();
  res.status(200).json({ msg: "Proceso ejecutado correctamente" });
}
