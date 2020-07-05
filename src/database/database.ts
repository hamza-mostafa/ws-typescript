import * as Mongoose from "mongoose";
import { UserModel } from "./users/users.model";

let database: Mongoose.Connection;

export const connect = () => {

    const uri = "mongodb://localhost:27017/test?readPreference=primary&authSource=admin&appname=MongoDB%20Compass&ssl=false";

    if (database){
        return;
    }

    Mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).catch(err => console.error(err));

    database = Mongoose.connection;

    database.once("open", async () => {
        console.log("Connected to database");
    });
    database.on("error", () => {
        console.log("Error connecting to database");
    });
}

export const disconnect = () => {
    if (!database) {
        return;
    }
    Mongoose.disconnect().catch(err => console.error(err));
};
