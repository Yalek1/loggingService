import cors from "cors";
import express, { Router } from "express";
import rateLimit from "express-rate-limit";

interface Options {
  port: number;
  routes: Router;
}

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
  message: "Demasiadas solicitudes desde esta IP, intente más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
        credentials: true,
      })
    );

    this.app.set("trust proxy", 1);
    this.app.use(limiter);

    //* Routes
    this.app.use(this.routes);

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Log Service running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
