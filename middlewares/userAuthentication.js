import { response } from "express";
import asyncHandler from "../utils/asyncHanlder.js";
import jwt from 'jsonwebtoken';


const userAuth = asyncHandler(async(req, res, next) => {
    const token = req.cookies.authToken;

    
    if(token){
        try {
            const response = jwt.verify(token, process.env.JWT_SECRET);
            return res.status(200).json({
                message: "User verified successfully",
                success : true
            });
        } catch (error) {
            console.log("Error fetching user detail from user cookie", error);
            return res.status(404).json({
                message: "Something went wrong while fetching the user detail",
                success: false
            })
        }
    }
    const response = res.status(404).json({
        message : "No token found",
        success: false
    })
    return next(response);
});

export default userAuth;