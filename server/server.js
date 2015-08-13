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

function setBalloonContentBody(doc, photoes){
    var i = parseInt(Math.random()*photoes.length);
    console.log(i);
    console.log(photoes[i].link);
    var im = cloudinary.url(photoes[i].link, {});
    console.log(im);
    var s = '<div class = "container-fluid">'+
        '<div class = "row">'+
            '<div class = "col-xs-12 col-sm-4 balloon-photo">'+
                ((photoes.length)?'<img class="img-responsive img-rounded" src = "'+ im +'"/>' : 'No photo') + 
            '</div>'+
            '<div class = "col-xs-12 col-sm-8 balloon-description">'+
                doc.description+
            '</div>'+
        '</div>'+
        '<div class = "row">'+
            '<div class = "col-xs-12 col-sm-4">'+
            '</div>'+
            '<div class = "col-xs-12 col-sm-8">'+
                '<button class = "btn btn-success" type="button" onclick = "route(\''+doc._id+'\'")">Route</button>'+
                '<button class = "btn btn-info" type="button" onclick = "openCafePage(\''+ doc._id +'\')" id = "' + doc._id + '">Cafe page</button>'+
            '</div>'+
        '</div>'+
    '</div>';
    console.log(s);
    return s;
}

function setBalloonContentHeader(doc, rank){
    var s = '<div class = "container-fluid balloon-header-container">'+
        '<div class = "row">'+
            '<div class="col-xs-9 col-sm-9 col-md-10 balloon-header">'+
                '<strong>'+doc.name+'</strong>'+
                '<hr>'+
            '</div>'+
            '<div class="col-xs-3 col-sm-3 col-md-2">'+
                '<div class="balloon-rating" style="background-color:'+ getRankingColor(rank)+';">'+
                    rank+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    console.log(s);
    return s;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getRankingColor(rank){
    var H = 0, S = 0, V = 0.5;
    if(rank >= 0){
        S = 1;
        V = 0.7;
        H = parseInt(120 * (rank/10.0), 10);
    }
    var C = V*S;
    var X = C * ( 1 - Math.abs((H/60)%2 - 1));
    var m = V - C;
    var R,G,B;
    if(H < 60){
        R = parseInt((m + C)*255);
        G = parseInt((m + X)*255);
        B = parseInt((m + 0)*255);
    }
    else {
        R = parseInt((m + X)*255);
        G = parseInt((m + C)*255);
        B = parseInt((m + 0)*255);
    }
    return "#" + componentToHex(R) + componentToHex(G) + componentToHex(B);

}


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
    var arr = req.query.bbox.split(',').map(function(cur){
        return parseFloat(cur);
    });
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
            };
            var f = result.reduceRight(function(prev, cur, ind, arr){
                //var photoes = FotoModel.find({});
                return function (){
                    FotoModel.find({cafeID: cur._id},function(err, result){
                        if(err)
                            res.status(err.status).send(err);
                        else{
                            var ar = [];
                            result.forEach(function(cur){
                                ar.push(cloudinary.url(cur.link, {crop: 'fit', width:150, height:100}));
                            });
                            var newCafe = {
                                type: "Feature",
                                id: cur._id,
                                geometry: {
                                    type: "Point",
                                    coordinates: [cur.coordinates.latitude, cur.coordinates.longitude]
                                },
                                properties: {
                                    cafe: cur,
                                    comments: [],
                                    photoes: ar,
                                    commentsTag:'',
                                    //clusterCaption: cur.name,
                                    balloonContentBody: setBalloonContentBody(cur, result),
                                    balloonContentHeader: setBalloonContentHeader(cur, Math.round((Math.random()*10)*10)/10.0)
                                }
                            };
                            obj.features.push(newCafe);
                            prev();
                        }
                    });
                };
            }, function(){
                res.jsonp(obj);
            });
            f();
        }
    });
});

router.get('/cafe/:cafe_id/photo/', function(req, res){
    console.log('GET photoes'+ req.params.cafe_id);
    FotoModel.find({cafeID: req.params.cafe_id},function(err, result_photoes){
        if (err)
            res.status(err.status).send(err);
        else {
            var arr = result_photoes.map(function(cur){
                return {
                    _id: cur._id,
                    title: cur.title,
                    description: cur.description,
                    publishedBy: cur.publishedBy,
                    published: cur.published,
                    url: cloudinary.url(cur.link, {
                        crop: 'fill',
                        width: 480,
                        height: 360
                    })
                };
            });
            res.json(arr);   
        }
    });
});

router.get('/cafe/:cafe_id/comment/', function (req, res){
    console.log('GET comments' + req.params.cafe_id);
    CafeCommentModel.find({cafeID: req.params.cafe_id}, function(err, result_comments){
        if(err)
            res.status(err.status).send(err);
        else {
            var ar = [];
            var f = result_comments.reduceRight(function(prev, cur, ind, arr){
                return function (){
                    UserModel.findOne({_id: cur.userID},function(err, result_user){
                        if(err)
                            res.status(err.status).send(err);
                        else {
                            RankingModel.findOne({category : 'overall'}, function(err, result_category){
                                if(err)
                                    res.status(err.status).send(err);
                                else {
                                    MarksModel.findOne({userID: cur.userID, cafeID: req.params.cafe_id, category: result_category._id}, function(err, result_mark){
                                        var newObj = {
                                            comment: cur,
                                            user: result_user,
                                            mark: result_mark
                                        };
                                        ar.push(newObj);
                                        prev();
                                    });
                                }
                            });
                        }
                    });    
                };
                
            }, function(){
                console.log(ar);
                res.json(ar);
            });
            f();
        }
    });
});

router.post('/cafe/:cafe_id/comment/', function (req, res){
    console.log('POST comment ' + req.body);
    var newObj = new CafeCommentModel(req.body);
    newObj.save(function(err){
        if(err)
            res.status(err.status).send(err);
        else {
            res.json(newObj);
        }
    });
});

router.get('/:user_id/cafe/:cafe_id/', function (req, res){
    console.log('GET cafe ' + req.params.cafe_id);
    CafeModel.findOne({_id: req.params.cafe_id}, function(err, result_cafe){
        if (err)
            res.status(err.status).send(err);
        else {
            FavoritesModel.findOne({userID: req.params.user_id , cafeID: req.params.cafe_id}, function(err, result_favor){
                if(err)
                    res.status(err.status).send(err);
                else {
                    RankingModel.findOne({category : 'overall'}, function(err, result_category){
                        if(err)
                            res.status(err.status).send(err);
                        else {
                            MarksModel.findOne({userID: req.params.user_id, cafeID: req.params.cafe_id, category: result_category._id}, function(err, result_mark){
                                if(err)
                                    res.status(err.status).send(err);
                                else {
                                    MarksModel.find({cafeID: req.params.cafe_id, category: result_category._id}, function(err, result_marks){
                                        if(err)
                                            res.status(err.status).send(err);
                                        else {
                                            var r;
                                            if(result_marks){
                                                r = 0;
                                                for(var i = 0; i < result_marks.length; i++){
                                                    r+=result_marks[i].mark;
                                                }
                                                r/=result_marks.length;
                                                r = Math.round(r*10)/10.0;
                                            }
                                            r = (r) ? r : -1;
                                            var mark = (result_mark) ? result_mark.mark : -1;
                                            var newObj = {
                                                cafe: result_cafe,
                                                rating: { value: r, color: getRankingColor(r) },
                                                yourRating: { value: mark, color: getRankingColor(mark) },
                                                subscribed: !!result_favor,
                                            };
                                            res.json(newObj);
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