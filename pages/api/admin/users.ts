import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";
import { isValidObjectId } from "mongoose";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsersInfo(req, res);
    case "PUT":
      return updateUserInfo(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getUsersInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);
  // console.log({ session });

  if (!session) {
    return res.status(401).json({ message: "Auth required" });
  }

  try {
    await db.connect();

    const dbUsers = await User.find();

    await db.disconnect();

    return res.status(200).json({ users: dbUsers });
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};

const updateUserInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const session: any = await unstable_getServerSession(req, res, authOptions);
  // console.log({ session });

  //   if (!session) {
  //     return res.status(401).json({ message: "Auth required" });
  //   }

  const { userId = "", role = "" } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const validRoles = ["admin", "super-admin", "client"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    await db.connect();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    const userUpdated = await User.findById(userId).select("-password").lean();

    await db.disconnect();
    return res.status(200).json({ userUpdated });
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};
