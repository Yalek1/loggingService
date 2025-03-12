import { Between, DeepPartial } from "typeorm";
import axios from "axios";
import { Validators } from "../../config";
import { ErrorLog } from "../../data";
import { CustomError } from "../../domain";

export interface ICreateErrorLog {
    err_user_code: string;
    err_message: string;
    err_stack_trace?: string;
    err_endpoint?: string;
    err_method?: string;
    err_severity?: string;
}

export class ErrorLogService {
    private readonly USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://api-gateway/users";

    public async createErrorLog(createErrorLogDto: ICreateErrorLog) {
        try {
            const errorLog = ErrorLog.create(createErrorLogDto as DeepPartial<ErrorLog>);
            await errorLog.save();
            return errorLog;
        } catch (error) {
            throw CustomError.internalServer("Error Interno del Servidor");
        }
    }

    public async getAllErrorLogsByDateRange(startDate: string, endDate: string) {
        try {
            const logs = await ErrorLog.find({
                where: {
                    err_date: Between(new Date(startDate), new Date(endDate)),
                },
                order: {
                    err_date: "DESC",
                },
            });

            return Promise.all(
                logs.map(async (log) => {
                    if (Validators.isUUID(log.err_user_code)) {
                        try {
                            const response = await axios.get(`${this.USER_SERVICE_URL}/${log.err_user_code}`);
                            const user = response.data;
                            
                            return {
                                ...log,
                                err_user_code: `${user?.name ?? ''} ${user?.lastname ?? ''}`.trim() || log.err_user_code,
                            };
                        } catch (error) {
                            console.error(`Error obteniendo usuario ${log.err_user_code}:`, error.message);
                            return log;
                        }
                    } else {
                        return log;
                    }
                })
            );
        } catch (error) {
            throw CustomError.internalServer("Error Interno del Servidor");
        }
    }
}
