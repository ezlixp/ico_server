import UserModel from "../models/userModel.js";
import { UsernametoUUID } from "../services/ConvertMinecraftUser.js";
export default async function updateAspects(username: string): Promise<void> {
    UserModel.updateOne(
        { uuid: await UsernametoUUID(username) },
        { username: username, $inc: { aspects: -1 } },
        {
            upsert: true,
            collation: { locale: "en", strength: 2 },
        }
    ).then(() => {
        console.log(username, "received an aspect");
    });
}
