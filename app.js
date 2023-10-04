import express, { json } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import globalErrHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";


const app = express();

//Allow cross-orgin request
app.use(cors());

//Set secure HTTP header
app.use(helmet());

//Limit request from same API
const limiter = rateLimit({
  max: 150000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this API, please try again later",
});

app.use("/api", limiter);

//Body parser, reading data from request
app.use(
  json({
    limit: "25MB",
  })
);

// Data sanitization against sql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/org", organizationRoutes);
app.use("/api/v1/branch",branchRoutes);


// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});

app.use(globalErrHandler);

export default app;
