import UserModel from "../models/userModel.js";
import { UsernametoUuid } from "./mojangApiClient.js";

/** Decrements the number of aspects owed to a user by 1
 * @param username The user to decrement from
 */
export async function decrementAspects(username: string): Promise<void> {
    UserModel.updateOne(
        { uuid: await UsernametoUuid(username) },
        { username: username, $inc: { aspects: -1 } },
        {
            upsert: true,
            collation: { locale: "en", strength: 2 },
        }
    ).then(() => {
        console.log(username, "received an aspect");
    });
}
/** Increments the number of aspects owed to a user by 0.5
 * @param username The user to incr ement from
 */
export async function incrementAspects(username: string): Promise<void> {
    UserModel.updateOne(
        { uuid: await UsernametoUuid(username) },
        { username: username, $inc: { aspects: 0.5, raids: 1 } },
        {
            upsert: true,
            collation: { locale: "en", strength: 2 },
        }
    ).then(() => {
        console.log(username, "is owed half an aspect");
    });
}
