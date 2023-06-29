import { Request, Response, Router } from "express";
import { getAllWands, getWandByName } from "./wand.controller";
const wandRouter = Router();

wandRouter.get("/", getAllWands);
// wandRouter.get("/", getWandByName);
export default wandRouter;
