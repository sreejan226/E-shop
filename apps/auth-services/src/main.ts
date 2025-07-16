import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
}));

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

// Basic Swagger configuration
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: "Auth Service API",
        description: "API Documentation",
        version: "1.0.0"
    },
    servers: [
        {
            url: 'http://localhost:6001',
            description: 'Local server'
        }
    ],
    paths: {}  // Will be populated by route handlers
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req,res) => {
    res.json(swaggerDocument);
});

//Routes
app.use("/api", router);
app.use(errorMiddleware);

const port = process.env.port || 6001;
const server = app.listen(port, () => {
    console.log(`Auth service is running on http://localhost:${port}/api`);
    console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});

server.on("error", (err) => {
    console.log("Server error :", err);
});
