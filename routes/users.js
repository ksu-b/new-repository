const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');
const User = require('../models/user');

router.get('/:id/entries', async (req, res, next) => {
    let user = await User.findById(req.params.id);
    if (!user) {
        res.render('404');
        return;
    }
    let entries = await Entry.find({ authorID: user }).populate('authorID');
    if (req.session.user && req.cookies.user_sid) {
        res.render('list', { username: req.session.user.username, loggedIn: true, entries });
    } else {
        res.render('list', { entries });
    }
});

module.exports = router;