const express = require('express');
const router = express.Router();
const { sessionChecker } = require('../middleware/auth');
const User = require('../models/user');

// route for home page
router.get('/', function (req, res, next) {
  res.redirect('/entries');
});
// route for user signup
router.route('/signup')
  .get((req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
    } else {
      res.render('signup');
    }
  })
  .post(async (req, res) => {
    // if (req.body.password === '') {
    //   return res.status(200).json({isOk: false, errors: ['password must not be blank']});
    // }
    try {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      await user.save();
      // if (!req.body.password) { throw Error('No password!'); }
      req.session.user = user;
      res.redirect('/dashboard');
    }
    catch (error) {
      // let errorArr = [];
      // errorArr.push(error);
      console.log(error);

      return res.render('signup', { errors: error.errors });
    };
  });

// route for user Login
router.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username });
    if (!user) {
      res.redirect('/login');
    } else if (user.password !== password) {
      res.redirect('/login');
    } else {
      req.session.user = user;
      res.redirect('/entries');
    }
  });
// route for user's dashboard
// router.get('/dashboard', async (req, res) => {
//   if (req.session.user && req.cookies.user_sid) {
//     res.redirect('/entries');
//   } else {
//     res.redirect('/login');
//   }
// });
// route for user logout
router.get('/logout', async (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    try {
      // res.clearCookie('user_sid');
      await req.session.destroy();
      res.redirect('/');
    }
    catch (error) {
      next(error);
    }
  } else {
    res.redirect('/login');
  }
});

module.exports = router;