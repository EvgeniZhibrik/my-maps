var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = require('./config/db');
var security = require('./config/security');
var cloudinary = require('cloudinary');
var cloudConfig = require('./config/cloud');
var stormpath = require('stormpath');
var client = null;
var appStormpath = null;
var keyfile = security.apiKeyFile;

var app = express();
var port = 8000;

mongoose.connect(db.url);
var schemas = require('./config/designDB')(mongoose);
cloudinary.config(cloudConfig);
var cloudinary_cors = "D:/Exadel/my-maps/server/config/cloudinary_cors.html";
cloudinary.uploader.image_upload_tag('image_id', { callback: cloudinary_cors });
var t;

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

router.get('/upload_tag/', function(req, res){
    console.log('GET upload tag');
    var s = cloudinary.uploader.image_upload_tag('image_id',{ 
        disableImageResize: false,
        imageMaxWidth: 1000,
        imageMaxHeight: 1000,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
        maxFileSize: 5000000 // 5MB 
    });
    console.log("response: "+s);
    res.json({tag: s});
});

router.delete('/image/:public_id/:stored/', function(req, res){
    console.log("DELETE " + req.params.public_id + ' ' + req.params.stored);
    if(req.params.stored === 'false'){
        cloudinary.uploader.destroy(req.params.public_id, function(result){
            console.log(result);
            res.json(result);
        });
    }
    else{
        res.status(400).send(':(');
    }
});

router.post('/user/register/',function(req, res){
    console.log("POST register new user");
    var newUser = req.body;
    var account = {
        givenName: newUser.firstName,
        surname: newUser.lastName,
        email: newUser.email,
        password: newUser.password
    };
    appStormpath.createAccount(account, function(err, acc){
        if(err){
            console.log(err);
            res.status(err.status).send(err);
        }
        else{
            newUser.active = false;
            var user = new UserModel(newUser);
            user.save(function(err){
                if(!err){
                    acc.getCustomData(function(err, customData){
                        if(err) {
                            res.status(err.status).send(err);
                        }
                        else {
                            customData.id = user._id;
                            customData.save(function(err){
                                if(err) 
                                    res.status(err.status).send(err);
                                else 
                                    res.json(newUser);
                            });
                        }
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
    console.log("POST login: "+req.body);
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
    console.log("POST logout: "+req.body);
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

router.post('/cafe/', function(req, res){
    console.log("POST cafe " + req.body);
    var cafe = new CafeModel(req.body);
    cafe.save(function(err){
        if(!err){
            res.json(cafe);
        }
        else{
            res.status(err.status).send(err);
        }
    });
});

router.post('/photo/', function(req, res){
    console.log('POST photo '+ req.body);
    var photo = new FotoModel(req.body);
    photo.save(function(err){
        if(!err){
            res.json(photo);
        }
        else{
            res.status(err.status).send(err);
        }
    });
});

router.get('/cafe/', function(req, res){
    console.log('GET cafe ' + req.query);
    var arr = req.query.bbox.split(',').map(function(cur){
        return parseFloat(cur);
    });
    console.log(arr);
    CafeModel.find({
        'coordinates.latitude': {$gt: arr[0], $lt: arr[2]},
        'coordinates.longitude': {$gt: arr[1], $lt: arr[3]},
    },function(err, result){
        if(err)
            res.status(err.status).send(err);
        else{
            console.log(result);
            var obj = {
                "type": "FeatureCollection",
                "features": []
            }
            result.forEach(function(doc){
                //var photoes = FotoModel.find({});
                var newCafe = {
                    type: "Feature",
                    id: doc._id,
                    geometry: {
                        type: "Point",
                        coordinates: [doc.coordinates.latitude, doc.coordinates.longitude]
                    },
                    properties: {
                        cafe: doc,
                        fotos:[],
                        photoTag: '',
                        comments: [],
                        commentsTag:''
                    }
                };
                obj.features.push(newCafe);
            });
            console.log(obj.features);
            res.jsonp(obj);
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