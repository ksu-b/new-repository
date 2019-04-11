const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');
const { sessionChecker } = require('../middleware/auth');
console.log('started entries');

// entries
router.get('/', async (req, res, next) => {
    let recentEntries = await Entry.mostRecent();
    if (req.session.user && req.cookies.user_sid) {
        res.render('entries/index', { username: req.session.user.username, loggedIn: true, entries: recentEntries });
    } else {
        res.render('entries/index', { entries: recentEntries });
    }
});

router.post('/', async (req, res, next) => {
    let newEntry = new Entry({ title: req.body.title, body: req.body.body, author: req.session.user.username });
    await newEntry.save();
    res.redirect(`/entries/${newEntry.id}`);
});

//new entries
router.get('/new', sessionChecker, (req, res, next) => {

    res.render('entries/new');
});

//detail entry
router.get('/:id', sessionChecker, async (req, res, next) => {
    let entry = await Entry.findById(req.params.id);
    res.render('entries/show', { entry });
});

router.put('/:id', sessionChecker, async (req, res, next) => {
    let entry = await Entry.findById(req.params.id);

    entry.title = req.body.title;
    entry.body = req.body.body;
    await entry.save();

    res.redirect(`/entries/${entry.id}`);
});

router.delete('/:id', sessionChecker, async (req, res, next) => {
    await Entry.deleteOne({ '_id': req.params.id });
    res.redirect('/');
});

router.get('/:id/edit', sessionChecker, async (req, res, next) => {
    let entry = await Entry.findById(req.params.id);
    res.render('entries/edit', { entry });
});
module.exports = router;