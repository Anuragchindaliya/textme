import * as z from "zod";
import db from "../../config/db";
import {
  FieldPacket,
  OkPacket,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
const Note = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  category_id: z.coerce.number(),
  updated_at: z.string(),
});
// type NoteType = {
//   id: number;
//   title: string;
//   content: string;
//   created_at: string;
//   category_id: number;
//   updated_at: string;
// }
const getFilterSql = (filter: Record<string, string | number>) => {
  const filterKeys = Object.keys(filter).reduce((sql, key, i) => {
    const join = i ? " AND " : "";
    sql += ` \`${join}${key}\` = ? `;
    return sql;
  }, " WHERE ");
  const filterValues = Object.values(filter);
  return {
    filterKeys,
    filterValues,
  };
};
export type NoteType = z.infer<typeof Note>;

export class NoteRepository {
  readAll(
    filter: Partial<NoteType>
  ): Promise<[RowDataPacket[], FieldPacket[]]> {
    if (!!Object.keys(filter).length) {
      // Boolean(Object.keys(filter).length))
      const filterResult = getFilterSql(filter);
      const sql = `SELECT * FROM notes ${filterResult.filterKeys}`;
      return db.query(sql, filterResult.filterValues);
    }

    return db.query("SELECT * FROM notes");
  }
  readByTitle(title: string): Promise<[RowDataPacket[], FieldPacket[]]> {
    return db.query(`SELECT * FROM notes WHERE title = ?`, title);
  }

  updateByTitle({
    title,
    content,
  }: {
    title: string;
    content: string;
  }): Promise<[ResultSetHeader, any]> {
    return db.query(`UPDATE notes SET content = ? WHERE title = ?`, [
      content,
      title,
    ]);
  }
  // update(user: IUser): Promise<IUser | undefined> {
  //     return new Promise((resolve, reject) => {
  //       connection.query<OkPacket>(
  //         "UPDATE users SET email = ?, password = ?, admin = ? WHERE id = ?",
  //         [user.email, user.password, user.admin, user.id],
  //         (err, res) => {
  //           if (err) reject(err);
  //           else this.readById(user.id!).then(resolve).catch(reject);
  //         }
  //       );
  //     });
  //   }

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

  //

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
export default Note;
