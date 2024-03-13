import express from 'express';
import * as recipe from '../Controller/recipes.js'
import middleware from '../MiddleWare/middle.js'
import upload from "../MiddleWare/uploads.js";

const router = express.Router();

router.get('/',
    (req, res) => {
        if (req.query.category) {
            recipe.getRecipesByCategory(req, res);
        }
        else {
            if (req.query.name) {
                recipe.getRecipesByName(req, res);
            }
            else {
                if (req.query.RecipeId) {
                    recipe.getRecipeById(req, res);
                }
            }
        }
    })
router.use(middleware);
router.put("/:id", upload.single('image'), recipe.updateRecipe);
router.get('/:myOrOther', recipe.getRecipesOfUser);
router.post('/', upload.single('image'), recipe.addRecipe)
// router.delete('/:id/',recipe.deleteRecipe);

export default router;