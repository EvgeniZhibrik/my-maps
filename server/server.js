var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var stormpath = require('express-stormpath');
var db	 = require('./config/db');
var security = require('./config/security');

var app = express();
var morgan = require('morgan');
app.use(morgan);
app.use(stormpath.init(app, {
     apiKeyFile: security.apiKeyFile,
     application: security.application,
     secretKey: security.secretKey
}));

var port = 8000;

mongoose.connect(db.url);
 
app.use(bodyParser.urlencoded({ extended: true }));
 
addAPIRouter(app, mongoose, stormpath);

app.use(function(req, res, next){
   res.status(404);
   res.json({ error: 'Invalid URL' });
});

app.listen(port);

console.log('Magic happens on port ' + port);
 
exports = module.exports = app;

var userSchema = new mongoose.Schema({
         active: Boolean,
         email: { type: String, trim: true, lowercase: true },
         firstName: { type: String, trim: true },
         lastName: { type: String, trim: true },
         sp_api_key_id: { type: String, trim: true },
         sp_api_key_secret: { type: String, trim: true },
         subs: { type: [mongoose.Schema.Types.ObjectId], default: [] },
         created: { type: Date, default: Date.now },
         lastLogin: { type: Date, default: Date.now },
     },
     { collection: 'user' }
);

userSchema.index({email : 1}, {unique:true});
userSchema.index({sp_api_key_id : 1}, {unique:true});

var UserModel = mongoose.model( 'User', userSchema );

var feedSchema = new mongoose.Schema({
         feedURL: { type: String, trim:true },
         link: { type: String, trim:true },
         description: { type: String, trim:true },
         state: { type: String, trim:true, lowercase:true, default: 'new' },
         createdDate: { type: Date, default: Date.now },
         modifiedDate: { type: Date, default: Date.now },
     },
     { collection: 'feed' }
);
 
feedSchema.index({feedURL : 1}, {unique:true});
feedSchema.index({link : 1}, {unique:true, sparse:true});
 
var FeedModel = mongoose.model( 'Feed', feedSchema );

var feedEntrySchema = new mongoose.Schema({
         description: { type: String, trim:true },
         title: { type: String, trim:true },
         summary: { type: String, trim:true },
         entryID: { type: String, trim:true },
         publishedDate: { type: Date },
         link: { type: String, trim:true  },
         feedID: { type: mongoose.Schema.Types.ObjectId },
         state: { type: String, trim:true, lowercase:true, default: 'new' },
         created: { type: Date, default: Date.now },
     },
     { collection: 'feedEntry' }
);
 
feedEntrySchema.index({entryID : 1});
feedEntrySchema.index({feedID : 1});
 
var FeedEntryModel = mongoose.model( 'FeedEntry', feedEntrySchema );

var userFeedEntrySchema = new mongoose.Schema({
         userID: { type: mongoose.Schema.Types.ObjectId },
         feedEntryID: { type: mongoose.Schema.Types.ObjectId },
         feedID: { type: mongoose.Schema.Types.ObjectId },
         read : { type: Boolean, default: false },
     },
     { collection: 'userFeedEntry' }
 );

userFeedEntrySchema.index({userID : 1, feedID : 1, feedEntryID : 1, read : 1});
 
var UserFeedEntryModel = mongoose.model('UserFeedEntry', userFeedEntrySchema );

function addAPIRouter(app, mongoose, stormpath) {
 
    app.get('/*', function(req, res, next) {
        res.contentType('application/json');
        next();
    });
    app.post('/*', function(req, res, next) {
        res.contentType('application/json');
        next();
    });
    app.put('/*', function(req, res, next) {
        res.contentType('application/json');
        next();
    });
    app.delete('/*', function(req, res, next) {
        res.contentType('application/json');
        next();
    });

    var router = express.Router();
    
    router.post('/user/enroll', function(req, res) {
        logger.debug('Router for /user/enroll');
    });

    router.get('/feeds', stormpath.apiAuthenticationRequired, function(req, res) {
        logger.debug('Router for /feeds');
    });
    router.put('/feeds/subscribe', stormpath.apiAuthenticationRequired, function(req, res) {
       logger.debug('Router for /feeds');
    });
    app.use('/api/v1.0', router);
};
