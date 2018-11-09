var express = require('express');
var router = express.Router();
const models = require('./../models/index')
const Entry = models.entry;
console.log('started entries');
// entries
router.get('/', async function(req, res, next) {
    let entries = await Entry.mostRecent();
    console.log(entries);
    res.render('entries/index', { entries });
});

router.post('/', async function(req, res, next) {
    newEntry = await Entry.create({title: req.body.title, body: req.body.body});
    res.redirect(`/entries/${newEntry.id}`);
});

//new entries
router.get('/new', function(req, res, next) {
    res.render('entries/new');
});

//detail entry
router.get('/:id', async function(req, res, next) {
    let entry = await Entry.findById(req.params.id);
    res.render('entries/show', {entry});
});

router.put('/:id', async function(req, res, next) {
    let entry = await Entry.findById(req.params.id);

    entry.update({
        title: req.body.title,
        body: req.body.body
    }).then(() => {
        console.log(entry.id);
        res.redirect(`/entries/${entry.id}`);
    });

});

router.delete('/:id', async function(req, res, next) {
    let entry = await Entry.findById(req.params.id);
    entry.destroy();
    res.redirect('/');
});

router.get('/:id/edit', async function(req, res, next) {
    let entry = await Entry.findById(req.params.id);
    res.render('entries/edit', {entry});
});
module.exports = router;


