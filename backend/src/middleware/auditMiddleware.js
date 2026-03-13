const AuditLog = require("../models/AuditLog");

const auditMiddleware = (action) => {
  return async (req, res, next) => {
    try {
      const log = {
        user: req.user ? req.user._id : null,
        action: action,
        method: req.method,
        route: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        timestamp: new Date(),
      };

      await AuditLog.create(log);

      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = auditMiddleware;