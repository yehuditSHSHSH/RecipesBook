import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  quantityType: String
});

const recipeSchema = new mongoose.Schema({
  name: String,
  likes:Number,
  category:String,
  ingredients: [ingredientSchema],
  preparationInstructions: String,
  quantityOfProduce: Number,
  durationOfPreparation: Number,
  levelOfDifficulty: String,
  description: String,
  image: String,
  creatorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;