import {DataSource} from "typeorm";
import { ErrorLog } from "./models/logs.model";

interface Options {
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort: number;
    synchronize: boolean;
    logging: boolean;
}

export class PostgresDatabase {
    private static AppDataSource: DataSource;
    static async connect(options: Options) {
        const { dbName, dbUser, dbPassword, dbHost, dbPort, synchronize, logging } = options;
        this.AppDataSource =  new DataSource({
            type: "postgres",
            host: dbHost,
            port: dbPort,
            username: dbUser,
            password: dbPassword,
            database: dbName,
            synchronize,
            logging: logging,
            entities:[
                ErrorLog
            ],
        });
        try {
            await this.AppDataSource.initialize();
            return true;
        } catch (error) {
            console.log("Postgres connection error");
            throw error;
        }
    }
    static async disconnect(){
        await this.AppDataSource.destroy();
    }
}