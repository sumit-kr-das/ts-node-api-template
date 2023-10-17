import { NextFunction, Response } from 'express';
import Joi from 'joi';
import User from '../../model/User';
import CustomErrorHandler from '../../services/customErrorHandeler';

const userController = {
    async viewAllUser(req: any, res: Response, next: NextFunction) {
        try {
            const users = await User.find().select('-password -updatedAt -__v');
            res.status(200).json(users);
        } catch (error) {
            return next(error);
        }
    },

    async viewUser(req: any, res: Response, next: NextFunction) {
        try {
            const user = await User.findOne({ _id: req.user.id }).select(
                '-password -updatedAt -__v',
            );
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            res.status(200).json(user);
        } catch (error) {
            return next(error);
        }
    },

    async editUser(req: any, res: Response, next: NextFunction) {
        const userSchema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
        });

        const { error } = userSchema.validate(userSchema);
        if (error) {
            next(error);
        }

        const update = await User.findByIdAndUpdate(
            { _id: req.user.id },
            {
                name: req.body?.name,
                email: req.body?.email,
            },
            {
                new: true,
            },
        );

        if (update) {
            res.status(200).json({ msg: 'User updated successfully' });
        } else {
            res.status(402).json({ msg: 'There are something wrong' });
        }
    },
};

export default userController;
