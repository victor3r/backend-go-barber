import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';
import uploadConfig from '@config/upload';

import ProfileController from '../controllers/ProfileController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    }),
  }),
  profileController.update,
);

profileRouter.get('/', profileController.show);

profileRouter.patch(
  '/avatar',
  upload.single('avatar'),
  userAvatarController.update,
);

export default profileRouter;
