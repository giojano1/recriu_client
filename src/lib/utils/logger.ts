type LogLevel = "info" | "warn" | "error";

type LogContext = {
  userId?: string;
  action: string;
  error?: string;
  metadata?: Record<string, unknown>;
};

export const logger = {
  log(level: LogLevel, message: string, context?: LogContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };

    // In production, this should send to a logging service (e.g., Sentry, Datadog, CloudWatch)
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to monitoring service
      console[level](JSON.stringify(logEntry));
    } else {
      // Development: Pretty print
      console[level](`[${logEntry.timestamp}] ${message}`, context || "");
    }
  },

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  },

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  },

  error(message: string, context?: LogContext) {
    this.log("error", message, context);
  },
};
