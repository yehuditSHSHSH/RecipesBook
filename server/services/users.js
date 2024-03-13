import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import jwt from 'jsonwebtoken';
import recipeModel from '../Model/recipeModule.js';
import userModel from '../Model/userModule.js';

export {
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
}

function validateUserName(userName) {
    if (!userName) {
        throw new Error('לא סופק שם משתמש');
    }
}

async function findUsersByName(regexPattern) {
    return await userModel.find({ name: regexPattern });
}

async function getUsersWithRecipes(users) {
    const usersWithRecipes = [];

    for (const user of users) {
        const recipes = await getUserRecipes(user.myRecipes);
        usersWithRecipes.push({ user, recipes });
    }

    return usersWithRecipes;
}

async function getUserRecipes(recipeIDs) {// פעולת עזר פנימית
    const recipes = [];
    const promises = recipeIDs.map(async (recipeID) => {
        try {
            const recipe = await recipeModel.findById(recipeID);
            recipes.push(recipe);
        } catch (error) {
            console.error('Error in getting recipe by recipeID:', error);
            throw error;
        }
    });
    await Promise.all(promises);
    return recipes;
}

function extractUserDataFromRequest(req) {
    const { name, password, description, email } = req.body;
    return {
        name,
        password,
        description,
        email,
        myRecipes: [],
        othersRecipes: []
    };
}

async function createUser(userData) {
    return new userModel(userData);
}

async function saveUser(user) {
    await user.save();
}

function handleError(error, res) {
    if (error.code === 11000) {
        const duplicateFields = Object.keys(error.keyValue).join(', ');
        console.error(`Error saving user: Duplicate key error for fields: ${duplicateFields}`);
        return res.status(400).send(`Duplicate key error for fields: ${duplicateFields}`);
    } else {
        console.error('Error saving user:', error);
        return res.status(500).send('Internal Server Error.');
    }
}

function generateToken(id, email, password, name) {
    const secretKey = 'project_yehudit&sarit';
    const payload = {
        '_id': id,
        'email': email,
        'password': password,
        'name': name
    };

    const token = jwt.sign(payload, secretKey);
    return token;
}

async function findAndUpdateUser(id, updatedFields) {
    return userModel.findByIdAndUpdate(id, updatedFields, { new: true });
}

async function sendLoginResponse(req, res) {
    try {
        const token = generateToken(req.user._id, req.body.email, req.body.password, req.user.name);
        return res.json({ token:token, user: req.user });
    } catch (error) {
        return handleServerError(error, res);
    }
}

function handleUpdateUserError(error, res) {
    if (error.code === 11000) {
        const duplicateFields = Object.keys(error.keyValue).join(', ');
        console.error(`Error updating user: Duplicate key error for fields: ${duplicateFields}`);
        return res.status(400).send(`Duplicate key error for fields: ${duplicateFields}`);
    } else {
        console.error('Error updating user:', error);
        return res.status(500).send('Internal Server Error.');
    }
}

async function findUserByEmail(email) {
    return userModel.findOne({ email });
}

function validatePassword(user, password) {
    return user.password === password;
}

async function findUserById(userId) {
    return userModel.findById(userId);
}

function isRecipeCreatedByUser(user, recipId) {
    return user.myRecipes.includes(recipId);
}

function isRecipeAlreadyAdded(user, recipId) {
    return user.othersRecipes.includes(recipId);
}

async function updateUserOtherRecipes(userId, recipId) {
    return userModel.updateOne(
        { _id: userId },
        {
            $push: {
                othersRecipes: recipId
            }
        }
    );
}

function addLike(recipId) {
    var recipObjectId = new ObjectId(recipId);
    recipeModel.updateOne(
        { _id: recipObjectId },
        { $inc: { likes: 1 } }
    )
        .then(result => {
            if (!result) {
                return res.status(407).send('Recipe not found');
            }
            console.log('Likes updated successfully');
        })
        .catch(error => {
            console.error('Error updating likes:', error);
        });
}

function removeLike(recipId) {
    console.log("in removing like!");
    console.log(recipId);
    var recipObjectId = new ObjectId(recipId);
    recipeModel.updateOne(
        { _id: recipObjectId },
        { $inc: { likes: -1 } }
    )
        .then(result => {
            if (!result) {
                return res.status(407).send('Recipe not found');
            }
            console.log('Likes updated successfully');
        })
        .catch(error => {
            console.error('Error updating likes:', error);
        });
}

function handleUserNotFound(res) {
    return res.status(404).send('User not found.');
}

async function updateUserRemoveOtherRecipe(userId, recipId) {
    return userModel.updateOne(
        { _id: userId },
        {
            $pull: {
                othersRecipes: recipId
            }
        }
    );
}