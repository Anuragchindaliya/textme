export type ApiStandardRes<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
};
