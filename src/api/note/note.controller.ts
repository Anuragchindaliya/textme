import { NextFunction, Request, Response } from "express";
import db from "../../config/db";
import { ApiStandardRes } from "../../interfaces";
import Note, { NoteRepository } from "./note.model";
import z from "zod";
export const wandResponse = {
  id: 1,
  wood: "holly",
  core: "phoenix feather",
  wand_length: "11.00",
  character_id: 1,
};
export const noteRes = {
  id: 1,
  title: "Note Title",
  content: "Note Content",
  created_at: "2023-06-24T06:50:08.000Z",
  category_id: 1,
  updated_at: "2023-06-24T06:52:23.000Z",
};

export const getAllNote = async (
  req: Request,
  res: Response<ApiStandardRes>,
  next: NextFunction
) => {
  console.log(req.query, "query");
  const { query } = req;

  // const filter = Object.keys(query).reduce((sql, key, i) => {
  //   const join = i ? " AND " : "";
  //   sql += `${join}${key}='${query[key]}'`;
  //   return sql;
  // }, "");
  try {
    const queryResult = Note.partial().parse(query);
    console.log({ queryResult, query });
    // Boolean(Object.keys(filter).length))
    const wands = await new NoteRepository().readAll(queryResult);
    return res.json({
      statusCode: 200,
      message: "Notes fetched successfully",
      data: wands[0],
    });
  } catch (err) {
    next(err);
  }
};

const getNoteByNameReq = z.object({
  name: z.string().min(2),
});
type GetNoteByNameReq = z.infer<typeof getNoteByNameReq>;
export const getNoteByName = async (
  req: Request<GetNoteByNameReq>,
  res: Response<ApiStandardRes>,
  next: NextFunction
) => {
  try {
    console.log("get note by name req params", req.params);
    const params = getNoteByNameReq.parse(req.params);
    if (!params?.name) {
      return res.json({
        statusCode: 422,
        message: "invalid payload: expected title",
      });
    }
    const note = await new NoteRepository().readByTitle(params.name);
    res.json({
      statusCode: 200,
      message: "Note fetched successfully",
      data: note[0][0],
    });
  } catch (err) {
    next(err);
  }
};
const postByTitleReq = z.object({
  title: z.string(),
  content: z.string(),
});
type PostByTitleReq = z.infer<typeof postByTitleReq>;
export const postByTitle = async (
  req: Request<{}, {}, PostByTitleReq>,
  res: Response<ApiStandardRes>,
  next: NextFunction
) => {
  try {
    const { title, content } = postByTitleReq.parse(req.body);
    console.log("get note by title, content", req.body);
    if (!title || !content) {
      return res.json({
        statusCode: 400,
        message: "Invalid agrs: expected title and content",
      });
    }
    const [resp] = await new NoteRepository().updateByTitle({
      title,
      content,
    });
    if (resp.affectedRows == 0) {
      return res.json({
        statusCode: 422,
        message: "Can't update note",
      });
    }

    return res.json({
      statusCode: 200,
      message: "Note updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
