import UserModel from "../models/userModel.js";
export default async function updateAspects(username: string): Promise<void> {
    UserModel.updateOne(
        { username: username },
        { $inc: { aspects: -1 } },
        {
            upsert: true,
            collation: { locale: "en", strength: 2 },
        }
    ).then(() => {
        console.log(username, "received an aspect");
    });
}
