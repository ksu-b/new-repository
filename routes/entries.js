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

// # route handlers dealing with the collection
// get '/entries' do
// @entries = Entry.most_recent
//     erb :'entries/index'
// end
//
// post '/entries' do
// @entry = Entry.new(params[:entry])
//
// if @entry.save
//     redirect "/entries/#{@entry.id}"
// else
// @errors = @entry.errors.full_messages
// erb :'entries/new'
// end
// end
//
// get '/entries/new' do
//     erb :'entries/new'
//     end
//
//
// # route handlers dealing with a specific entry
// before '/entries/:id' do
//     pass if request.path_info.match /new/
// @entry = find_and_ensure_entry(params[:id])
// end
//
// get '/entries/:id' do
//     erb :'entries/show'
//     end
//
// put '/entries/:id' do
// @entry.assign_attributes(params[:entry])
//
// if @entry.save
//     redirect "entries/#{@entry.id}"
// else
// @errors = @entry.errors.full_messages
// erb :'entries/edit'
// end
// end
//
// delete '/entries/:id' do
// @entry.destroy
//     redirect '/entries'
// end
//
// get '/entries/:id/edit' do
// @entry = find_and_ensure_entry(params[:id])
// erb :'entries/edit'
// end