import { Router } from "express";
import { LogsController } from "./controller";
import { ErrorLogService } from "../services/logs.services";
import { PermissionsMiddleware } from "../middlewares/permissions.middlewares";

export class LogRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new ErrorLogService();
    const controller = new LogsController(service);

    // Solo validamos permisos de rol
    router.get( "/", [PermissionsMiddleware.validateRole],
      controller.getErrorLogsByDateRange
    );

    return router;
  }
}
