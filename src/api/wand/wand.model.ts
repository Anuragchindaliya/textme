import * as z from "zod";
import db from "../../config/db";
import { FieldPacket, OkPacket, RowDataPacket } from "mysql2/promise";
const Wand = z.object({
  id: z.number(),
  wood: z.string(),
  core: z.string(),
  wand_length: z.string(),
  character_id: z.number(),
});

export type WandI = z.infer<typeof Wand>;

export class WandRepository {
  readAll(): Promise<[RowDataPacket[], FieldPacket[]]> {
    return db.query("SELECT * FROM wand");
  }
  readByName(name: string): Promise<[RowDataPacket[], FieldPacket[]]> {
    return db.query(`SELECT * FROM wand WHERE name = ?`, name);
  }
  // readAll(): Promise<WandI[]> {
  //   return new Promise((resolve, reject) => {
  //     db.query("SELECT * FROM users", (err: Error, res: any) => {
  //       if (err) reject(err);
  //       else resolve(res);
  //     });
  //   });
  // }

  // readById(user_id: number): Promise<IUser | undefined> {
  //   return new Promise((resolve, reject) => {
  //     connection.query<IUser[]>(
  //       "SELECT * FROM users WHERE id = ?",
  //       [user_id],
  //       (err, res) => {
  //         if (err) reject(err);
  //         else resolve(res?.[0]);
  //       }
  //     );
  //   });
  // }

  // create(user: IUser): Promise<IUser> {
  //   return new Promise((resolve, reject) => {
  //     connection.query<OkPacket>(
  //       "INSERT INTO users (email, password, admin) VALUES(?,?,?)",
  //       [user.email, user.password, user.admin],
  //       (err, res) => {
  //         if (err) reject(err);
  //         else
  //           this.readById(res.insertId)
  //             .then((user) => resolve(user!))
  //             .catch(reject);
  //       }
  //     );
  //   });
  // }

  // update(user: IUser): Promise<IUser | undefined> {
  //   return new Promise((resolve, reject) => {
  //     connection.query<OkPacket>(
  //       "UPDATE users SET email = ?, password = ?, admin = ? WHERE id = ?",
  //       [user.email, user.password, user.admin, user.id],
  //       (err, res) => {
  //         if (err) reject(err);
  //         else this.readById(user.id!).then(resolve).catch(reject);
  //       }
  //     );
  //   });
  // }

  // remove(user_id: number): Promise<number> {
  //   return new Promise((resolve, reject) => {
  //     connection.query<OkPacket>(
  //       "DELETE FROM users WHERE id = ?",
  //       [user_id],
  //       (err, res) => {
  //         if (err) reject(err);
  //         else resolve(res.affectedRows);
  //       }
  //     );
  //   });
  // }
}
// export class WandModel {
//   private info: WandI;
//   constructor({ id, character_id, core, wand_length, wood }: WandI) {
//     this.info = {
//       id,
//       character_id,
//       wand_length,
//       core,
//       wood,
//     };
//   }
//   getAll() {
//     const sql = "SELECT * FROM wands";
//     return db.query(sql, [...Object.values(this.info)]);
//   }
//   // save(){
//   //   const
//   // }
// }
export default Wand;
