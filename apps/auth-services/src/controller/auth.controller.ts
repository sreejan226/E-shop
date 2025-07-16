import { NextFunction, Request, Response } from "express";
import { checkOtpRestriction, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
import bcrypt from "bcryptjs"



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

export const verfyUser = async (req:Request, res:Response, next:NextFunction) => {
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