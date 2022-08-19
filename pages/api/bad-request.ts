import type { NextApiRequest, NextApiResponse } from "next";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

type Data = {
  ok: boolean;
  message: string | string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { message = 'Bad request'} = req.query

  return res.json({
    ok: false,
    message,
  });
}
