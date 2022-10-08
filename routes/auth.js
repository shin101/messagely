const express = require("express");
const Router = require("express").Router;
const User = require("../models/user");
const router = new Router();

const db = require("../db");
const ExpressError = require("../expressError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config"); 
const { ensureLoggedIn } = require("../middleware/auth");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async (req, res, next) => {
    try {
        let {username, password} = req.body;
        if (await User.authenticate(username, password)){
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token});
        } else {
            throw new ExpressError("wrong credentials", 400);
        }
    } catch (e){
        return next(e);
    }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
 router.post('/register', async (req, res, next) => {
    try {
        let {username} = await User.register(req.body);
        let token = jwt.sign({ username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({token});

    } catch (e){
        // you can get the code by looking at postgres error codes online
        if(e.code === '23505'){
            return next(new ExpressError("Username taken. Please pick another!", 400));
        }
        return next(e)
    }
})





module.exports = router;


// notes 

 //  function authenticateJWT(req, res, next) {
  //   try {
  //    const tokenFromBody = req.body._token;
  //    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
  //    req.user = payload; // create a current user
  //    return next();
  //   } catch (err) {
  //    return next();
  //   }

