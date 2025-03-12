import { Router } from "express";
import { LogRoutes } from "./logs/routes";

export class AppRoutes{
    static get routes(): Router{
        const router = Router();

        router.use("/api/registros", LogRoutes.routes);

        return router;
    }
}