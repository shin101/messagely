const app = require("../app");
const ExpressError = require("../expressError");

const Router = require("express").Router;

const router = new Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
//  any logged-in user can see the list of users

router.get('/', ensureLoggedIn, async (req, res, next)=>{
    try {
        let users = User.all()
        return res.json({users});

    } catch(e){
        return next(new ExpressError("Please login first!", 401))
    }
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
 router.get('/:username', ensureCorrectUser, async (req, res, next)=>{
    try {
        let user = await User.get(req.params.username);
        return res.json({user});

    } catch(e){
        return next(new ExpressError("Please login first!", 401))
    }
})



/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    try {
        let msg = await User.messagesTo(req.params.username);
        return res.json({msg});
    } catch(e){
        return next(new ExpressError("Please login first!", 401))
    }
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
    try {
        let msg = await User.messagesFrom(req.params.username);
        return res.json({msg});
    } catch(e){
        return next(new ExpressError("Please login first!", 401))
    }
});


module.exports = router;