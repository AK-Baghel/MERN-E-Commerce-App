import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken"

export const registerController = async (req, resp) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return resp.send({ error: `Data must be filled` })
        }

        //check user
        const existingUser = await userModel.findOne({ email });

        //existing user
        if (existingUser) {
            return resp.status(200).send({
                success: true,
                message: `Already Regitsered, Please Login`
            })
        }

        //register user
        const hashedPassword = await hashPassword(password);
        const user = new userModel({ name, email, phone, address, password: hashedPassword }).save()

        resp.status(201).send({
            success: true,
            message: "User Register Succesfully",
            user
        })


    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: `Erorr in Registration`,
            error
        })
    }
}

//POST LOGIN
export const loginController = async (req, resp) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return resp.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        //Check User
        const user = await userModel.findOne({ email });
        if (!user) {
            return resp.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return resp.status(200).send({
                success: false,
                message: "Inavalid Password"
            })
        }

        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })
        resp.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token
        })

    } catch (error) {
        resp.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
}