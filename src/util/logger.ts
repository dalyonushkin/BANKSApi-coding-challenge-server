import winston, { Logger } from "winston";

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug"
    }),
    new winston.transports.File({filename: "debug.log", level: "debug"})
  ]
};

const logger = winston.createLogger(options);



if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export const addLogger = (name: string, label?: string): Logger => {
  return winston.loggers.add(name, Object.assign({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.label({label: label ? label : name, message: true}),
      winston.format.simple(),
      winston.format.splat()
    )
  }, options));
};

export default logger;