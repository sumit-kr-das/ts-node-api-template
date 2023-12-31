import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import User from '../../model/User';
import CustomErrorHandler from '../../services/customErrorHandeler';
import JwtService from '../../services/jwtServices';

const loginController = {
    async login(req: Request, res: Response, next: NextFunction) {
        const userLoginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
        });

        const { error } = userLoginSchema.validate(req.body);

        if (error) {
            next(error);
        }

        const { email, password }: { email: string; password: string } =
            req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const matchPassword = await bcrypt.compare(password, user.password);
            if (!matchPassword) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const access_token = JwtService.sign({
                id: user._id,
                role: user.role,
            });

            res.status(200).json({ access_token });
        } catch (error) {
            next(error);
        }
    },
};

export default loginController;
