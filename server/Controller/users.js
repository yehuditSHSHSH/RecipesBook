import express from 'express';
import userModel from '../Model/userModule.js';
import recipeModel from '../Model/recipeModule.js';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
const router = express();
import {
  validateUserName,
  findUsersByName,
  getUsersWithRecipes,
  extractUserDataFromRequest,
  createUser,
  saveUser,
  handleError,
  generateToken,
  findAndUpdateUser,
  sendLoginResponse,
  handleUpdateUserError,
  findUserByEmail,
  validatePassword,
  findUserById,
  isRecipeCreatedByUser,
  isRecipeAlreadyAdded,
  updateUserOtherRecipes,
  addLike,
  removeLike,
  handleUserNotFound,
  updateUserRemoveOtherRecipe

} from '../services/users.js';

export {
  getUsersByName,
  addUser,
  updateUser,
  getUserById,
  login,
  addRecipeToUser,
  removeRecipeToUser
  // ,deleteUser
}

export default router;

async function getUsersByName(req, res) {
  try {
    const userName = req.query.name;
    validateUserName(userName); 
    const regexPattern = new RegExp(`^${userName}`, 'i');
    const users = await findUsersByName(regexPattern);
    if (users.length === 0) {
      return res.status(404).json({ error: 'לא נמצאו משתמשים שמתאימים לשאילתה' });
    }
    const usersWithRecipes = await getUsersWithRecipes(users); 

    res.json({ usersWithRecipes });
  } catch (error) {
    console.error('שגיאה בפונקציה getUsers:', error);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
}

async function addUser(req, res) {
  try {
    const userData = extractUserDataFromRequest(req);
    const user = await createUser(userData);
    await saveUser(user);
    res.message = 'User saved successfully';
    login(req, res);
  } catch (error) {
    handleError(error, res);
  }
}

async function updateUser(req, res) {
  try {
    const { name, password, description, email } = req.body;
    const updatedUser = await findAndUpdateUser(req.user._id, { name, password, description, email });

    if (!updatedUser) {
      return handleUserNotFound(res);
    }

     await sendLoginResponse(req, res);
  } catch (error) {
    console.log("catch");
    return handleUpdateUserError(error, res);
  }
}

function getUserById(req, res) {
  userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return handleUserNotFound(res);
      }
      res.send(user);
    })
    .catch((error) => {
      console.error('Error finding user', error);
      res.send(error);
    });
}

async function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await findUserByEmail(email);

    if (!user) {
      return handleUserNotFound(res);
    }

    if (!validatePassword(user, password)) {
      return res.status(405).send('The password is wrong');
    }

    const token = generateToken(user._id, email, password, user.name);

    res.user = user;
    return res.json({ token, user });
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).send(error);
  }
}

async function addRecipeToUser(req, res) {
  try {
    const recipId = req.params.recipeId;
    const userId = req.user._id;

    const user = await findUserById(userId);
    if (!user) {
      return handleUserNotFound(res);
    }

    if (isRecipeCreatedByUser(user, recipId)) {
      return res.status(405).send('That recipe creator is the user.');
    }

    if (isRecipeAlreadyAdded(user, recipId)) {
      return res.status(406).send('That recipe is already exist.');
    }

    await updateUserOtherRecipes(userId, recipId);
    await addLike(recipId);

    return res.send('add recipe to User success');
  } catch (error) {
    console.error('Error adding recipe to user:', error);
    return res.status(500).send('Internal Server Error.');
  }
}

async function removeRecipeToUser(req, res) {
  try {
    const recipId = req.params.recipeId;
    const userId = req.user._id;

    const user = await findUserById(userId);
    if (!user) {
      return handleUserNotFound(res);
    }

    await updateUserRemoveOtherRecipe(userId, recipId);
    await removeLike(recipId);

    return res.send('remove recipe to User success');
  } catch (error) {
    console.error('Error removing recipe from user:', error);
    return res.status(500).send('Internal Server Error.');
  }
}

// function deleteUser(req, res) {
  //   const { id } = req.params;
  
  //   userModel.findByIdAndDelete(id)
  //     .then((user) => {
  //       if (!user) {
  //         return res.status(404).send('User not found');
  //       }
  
  //       res.send('deleteUser success');
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting user:', error);
  //       res.send(error);
  //     });
// }