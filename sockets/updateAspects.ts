import UserModel from "../models/userModel.js";
export default function updateAspects(username: string): void {
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
