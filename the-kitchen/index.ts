import express, { Express, Request, Response } from 'express'; //server manager in js
import dotenv from 'dotenv'; //allows use of enviroment variables in ./.env
import cors from 'cors'; //cross origin resource sharing middleware
import testUserCode from './test-user-code'
import problemData from './problem-data.json';
import { mongo } from 'mongoose';

const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const UserModel = require('../models/Users');
const ProblemModel = require('../models/Problems.js')

dotenv.config(); //load .env file

const app: Express = express(); //see line 1

const port = process.env.PORT; //see line 2

app.use(express.json());
app.use(cors()); //see line 3 (modified by gio, originally use(cors))

// Connect to mongodb, (you need to set your ip on mongodb site in order to run this successfully)
mongoose.connect(
  process.env.MONGO_DB_CONNECT
);

app.get('/', (req: Request, res: Response) => { //get requests to eatcode.com/
  res.send('placeholder'); 
});

app.get('/problems', (req: Request, res: Response) => { //gets requests to eatcode.com/problems
  ProblemModel.find({}, (err: Error, result: Response) => {
    if(err) {
      res.json(err);
    } else {
      res.json({result:result});
    }
  })
})

app.post('/register', (req: Request, res: Response) => { //post requests to eatcode.com/register
  res.send('placeholder');
}); 
 
// TODO: check if user is already in DB, if yes then don't create new user.
// app.post("/getUserID", async (req: Request, res: Response) => { //post requests to eatcode.com/login
app.post("/login", async (req: Request, res: Response) => {
  const token = req.body.token;
  const decoded = jwt.decode(token);
  console.log(decoded);

  UserModel.find({userID:decoded.sub}, (err: Error, result: Array<typeof UserModel>) => { 
    if (err) {
      res.json(err);
    } else if (result.length == 0){
      const user = {
        userID: decoded.sub,
        name: decoded.name,
        email: decoded.email,
      };
      const newUser = new UserModel(user);
      newUser.save();
    }
  });
  res.json({sub:decoded.sub});
});

app.post("/create", async (req: Request, res: Response) => {
  const lastPost = await ProblemModel.find().sort({_id: -1}).limit(1);
  const inputs = req.body;
  inputs.id = lastPost[0].id+1;
  console.log(inputs.diff);
  const newProblem = new ProblemModel(inputs)
  await newProblem.save();

  res.json(inputs);
})


app.post('/userInfo', (req: Request, res: Response) => {
  const userSub = req.body.sub;
  console.log(userSub);
  UserModel.find({userID:userSub}, async (err: Error, result: Array<typeof UserModel>) => { 
    if (err) {
      res.json(err);
    } else {
      res.json({result:result});
    }
  });
});


app.post('/problems', async (req: Request, res: Response) => { //post requests to eatcode.com/problems
  const { userCode, userLanguage, questionID }: { userCode: string, userLanguage: string, questionID: number } = req.body; //destructure POST from client
  const { questionName, tests }: { questionName: string, tests: Array<any> } = problemData.problems[questionID]; //pull question data from json
  let result = await testUserCode(userLanguage, userCode, questionName, tests); //abstraction to test code against cases
  res.end(result); //send result back to client
});

app.listen(port, () => { //server listens to requests on port {port}
  console.log(`listening ${port}`);
}); 