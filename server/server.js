var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = require('./config/db');
var security = require('./config/security');

var stormpath = require('stormpath');
var client = null;
var appStormpath = null;
var keyfile = security.apiKeyFile;

var app = express();
var port = 8000;

mongoose.connect(db.url);
var schemas = require('./config/designDB')(mongoose);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var UserModel = mongoose.model( 'User', schemas.userSchema );
 
var CafeModel = mongoose.model( 'Cafe', schemas.cafeSchema );

var FotoModel = mongoose.model( 'Foto', schemas.fotoSchema );

var CafeCommentModel = mongoose.model('CafeComment', schemas.cafeCommentSchema );

var MarksModel = mongoose.model('Marks', schemas.marksSchema);

var FavoritesModel = mongoose.model( 'Favorites', schemas.favoritesSchema);

var FotoCommentModel = mongoose.model( 'FotoComment', schemas.fotoCommentSchema);

var CafeCommentCommentModel = mongoose.model( 'CafeCommentComment', schemas.cafeCommentCommentSchema);

var NewsModel = mongoose.model( 'News', schemas.newsSchema);

var NewsCommentModel = mongoose.model( 'NewsComment', schemas.newsCommentSchema);

var UserFotoModel = mongoose.model( 'UserFoto', schemas.userFotoSchema);

var NewsCafeModel = mongoose.model( 'NewsCafe', schemas.newsCafeSchema);

var DiscussionModel = mongoose.model( 'Discussion', schemas.discussionSchema);

var DiscussionCommentModel = mongoose.model( 'DiscussionComment', schemas.discussionCommentSchema);

var UserDiscussionModel = mongoose.model( 'UserDiscussion', schemas.userDiscussionSchema);

var RankingModel = mongoose.model( 'Ranking', schemas.rankingSchema);

app.all('/*', function(req,res,next){
    res.contentType('application/json');
    res.set({
        'Access-Control-Allow-Origin':'*',
        "Access-Control-Allow-Methods":"PUT, DELETE, POST, GET, OPTIONS"
    });
    next();
});

var router = express.Router();

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
            res.status(err.status).send(err);
        }
        else{
            newUser.active = false;
            newUser.avatar = "";
            var user = new UserModel(newUser);
            user.save(function(err){
                if(!err){
                    acc.getCustomData(function(err, customData){
                        if(err) res.status(err.status).send(err);
                        customData.id = user._id;
                        customData.save(function(err){
                            if(err) res.status(err.status).send(err);
                            else res.json(newUser);   
                        });
                    });  
                }
                else {
                    console.log(err);
                    res.status(err.status).send(err);
                }

            });
        }
    });
});

router.post('/user/login/', function(req, res){
    console.log(req.body);
    appStormpath.authenticateAccount(req.body, function(err, result){
        if(err){
            console.log(err);
            res.status(err.status).send(err);
        }
        else {
            result.getAccount(function(err, account){
                if(err) res.status(err.status).send(err);
                else {
                    account.getCustomData(function(err, customData){
                        if(err) res.status(err.status).send(err);
                        else {
                            UserModel.findById(customData.id, function(err, user){
                                if(err) res.status(err.status).send(err);
                                else {
                                    user.lastLogin = Date.now();
                                    user.active = true;
                                    user.save(function(err, updUser){
                                        if(err) res.status(err.status).send(err);
                                        else {
                                            console.log(updUser);
                                            res.json(updUser);
                                        }
                                    });
                                    
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/user/logout/', function (req, res){
    console.log(req.body);
    console.log(req.body.email);
    UserModel.findOne ( {email : req.body.email} , function(err , user){
        if(err) res.status(err.status).send(err);
        else{
            user.active = false;
            user.save(function(err, updUser){
                if(err) res.status(err.status).send(err);
                else{
                    res.status(200).json({text: 'haha'});
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