import { db } from ".";
import { User } from "../models";
import bcrypt from "bcryptjs";

export const checkUserEmailPassword = async (
  email: string,
  password: string
): Promise<{
  _id: string;
  email: string;
  name: string;
  role: ("admin" | "client")[] | ("admin" | "client");
} | null> => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user?.password as string)) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLowerCase(),
    name,
    role,
  };
};

// Crear o verificar un usauario de 0Auth
export const oAuthToDbUser = async (
  oAuthEmail: string,
  oAuthName: string
): Promise<{
  _id: string;
  email: string;
  name: string;
  role: ("admin" | "client")[] | ("admin" | "client");
} | null> => {
  if (!oAuthEmail || !oAuthName) {
    return null;
  }

  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user) {
    await db.disconnect();
    const { _id, email, name, role } = user;
    return {
      _id,
      email: email.toLowerCase(),
      name,
      role,
    };
  }

  // const newUser = await User.create({
  //   email: oAuthEmail,
  //   name: oAuthEmail,
  //   role: "client",
  // });

  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: "@",
    role: "client",
  });
  try {
    await newUser.save();
  } catch (error) {
    return null;
  }
  await db.disconnect();

  const { _id, name, role, email } = newUser;

  return { _id, name, role, email };
};
