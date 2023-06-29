import allowedOrigins from "./allowedOrigin";

const corsOptions = {
  origin: (
    origin: string,
    callback: (err: Error | null, p?: boolean) => void
  ) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};
export default corsOptions;
