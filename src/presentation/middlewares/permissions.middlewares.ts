import { NextFunction, Request, Response } from "express";
import axios from "axios";

export class PermissionsMiddleware {
  static async validateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;

      if (!user || !user.roles || user.roles.length === 0) {
        return res.status(403).json({ error: "No tienes permisos suficientes." });
      }

      const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://api-gateway/auth";
      const moduleName = req.baseUrl.split("/").at(2); 

      if (!moduleName) {
        return res.status(403).json({ error: "No tienes permisos para acceder a este recurso." });
      }

      const { data } = await axios.post(`${AUTH_SERVICE_URL}/validate-permissions`, {
        roles: user.roles,
        module: moduleName,
        method: req.method.toLowerCase(),
      });

      if (!data.success || !data.hasPermission) {
        return res.status(403).json({ error: "No tienes permisos para acceder a este recurso." });
      }

      next();
    } catch (error) {
      console.error("Error validando permisos:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
