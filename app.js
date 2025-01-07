import express from 'express';
import userRoute from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors';


const app = express();


app.use(express.static("public"));
app.use(express.json({limimt: "16kb"}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://basic-payment-app-frontend.vercel.app",
    credentials: true,
    
  })
);

app.use("/api/v1/users", userRoute);


export default app;