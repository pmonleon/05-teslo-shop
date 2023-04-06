import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../auth/[...nextauth]";
import formidable from "formidable";
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL!);

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return uploadFile(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const saveFileInFS = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
  return;
};
const saveFile = async (file: formidable.File):Promise<string> => {
  const data = await cloudinary.uploader.upload(file.filepath);
  console.log({ data });
  return data.secure_url;
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      console.log({ error, fields, files });
      if (error) {
        return reject(error);
      }
      const resp = await saveFile(files.file as formidable.File);
      resolve(resp);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);
  // console.log({ session });

  if (!session) {
    return res.status(401).json({ message: "Auth required" });
  }

  const imageUrl = await parseFiles(req);

  return res.status(200).json({ message: imageUrl  });
};
