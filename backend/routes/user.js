const express = require('express');
const userRouter = express.Router();
const { User, Todos } = require('../db/db');
const jwt = require('jsonwebtoken');
const { validateInputs } = require('./middlewares/zod/inputValidation');
const { auth_user, current_user } = require('./middlewares/usermiddlewares/auth-middleware');
const { fecthUserDB } = require('./middlewares/usermiddlewares/signin-middleware');
const {generate_JWT_key, JWT_KEY} = require('./middlewares/usermiddlewares/JWT/generate-auth-key');
const { verifyUserExistence } = require('./middlewares/usermiddlewares/signup-middleware');
const { generate_hashed_password } = require('./middlewares/usermiddlewares/hashfns/hash-password');
const { getTodos } = require('./middlewares/usermiddlewares/helperFNs/getTodos');

//routes
userRouter.post('/signup', validateInputs, verifyUserExistence , async (req,res)=>{
    const {username,password} = req.body;
    try {
        const response = await generate_hashed_password(password);
        if (response.success) {
            const user = await User.create({
                Username: username,
                Password: response.hashed_password
            });

            res.status(201).json({
                msg: `Account created successfully with userId ${user._id}`,
                success : true
            });
        } else {
            res.status(500).json({
                msg: `An error occurred while hashing the password. Please try again.`,
                success: false
            });
        }
    } catch (error) {
        console.log(error)
    }
});

userRouter.post('/signin', validateInputs, fecthUserDB, (req,res)=>{
    const {username,password} = req.body;
    try{
        const auth_token  = generate_JWT_key(username);  
        res.json({
            token : auth_token
        })
    }
    catch(e){
        res.json({
            error : e,
            msg : 'Error while generating auth_token Please Try again!',
            success : false
        })
    }
});



//(get) -end points
userRouter.get('/gettodos',auth_user,async(req,res)=>{
    //returns all the todos of the user
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];  // removing the Bearer

    const username = jwt.verify(token,JWT_KEY);
    const Current_user  = await current_user(username)
    const todos = await getTodos(Current_user._id);

    res.json({
        todos
    })
});

userRouter.get('/getusername',auth_user,(req,res)=>{
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];  // removing the Bearer

    const username = jwt.verify(token,JWT_KEY);

    res.json({
        username
    })
});



//(post -endpoints)
userRouter.post('/addtodo',auth_user,async(req,res)=>{
    const {title,description} = req.body;
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];  // removing the Bearer

    const username = jwt.verify(token,JWT_KEY);
    const Current_user  = await current_user(username);

    const todo = await Todos.create({
        userId : Current_user._id,
        Title : title,
        Description : description,
        Completed : false,
        Time :  new Date()
    });

    res.json({
        msg : `Todo created successfully with id:${todo._id}`,
        success : true
    })
});



userRouter.post('/markasdone',auth_user,async(req,res)=>{
    const todoid = req.query.todoid;

    await Todos.updateOne({_id : todoid,
    },{
        Completed : true
    })

    res.json({
        msg : 'Succesfully marked as done',
        success : true
    })
});



//(put) -end points
userRouter.put('/update',validateInputs,verifyUserExistence,auth_user,async(req,res)=>{
    //updates user details (username and password)
    const {username,password} = req.body;
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];  // removing the Bearer

    const old_username = jwt.verify(token,JWT_KEY);

    if(password == null || password == ''){
        const user = await User.updateOne({
            Username : old_username
        },{
            Username : username
        })
    }
    else{
        const hash = await generate_hashed_password(password);
        const user = await User.updateOne({
            Username : old_username
        },{
            Username : username,
            Password : hash.hashed_password
        })
    }

    const new_usr = await User.findOne({
        Username :  username
    })


    res.json({
        msg : 'User details updated successfully Please signin again for authentication',
        success : true
    })


});

userRouter.put('/updatetodo',auth_user,async(req,res)=>{
    //updates todo (Title and Description)
    const todoid = req.query.todoid;
    const {title,description} = req.body;

    await Todos.updateOne({
        _id : todoid
    },{
        Title : title,
        Description : description
    })

    res.json({
        msg : `Todo with ${todoid} updated successfully`,
        success : true
    })
});


//delete -end points
userRouter.delete('/removetodo',auth_user,async(req,res)=>{
    const todoid = req.query.todoid;

    await Todos.deleteOne({
        _id : todoid
    })

    res.json({
        msg : `Todo with ${todoid} deleted successfully`,
        success : true
    })
});



//Global-cathes
userRouter.use((err, req, res, next) => {
    console.error('You have been caught up', err);
    res.status(500).send('Something broke!');
});


module.exports = userRouter;