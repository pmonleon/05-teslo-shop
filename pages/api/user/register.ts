import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import { jwt, validations } from "../../../utils";
import bcrypt from "bcryptjs";

type Data =
  | { message: string }
  | {
      token: string;
      user: { role: string | string[]; name: string; email: string };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    email = "",
    password = "",
    name = "",
  } = req.body as { email: string; password: string; name: string };

  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "La contraseña minimo 5 caracteres" });
  }
  if (name.length < 2) {
    return res.status(400).json({ message: "El nombre minimo 2 caracteres" });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: "El email no es valido" });
  }

  await db.connect();
  const user = await User.findOne({ email });
  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: "Usuario ya existente" });
  }
  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password, 10),
    name: name,
    role: "client",
  });
  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(50).json({ message: "Internal server error" });
  }
  await db.disconnect();

  return res.status(200).json({
    token: jwt.signToken(newUser._id, newUser.email),
    user: { role: newUser.role, name: newUser.name, email: newUser.email },
  });
};
