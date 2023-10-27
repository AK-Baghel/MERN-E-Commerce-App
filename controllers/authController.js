import userModel from "../models/userModel.js";
import { hashPassword } from "../helpers/authHelper.js";

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