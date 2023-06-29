import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";
import wandRouter from "./api/wand/wand.router";
import noteRouter from "./api/note/note.router";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use("/api/v1", api);
app.use("/wands", wandRouter);
app.use("/notes", noteRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
