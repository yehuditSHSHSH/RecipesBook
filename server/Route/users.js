import express, { application } from 'express';
import * as users from '../Controller/users.js'
import middleware from '../MiddleWare/middle.js'

const router = express.Router();

router.post('/',users.addUser);
router.post('/login',users.login);
router.get('/', users.getUsersByName);
router.use(middleware);
router.get('/:getById',users.getUserById);
router.put("/:myOrOther/:recipeId", users.addRecipeToUser);
router.put("/:recipeId", users.removeRecipeToUser);
router.put("/",users.updateUser);
// router.delete('/:id/',users.deleteUser);

export default router;