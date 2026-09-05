import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Server is running",
    });
});

app.use("/api/todos", todoRoutes);
app.use(errorHandler);

export default app;
