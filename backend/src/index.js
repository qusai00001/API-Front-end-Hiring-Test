const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const tasksRouter = require("./routes/tasks");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi");  
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: "10kb" }));

// CORS locked to your FE origin
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  methods: ["GET","POST","PATCH","DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Security headers + CSP (bonus)
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "object-src": ["'none'"],
      "base-uri": ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: "same-site" }
}));

app.use("/tasks", tasksRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.get("/", (_req, res) => res.json({ ok: true }));

// Error handler → 500 fallback
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal" });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`API on :${PORT}`));
}
module.exports = app; // for tests
