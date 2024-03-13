import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    password: {type:String,uniqe:true},
    description: String,
    email: {type:String,required: true, index: true, unique: true },
    myRecipes: [String],
    othersRecipes: [String]
});

const userModel = mongoose.model("users", userSchema);
export default userModel;