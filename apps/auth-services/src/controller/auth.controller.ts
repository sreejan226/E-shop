import { NextFunction, Request, Response } from "express";
import { checkOtpRestriction, handleForgotPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { setCookie } from "../utils/cookies/setCookie";
import { name } from "ejs";



//Register a new user

export const userRegistration = async (req: Request, res: Response, next:NextFunction) => {
    try {
        validateRegistrationData(req.body, "user")
        const {name,email} = req.body;

        const existingUser = await prisma.users.findUnique({where: {email}})

        if(existingUser){
            return next(new ValidationError("user already registered with this this email"))
        }

        await checkOtpRestriction(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "user-activation-mail");

        res.status(200).json({
            message: "Otp sent to your account. Please verify"
    })
    } catch (error) {
        return next(error)
    }

};

//verify user with otp

export const verifyUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, otp, password, name} = req.body;

        if(!email || !otp ||!password || !name){
            return next(new ValidationError("All fields are required"));
        }

                    const existingUser = await prisma.users.findUnique({where: {email}});

                    if(existingUser) {
                        return next (new ValidationError("User alredy exists with this email!"));
                    }

                    await verifyOtp(email, otp, next);
                    const hashedPassword = await bcrypt.hash(password,10);

                    await prisma.users.create({
                        data: {name, email, password:hashedPassword},
                    });
                    res.status(200).json({
                        success: true,
                        message: "User created Successfully!"
                    })

    } catch (error) {
        return next (error)
    }
}

//login user

export const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return next(new ValidationError("Email and password required"))
        }

        const user = await prisma.users.findUnique({where: {email}});

        if(!user) return next(new ValidationError("User does not exist!"));

        //verify password

        const isMatch = await bcrypt.compare(password, user.password!)
        if(!isMatch) {
            return next(new AuthError("Invalid email or password"))
        }

        //Generate access and refresh token

        const accessToken = jwt.sign({id: user.id , role: "user"},
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: "15m"
            }
        )

        const refreshToken = jwt.sign({id: user.id , role: "user"},
            process.env.REFRESH_TOKEN_SECRET as string,
            {
                expiresIn: "7d"
            }
        )

        //store the refresh and access token in an httpOnly secure cookie

        setCookie(res, "refresh_token", refreshToken);
        setCookie(res, "access_token", accessToken);

        res.status(200).json({
            message: "login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
        })

    } catch (error) {
        return next (error);
    }
}

//user forgot password

export const userForgotPassword = async (req:Request, res:Response, next: NextFunction) => {
    await handleForgotPassword (req, res, next, 'user');
}

//Verify forgot password otp

export const verifyUserForgotPassword = async (req:Request, res:Response, next:NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next);
}

// Reset user password

export const resetUserPassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, newPassword} =req.body;

         if(!email || !newPassword){
            return next(new ValidationError("Email and password required"))
        }

        const user = await prisma.users.findUnique({where: {email}});
        if(!user) return next (new ValidationError("User not found"))

        const isSamePassword = await bcrypt.compare(newPassword, user.password!);

        if(isSamePassword){
            return next(new ValidationError("New password cannot be same as old password"));
        }

        // hash the new password again

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: {email},
            data: {password: hashedPassword},
        })

        res.status(200).json({
            message: "Password reset successfully!"
        })

    } catch (error) {
        next(error);
    }
}