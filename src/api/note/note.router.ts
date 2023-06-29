import { Request, Response, Router } from "express";
import { getAllNote, getNoteByName, postByTitle } from "./note.controller";
const noteRouter = Router();

noteRouter.route("/").get(getAllNote).post(postByTitle);
noteRouter.get("/:name", getNoteByName);
export default noteRouter;
