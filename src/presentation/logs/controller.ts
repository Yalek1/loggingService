import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { ErrorLogService } from "../services/logs.services";

export class LogsController {
  constructor(public readonly LogsService: ErrorLogService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        success: false,
        data: null,
        error: error.message,
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      data: null,
      error: "Internal server error",
    });
  };

  getErrorLogsByDateRange = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "Faltan fechas de inicio o fin.",
      });
    }

    try {
      const logs = await this.LogsService.getAllErrorLogsByDateRange(
        startDate as string,
        endDate as string
      );
      return res.status(200).json({ success: true, data: logs, error: null });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
