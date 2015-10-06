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
    var im = cloudinary.url(photoes[i].link, {});
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
                '<button class = "btn btn-success btn-balloon" type="button" onclick = "route(\''+doc._id+'\'")">Route</button>'+
                '<button class = "btn btn-info btn-balloon" type="button" onclick = "openCafePage(\''+ doc._id +'\')" id = "' + doc._id + '">Cafe page</button>'+
            '</div>'+
        '</div>'+
    '</div>';
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
                '<div class="balloon-rating" style="background-color:'+ getRankingColor(rank, 'page')+';">'+
                    rank+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    return s;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getRankingColor(rank, type){
    var H = 0, S = 0, V = 0.5;;
    if(type === 'page'){
        if(rank >= 0){
            S = 1;
            V = 0.7;
            H = parseInt(120 * (rank/10.0), 10);
        }
    }
    else if (type === 'comment'){
        S = 0.2;
        V = 1.0;
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
    res.json({tag: s});
});

router.delete('/image/:public_id/:stored/', function(req, res){
    console.log("DELETE " + req.params.public_id + ' ' + req.params.stored);
    if(req.params.stored === 'false'){
        cloudinary.uploader.destroy(req.params.public_id, function(result){
            res.json(result);
        });
    }
    else
        res.status(400).send(':(');
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
    var c_arr = [appStormpath,0,-2,-1];
    var f_arr = [3, 4, 5, 4];
    var s_arr = [account, null, null, null];
    var asc_arr = [null, {t:0 , v: 'default', fun: function(){ newUser.active = false; return new UserModel(newUser); } }, null, { t: -1, s: -2, fun: function(a,c){ a['id'] = c['_id'];} }];
    syncDBselect(c_arr,f_arr,s_arr,asc_arr, function(res_arr){
        newUser._id = res_arr[1]._id
        res.json(newUser);
    }, function(err){ 
        res.send(err);
    });
});

router.post('/user/login/', function(req, res){
    console.log("POST login: "+req.body);
    var c_arr = [appStormpath, -1, -1, UserModel, -1];
    var f_arr = [6,7,5,1,4];
    var s_arr = [req.body, null, null, {}, null];
    var asc_arr = [null, null, null, function(a,b){ a['_id'] = b[2].id; }, {t:-1, s:0, fun: function(a){ a['lastLogin'] = Date.now(); a['active'] = true;}}];
    syncDBselect(c_arr, f_arr, s_arr, asc_arr, function(res_arr){
        res.json(res_arr[4]);
    }, function(err){
        res.send(err);
    });
});

router.post('/user/logout/', function (req, res){
    console.log("POST logout: "+req.body);
    console.log(req.body.email);
    var c_arr = [UserModel, -1];
    var f_arr = [1, 4];
    var s_arr = [{email : req.body.email}, null];
    var asc_arr = [null, {t:-1, s:0, fun: function(a){ a['active'] = false;}}];
    syncDBselect(c_arr,f_arr,s_arr,asc_arr,function(res_arr){
        res.json({});
    }, function(err){
        res.send(err);
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
    console.log('GET cafe' + req.query.bbox + req.query.z + req.query.subscribed + req.query.id);
    var arr = req.query.bbox.split(',').map(function(cur){
        return parseFloat(cur);
    });
    var c_arr = [], f_arr = [], s_arr = [], asc_arr = [];
        if(req.query.subscribed == 'true'){
            c_arr.push(FavoritesModel, CafeModel);
            f_arr.push(2, 2);
            s_arr.push({userID: req.query.id}, { 'coordinates.latitude':{$gt:arr[0], $lt:arr[2]} , 'coordinates.longitude': {$gt: arr[1], $lt: arr[3]} });
            asc_arr.push(null, function(a,b){ 
                var x = []; 
                for(var i = 0; i < b[0].length; i++){
                    x.push(b[0][i].cafeID);  
                }
                a['_id'] = { $in: x};
            });
        }
        else{
            c_arr.push(CafeModel);
            f_arr.push(2);
            s_arr.push({'coordinates.latitude':{$gt:arr[0], $lt:arr[2]} , 'coordinates.longitude': {$gt: arr[1], $lt: arr[3]} });
            asc_arr.push(null);
        }
        syncDBselect(c_arr, f_arr, s_arr, asc_arr, function(res_arr){
            var obj = {
                "type": "FeatureCollection",
                "features": []
            };
            var c1_arr = [];
            var f1_arr = [];
            var s1_arr = [];
            var asc1_arr = [];
            for (var i=0; i<res_arr[res_arr.length-1].length;i++){
                var s = res_arr[res_arr.length-1][i];
                c1_arr.push(FotoModel, MarksModel);
                f1_arr.push(2,2);
                s1_arr.push({cafeID: s._id},{cafeID: s._id});
                if(i>0){
                    asc1_arr.push({t: -1, s: -2, fun: function(a,b){
                        var ar = [];
                        b.forEach(function(cur){
                            ar.push(cloudinary.url(cur.link, {crop: 'fit', width:150, height:100}));
                        });
                        var mark = 0.0;
                        for(var i =0; i < a.length; i++){
                            mark += a[i].mark;
                        }
                        mark /= a.length;
                        obj.features.push({
                            type: "Feature",
                            id: s._id,
                            geometry: {
                                type: "Point",
                                coordinates: [s.coordinates.latitude, s.coordinates.longitude]
                            },
                            properties: {
                                cafe: s,
                                comments: [],
                                photoes: ar,
                                commentsTag:'',
                                balloonContentBody: setBalloonContentBody(s, b),
                                balloonContentHeader: setBalloonContentHeader(s, Math.round((mark)*10)/10.0)
                            }
                        });
                    }}, null);
                }
                else{
                    asc1_arr.push(null,null);
                }
            }
            syncDBselect(c1_arr, f1_arr, s1_arr, asc1_arr, function(res_arr1){
                if((res_arr.length==1 && res_arr[0].length>0)||(res_arr.length==2 && res_arr[1].length>0)){
                    var s;
                    if(res_arr.length % 2 ==0)
                        s = res_arr[1][res_arr[1].length-1];
                    else
                        s = res_arr[0][res_arr[0].length-1];
                    var ar = [];
                    res_arr1[res_arr1.length-2].forEach(function(cur){
                        ar.push(cloudinary.url(cur.link, {crop: 'fit', width:150, height:100}));
                    });
                    var mark = 0.0;
                    for(var i =0; i < res_arr1[res_arr1.length-1].length; i++){
                        mark += res_arr1[res_arr1.length-1][i].mark;
                    }
                    mark /= res_arr1[res_arr1.length-1].length;
                    obj.features.push({
                        type: "Feature",
                        id: s._id,
                        geometry: {
                            type: "Point",
                            coordinates: [s.coordinates.latitude, s.coordinates.longitude]
                        },
                        properties: {
                            cafe: s,
                            comments: [],
                            photoes: ar,
                            commentsTag:'',
                            balloonContentBody: setBalloonContentBody(s, res_arr1[res_arr1.length-2]),
                            balloonContentHeader: setBalloonContentHeader(s, Math.round((mark)*10)/10.0)
                        }
                    });
                }
                res.jsonp(obj);
            }, function(err){
                res.send(err);
            });
        }, function(err){
            res.send(err);
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
                                            mark: result_mark,
                                            color: getRankingColor(result_mark.mark, 'comment')
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

router.post('/cafe/:cafe_id/mark/:category/', function(req, res){
    console.log('POST mark' + req.params.category + ' ' + req.params.cafe_id + ' ' + req.body);
    RankingModel.findOne({category: req.params.category}, function(err, result_category){
        if(err)
            res.status(err.status).send(err);
        else {
            var nm = {
                userID: req.body.userID,
                cafeID: req.params.cafe_id,
                mark: parseInt(req.body.mark),
                category: result_category._id
            };
            var newMark = new MarksModel(nm);
            newMark.save(function(err){
                if(err)
                    res.status(err.status).send(err);
                else
                    res.json(newMark);
            });
        }
    });
});

router.get('/:user_id/cafe/:cafe_id/', function (req, res){
    console.log('GET cafe ' + req.params.cafe_id);
    var c_arr = [CafeModel, FavoritesModel, RankingModel, MarksModel, MarksModel];
    var f_arr = [1,1,1,1,2];
    var s_arr = [{_id: req.params.cafe_id},
    {userID: req.params.user_id , cafeID: req.params.cafe_id},
    {category : 'overall'},
    {userID: req.params.user_id , cafeID: req.params.cafe_id},
    {cafeID: req.params.cafe_id}];
    asc_arr = [null,null,null,function(a,b){a['category']=b[2]._id;}, function(a,b){a['category']=b[2]._id;}];
    syncDBselect(c_arr,f_arr,s_arr,asc_arr,function(res_arr){
        var r;
        if(res_arr[4]){
            r = 0;
            for(var i = 0; i < res_arr[4].length; i++){
                r+=res_arr[4][i].mark;
            }
            r/=res_arr[4].length;
            r = Math.round(r*10)/10.0;
        }
        r = (r) ? r : -1;
        var mark = (res_arr[3]) ? res_arr[3].mark : -1;
        var newObj = {
            cafe: res_arr[0],
            rating: { value: r, color: getRankingColor(r, 'page') },
            yourRating: { value: mark, color: getRankingColor(mark , 'page') },
            subscribed: !!res_arr[1]
        };
        res.json(newObj);
    },function(err){res.send(err);});
});

router.post('/:user_id/cafe/:cafe_id/subscribe/', function(req, res){
    console.log('POST subscribe ' + req.params.user_id + ' '+ req.params.cafe_id);
    var like = new FavoritesModel({
        userID:  req.params.user_id,
        cafeID: req.params.cafe_id
    });
    like.save(function(err){
        if(err)
            res.status(err.status).send(err);
        else
            res.json(like);
    });
});

router.delete('/:user_id/cafe/:cafe_id/subscribe/', function(req, res){
    console.log('DELETE subscribe ' + req.params.user_id + ' '+ req.params.cafe_id);
    FavoritesModel.remove({userID:req.params.user_id, cafeID: req.params.cafe_id}, function(err){
        if(err)
            res.status(err.status).send(err);
        else
            res.json({text: 'ok'});
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

function syncDBselect (coll_arr, func_arr, select_arr, addSelCallback_arr, callback, ifError){
    var result_arr = new Array(coll_arr.length);
    var f = coll_arr.reduceRight(function(prev, cur, ind, arr){
        return (function (i) {
            return function(err, result){
                if (err){
                    ifError(err);
                }
                else{
                    if(i-1>=0)
                    result_arr[i-1] = result;
                    
                    if(typeof addSelCallback_arr[i] == 'function'){
                        addSelCallback_arr[i](select_arr[i], result_arr);
                    }
                    else if(addSelCallback_arr[i] && typeof addSelCallback_arr[i] == 'object'){
                        if(!result_arr[i+addSelCallback_arr[i].t])
                            result_arr[i+addSelCallback_arr[i].t] = addSelCallback_arr[i].fun(addSelCallback_arr[i].v);
                        else
                            addSelCallback_arr[i].fun(result_arr[i+addSelCallback_arr[i].t], result_arr[i+addSelCallback_arr[i].s]);
                    }
                    if(!select_arr[i] && typeof coll_arr[i] == 'object'){
                        if(func_arr[i]==4){
                            cur.save(prev);
                        }
                        else if(func_arr[i]==5){
                            cur.getCustomData(prev);
                        }
                    }
                    else if(!select_arr[i] && typeof coll_arr[i] != 'object'){
                        if(func_arr[i]==4){
                            result_arr[i+cur].save(prev);
                        }
                        else if(func_arr[i]==5){
                            result_arr[i+cur].getCustomData(prev);
                        }
                        else if(func_arr[i]==7){
                            result_arr[i+cur].getAccount(prev);
                        }
                    }
                    else {
                        if(func_arr[i]==1){
                            cur.findOne(select_arr[i], prev);
                        }
                        else if(func_arr[i]==2){
                            cur.find(select_arr[i],prev);
                        }
                        else if(func_arr[i]==3){
                            cur.createAccount(select_arr[i],prev);
                        }
                        else if(func_arr[i]==6){
                            cur.authenticateAccount(select_arr[i],prev);
                        }
                    }
                }
            };
        })(ind);
    },function(err,result){
        if(err)
            ifError(err);
        else{
            result_arr[coll_arr.length-1]=result;
            callback(result_arr);
        }
            
    });

    f();
}
