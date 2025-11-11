import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetMySchedule } from "./routes/getmyschedule";
import { handleGetUser } from "./routes/getuser";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Schedule API routes
  app.get("/api/getmyschedule/:id", handleGetMySchedule);
  app.get("/api/getmyschedule/:id/:date", handleGetMySchedule);
  app.get("/api/getuser/:id", handleGetUser);

  return app;
}
