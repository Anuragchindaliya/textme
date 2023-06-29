import { NextFunction, Request, Response } from "express";
import db from "../../config/db";
import { ApiStandardRes } from "../../interfaces";
import { WandRepository } from "./wand.model";
import z from "zod";
export const wandResponse = {
  id: 1,
  wood: "holly",
  core: "phoenix feather",
  wand_length: "11.00",
  character_id: 1,
};

export const getAllWands = async (
  req: Request,
  res: Response<ApiStandardRes>
) => {
  console.log("wands/all repo");
  const wands = await new WandRepository().readAll();

  res.json({
    statusCode: 200,
    message: "Wands fetched successfully",
    data: wands[0],
  });
};

const getWandByNameReq = z.object({
  name: z.string(),
});
export const getWandByName = async (
  req: Request,
  res: Response<ApiStandardRes>,
  next: NextFunction
) => {
  //   console.log("wands/all repo");
  //   const wand = await new WandRepository().readByName();
  try {
    console.log("req params", req.query);
    const query = getWandByNameReq.parse(req.query);
    res.json({
      statusCode: 200,
      message: "Wands fetched successfully",
      data: query,
    });
  } catch (err) {
    next(err);
  }
};
