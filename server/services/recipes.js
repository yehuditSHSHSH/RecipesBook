import recipeModel from '../Model/recipeModule.js';
import userModel from '../Model/userModule.js';

export {
    validateRecipeName,
    findRecipesByName,
    enrichRecipesWithCreatorNames,
    createRecipeObject,
    updateUserRecipes,
    findExistingRecipe,
    updateRecipeFields,
    saveRecipe,
    getUserRecipes
}


function validateRecipeName(name) {
    if (!name) {
        throw new Error('לא סופק שם מתכון');
    }
}

async function findRecipesByName(regexPattern) {
    const data = await recipeModel.find({ name: regexPattern });
    return data;
}

async function enrichRecipesWithCreatorNames(recipes) {
    const enrichedRecipes = [];
    for (const recipe of recipes) {
        const creator = await findRecipeCreator(recipe);
        enrichedRecipes.push({
            ...recipe.toObject(),
            creatorName: creator.name
        });
    }
    return enrichedRecipes;
}

async function findRecipeCreator(recipe) {
    const creator = await userModel.findById(recipe.creatorID).exec();
    if (!creator) {
        throw new Error(`לא נמצא יוצר עבור המתכון עם המזהה ${recipe._id}`);
    }
    return creator;
}

function createRecipeObject(requestBody, image, userId) {
    const recipe = new recipeModel({
        name: requestBody.name,
        likes: requestBody.likes,
        category: requestBody.category,
        ingredients: requestBody.ingredients,
        preparationInstructions: requestBody.preparationInstructions,
        quantityOfProduce: requestBody.quantityOfProduce,
        durationOfPreparation: requestBody.durationOfPreparation,
        levelOfDifficulty: requestBody.levelOfDifficulty,
        description: requestBody.description,
        image: image,
        creatorID: userId,
    });
    return recipe;
}

async function updateUserRecipes(userId, recipeId) {
    try {
        const result = await userModel.updateOne(
            { _id: userId },
            {
                $push: {
                    myRecipes: recipeId
                }
            }
        );
        if (result.n === 0) {
            console.log('User not found');
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function findExistingRecipe(id) {
    const existingRecipe = await recipeModel.findById(id);
    return existingRecipe;
}

function updateRecipeFields(recipe, requestBody) {
    recipe.name = requestBody.name;
    recipe.category = requestBody.category;
    recipe.ingredients = requestBody.ingredients;
    recipe.preparationInstructions = requestBody.preparationInstructions;
    recipe.quantityOfProduce = requestBody.quantityOfProduce;
    recipe.durationOfPreparation = requestBody.durationOfPreparation;
    recipe.levelOfDifficulty = requestBody.levelOfDifficulty;
    recipe.description = requestBody.description;
}

async function saveRecipe(recipe) {
    const savedRecipe = await recipe.save();
    return savedRecipe;
}

async function getUserRecipes(userID, myOrOther) {
    const user = await userModel.findById(userID);
    const recipeIds = myOrOther === 'myRecipes' ? user.myRecipes : user.othersRecipes;
    const recipes = await Promise.all(recipeIds.map(recipeID => getRecipeWithCreatorName(recipeID, myOrOther)));
    return recipes;
}

async function getRecipeWithCreatorName(recipeID, myOrOther) {
    const recipe = await recipeModel.findById(recipeID);
    if (myOrOther !== 'myRecipes') {
        const creator = await userModel.findById(recipe.creatorID).exec();
        if (!creator) {
            throw new Error(`No creator found for recipe with ID ${recipe._id}`);
        }
        return { ...recipe.toObject(), creatorName: creator.name };
    }
    return recipe;
}

