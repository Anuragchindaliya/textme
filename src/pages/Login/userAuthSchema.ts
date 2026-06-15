import * as z from "zod"

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty("Password required"),
  // .regex(
  //   /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  //   { message: "Password is weak" },
  // ),
})
