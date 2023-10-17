import express from 'express';
import auth from '../middleware/auth';
import userAuth from '../middleware/userAuth';
import userController from '../controller/user/UserController';

const router = express.Router();

router.get('/view', [auth, userAuth], userController.viewUser)
      .get("/view/all",[auth, userAuth],userController.viewAllUser)
      .put("/edit", [auth, userAuth], userController.editUser)
    
export default router;
