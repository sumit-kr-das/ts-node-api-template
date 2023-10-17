import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import User from '../../model/User';
import CustomErrorHandler from '../../services/customErrorHandeler';
import JwtService from '../../services/jwtServices';

const registerController = {
    async register(req: Request, res: Response, next: NextFunction) {
        const registerSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
            role: Joi.string().required(),
        });

        const { error } = registerSchema.validate(req.body);
        if (error) {
            next(error);
        }
        const {
            name,
            email,
            password,
            role,
        }: { name: string; email: string; password: string; role: string } =
            req.body;

        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(
                    CustomErrorHandler.alreadyExist('User is already Exist!'),
                );
            }
        } catch (err) {
            next(err);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        let acc_token: any;

        try {
            const saveuser = await user.save();
            acc_token = JwtService.sign({
                id: saveuser.id,
                role: saveuser.role,
            });
            res.status(200).json({ acc_token: acc_token });
        } catch (error) {
            next(error);
        }
    },
};

export default registerController;
