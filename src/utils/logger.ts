import pino from "pino";

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
  },
  pino.destination({
    fd: 2 // stderr
  })
);