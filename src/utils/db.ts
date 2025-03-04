import { connect, ConnectionOptions } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export async function connectToDB() {
    const options: ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    };

    await connect(
        <string>process.env.CONNECTION_STRING,
        options,
        (err) => {
            if (err) return console.error('Failed to connect in db!', err);
            console.info('Connection to db was successfull!')
        })
};
