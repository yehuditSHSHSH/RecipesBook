import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import dbConnected from './DB/mongoCoennect.js'
import users from './Route/users.js'
import recipes from './Route/recipe.js'

const app = express();
const port = 3000;

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.use("/uploads", express.static("uploads"));
app.use("/users",users);
app.use("/recipes",recipes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


