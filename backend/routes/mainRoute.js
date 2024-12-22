const express = require('express');

const mainRouter = express.Router();

const userRouter = require('./user');
const adminRouter = require('./admin');

mainRouter.use('/user',userRouter);
mainRouter.use('/admin',adminRouter);

module.exports = mainRouter;