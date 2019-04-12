const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId;

const entrySchema = new mongoose.Schema({
    title: String,
    body: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    authorID: {type: ObjectId, required: true, ref: 'User'}
});

entrySchema.virtual('date')
  .get(function() {
    return moment(this.createdAt).format('LL');
  });

entrySchema.statics.mostRecent = async function () {
    let arr = await this.find().populate("authorID");
    arr = arr.sort((a, b) => {
        return b.createdAt - a.createdAt;
    }).slice(0,5);
    return arr;
}

module.exports = mongoose.model('Entry', entrySchema);