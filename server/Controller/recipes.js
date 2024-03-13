import express from 'express';
import recipeModel from '../Model/recipeModule.js';
import userModel from '../Model/userModule.js';
import {
  validateRecipeName,
  findRecipesByName,
  enrichRecipesWithCreatorNames,
  createRecipeObject,
  updateUserRecipes,
  findExistingRecipe,
  updateRecipeFields,
  saveRecipe,
  getUserRecipes
} from '../services/recipes.js';

const router = express();

export {
  getRecipesByName,
  addRecipe,
  updateRecipe,
  getRecipeById,
  getRecipesOfUser,
  getRecipesByCategory
  // ,deleteRecipe
}
export default router;

async function getRecipesByName(req, res) {
  try {
    const recipeName = req.query.name;
    validateRecipeName(recipeName);

    const regexPattern = new RegExp(`^${recipeName}`, 'i');
    const data = await findRecipesByName(regexPattern);
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'לא נמצאו מתכונים שמתאימים לשאילתה' });
    }

    const recipes = await enrichRecipesWithCreatorNames(data);
    
    res.json(recipes);
  } catch (error) {
    console.error('שגיאה בפונקציה getRecipes:', error);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
}

async function addRecipe(req, res) {
  try {
    const image = req.file.path;
    const recipe = createRecipeObject(req.body, image,req.user._id);
    const savedRecipe = await saveRecipe(recipe);
    await updateUserRecipes(req.user._id, savedRecipe._id);
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).send('Internal Server Error.');
  }
}

async function updateRecipe(req, res) {
  try {
    const existingRecipe = await findExistingRecipe(req.params.id);
    if (!existingRecipe) {
      return res.status(404).send('Recipe not found');
    }

    updateRecipeFields(existingRecipe, req.body);

    if (req.file) {
      const { path: image } = req.file;
      existingRecipe.image = image;
    }

    const updatedRecipe = await saveRecipe(existingRecipe);
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).send('Internal Server Error.');
  }
}

function getRecipeById(req, res) {
  const id = req.query.RecipeId;
  recipeModel.findById(id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send('Recipe not found');
      }
      res.send(recipe);
    })
    .catch((error) => {
      res.send(error);
    });
}

async function getRecipesOfUser(req, res) {
  try {
    const myOrOther = req.params.myOrOther;
    const userID = req.user._id;
    const recipes = await getUserRecipes(userID, myOrOther);
    res.json({ recipes, user: req.user });
  } catch (error) {
    console.error('Error in getting recipes:', error);
    res.status(500).json({ error: 'Error in getting recipes' });
  }
}
  
  async function getRecipesByCategory(req, res) {
    try {
      const category = req.query.category;
      const recipes = await recipeModel.find({ category }).exec();    
      const recipesWithCreatorNames = [];
      for (const recipe of recipes) {
        const creator = await userModel.findById(recipe.creatorID).exec();
        if (!creator) {
          throw new Error(`No creator found for recipe with ID ${recipe._id}`);
        }
        const recipeWithCreatorName = {
        ...recipe.toObject(),
        creatorName: creator.name
      };
      recipesWithCreatorNames.push(recipeWithCreatorName);
    }
    res.json(recipesWithCreatorNames);
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return res.status(500).json({ error: 'Error fetching recipes by category' });
  }
}

// function deleteRecipe(req, res) {
  //   const { id } = req.params;
  
  //   recipeModel.findByIdAndDelete(id)
  //     .then((recipe) => {
  //       if (!recipe) {
  //         return res.status(404).send('Recipe not found');
  //       }
  
  //       res.send('delete Recipe success');
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting recipe:', error);
  //       res.send(error);
  //     });
// }