import mongoose from "mongoose";
import { UserModel } from "./model/index.js";

export const bootstrapDB = async (app, port) => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 30000
        });

        await UserModel.syncIndexes()

        console.log(`DB Connected Successfully`);

        app.listen(port, () =>
            console.log(`Example app listening on port ${port}!`)
        );

    } catch (error) {
        console.log(error);
        console.log(`Fail to connect on DB`);
    }
}