var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db	 = require('./config/db');
var security = require('./config/security');

var stormpath = require('stormpath');
var client = null;
var appStormpath = null;
var keyfile = security.apiKeyFile;

var app = express();
var port = 8000;

mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
var userSchema = new mongoose.Schema({
        active: Boolean,
        email: { type: String, trim: true, lowercase: true },
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        avatar: { type: String, trim: true },
        friends: { type: [mongoose.Schema.Types.ObjectId], default: [] },
        created: { type: Date, default: Date.now },
        lastLogin: { type: Date, default: Date.now },
        details: mongoose.Schema.Types.Mixed
    },
    {
        collection: 'user' 
    }
);

var UserModel = mongoose.model( 'User', userSchema );

var cafeSchema = new mongoose.Schema({
        name: {type: String, trim: true},
        website: {type: String, trim: true, default: ''},
        coordinates: {
            latitude: {type: Number},
            longitude: {type: Number}
        },
        description: {type: String, trim: true},
        publishedBy: { type: mongoose.Schema.Types.ObjectId },
        published: { type: Date},
        menu: mongoose.Schema.Types.Mixed
    },
    {
        collection: 'cafe'
    }
);
 
 var CafeModel = mongoose.model( 'Cafe', cafeSchema );

var fotoSchema = new mongoose.Schema({
        description: { type: String, trim: true },
        title: { type: String, trim: true },
        cafeID: { type: mongoose.Schema.Types.ObjectId },
        publishedBy: {type: mongoose.Schema.Types.ObjectId},
        published: { type: Date },
        link: { type: String, trim: true  }
    },
    {
        collection: 'foto' 
    }
);
 
var FotoModel = mongoose.model( 'Foto', fotoSchema );

var cafeCommentSchema = new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        cafeID: { type: mongoose.Schema.Types.ObjectId },
        text: { type: String, trim: true},
        date: { type: Date }
    },
    {
        collection: 'cafeComment' 
    }
 );

var CafeCommentModel = mongoose.model('CafeComment', cafeCommentSchema );

var marksSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        cafeID: { type: mongoose.Schema.Types.ObjectId },
        category: { type: mongoose.Schema.Types.ObjectId }, 
        mark: { type: Number }
    },
    {
        collection: 'marks' 
    }
 );

var MarksModel = mongoose.model('Marks', marksSchema);

var favoritesSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        cafeID: { type: mongoose.Schema.Types.ObjectId },
    },
    {
        collection: 'favorites' 
    }
 );

var FavoritesModel = mongoose.model( 'Favorites', favoritesSchema);

var fotoCommentSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        fotoID: { type: mongoose.Schema.Types.ObjectId },
        text: { type: String, trim: true}, 
        date: { type: Date }
    },
    {
        collection: 'fotoComment' 
    }
 );

var FotoCommentModel = mongoose.model( 'FotoComment', fotoCommentSchema);


var cafeCommentCommentSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        cafeCommentID: { type: mongoose.Schema.Types.ObjectId },
        text: {type: String, trim: true},
        date: { type: Date }
    },
    {
        collection: 'cafeCommentComment' 
    }
 );

var CafeCommentCommentModel = mongoose.model( 'CafeCommentComment', cafeCommentCommentSchema);

var newsSchema =  new mongoose.Schema({
        text: { type: String, trim: true},
        link: { type: String, trim: true},
        date: { type: Date }
    },
    {
        collection: 'news' 
    }
 );

var NewsModel = mongoose.model( 'News', newsSchema);

var newsCommentSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        newsID: { type: mongoose.Schema.Types.ObjectId },
        text: { type: String, trim: true},
        date: { type: Date }
    },
    {
        collection: 'newsComment' 
    }
 );

var NewsCommentModel = mongoose.model( 'NewsComment', newsCommentSchema);

var userFotoSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        fotoID: { type: mongoose.Schema.Types.ObjectId }
    },
    {
        collection: 'userFoto' 
    }
 );

var UserFotoModel = mongoose.model( 'UserFoto', userFotoSchema);

var newsCafeSchema =  new mongoose.Schema({
        newsID: { type: mongoose.Schema.Types.ObjectId },
        cafeID: { type: mongoose.Schema.Types.ObjectId }
    },
    {
        collection: 'newsCafe' 
    }
 );

var NewsCafeModel = mongoose.model( 'NewsCafe', newsCafeSchema);

var discussionSchema = new mongoose.Schema({
        title: { type: String, trim: true},
        createdBy: { type: mongoose.Schema.Types.ObjectId},
        created: {type: Date, default: Date.now}
    },
    {
        collection: 'discussion' 
    }
 );

var DiscussionModel = mongoose.model( 'Discussion', discussionSchema);

var discussionCommentSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        discussionID: { type: mongoose.Schema.Types.ObjectId },
        text: { type: String, trim: true},
        date: { type: Date }
    },
    {
        collection: 'discussionComment' 
    }
 );

var DiscussionCommentModel = mongoose.model( 'DiscussionComment', discussionCommentSchema);

var userDiscussionSchema =  new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId },
        discussionID: { type: mongoose.Schema.Types.ObjectId }
    },
    {
        collection: 'userDiscussion' 
    }
 );

var UserDiscussionModel = mongoose.model( 'UserDiscussion', userDiscussionSchema);

var rankingSchema =  new mongoose.Schema({
        category: { type: String, trim: true},
        mark: {type: Number }
    },
    {
        collection: 'ranking' 
    }
 );

var RankingModel = mongoose.model( 'Ranking', rankingSchema);

app.all('/*', function(req,res,next){
    res.contentType('application/json');
    res.set({
        'Access-Control-Allow-Origin':'*',
        "Access-Control-Allow-Methods":"PUT, DELETE, POST, GET, OPTIONS"
    });
    next();
});

var router = express.Router();

router.get('/', function(req, res){
    console.log('haha');
    res.json({ name : "qwerty"});
});

router.post('/user/register/',function(req, res){
    var newUser = req.body;
    var account = {
        givenName: newUser.firstName,
        surname: newUser.lastName,
        email: newUser.email,
        password: newUser.password
    };
    console.log(appStormpath);
    appStormpath.createAccount(account, function(err, acc){
        if(err){
            console.log(err);
            res.status(err.status).send(err.message);
        }
        else{
            newUser.active = true;
            newUser.avatar = "";
            var user = new UserModel(newUser);
            user.save(function(error){
                if(!error){
                    newUser.id = user._id;
                    res.json(newUser);
                }
                else{
                    console.log(error);
                    res.status(400).send('DB :(');
                }

            });
        }
    });
});

app.use('/api/v1.0', router);

stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
    if (err) throw err;
    client = new stormpath.Client({apiKey: apiKey});
    console.log('Created client! ' + client);
    
    client.getApplication(security.application ,function(error, application) {
        if (error) throw error;
        appStormpath = application;
        console.log('Stormpath Application retrieved! ' + appStormpath) ;
        app.listen(port);
    });
});