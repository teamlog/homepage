var express = require('express');
var session = require('express-session');
var favicon = require('express-favicon');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var ejs = require('ejs');
var router = express.Router();
var schema = mongoose.Schema;
var app = express();
var object = moment();

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(favicon(__dirname+'/public/favicon.png'));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/teamlog", function (err) {
    if(err){
        console.log('DB Error!');
        throw err
    }
    else {
        console.log('DB Connect Success')
    }
})

var VoteSchema = new schema({
    name : {
        type : String
    },
    team : {
        type : String
    }
})

var NewSchema = new schema({
    time : {
        type : String
    },
    name : {
        type : String
    },
    number : {
        type : String
    },
    contact : {
        type : String
    },
    gua : {
        type : String
    },
    part : {
        type : String
    },
    why : {
        type : String
    },
    self : {
        type : String
    },
    whyteamlog : {
        type : String
    }
})

var Vote = mongoose.model('vote', VoteSchema);
var New = mongoose.model('new', NewSchema);

app.listen(80, function (err) {
    if(err){
        console.log('Server Error!')
        throw err
    }
    else {
        console.log('Server Running At 80 Port!')
        var time = moment().format('YYYY년 MM월 DD일, h:mm:ss A');
        console.log(time)
    }
})

app.get('/', function (req, res) {
    res.redirect('/main')
})

app.get('/main', function (req, res) {
    req.session.destroy(function(){
        req.session;
    });
    fs.readFile('index.html', 'utf-8', function (err, data) {
        res.send(data)
    })
})

app.post('/main', function (req, res) {
    var success = '<script type="text/javascript">alert("투표가 접수되었습니다.");location.href="/main";</script>'
    var body = req.body;
    var vote = new Vote({
        name : body.name,
        team : body.team
    })
    vote.save(function (err) {
        if(err){
            console.log('/main Error!')
        }
        else {
            console.log(body.name+" Vote")
            res.send(success)
        }
    })
})

app.get('/newpeople', function (req, res) {
    fs.readFile('newpeople.html', 'utf-8', function (err, data) {
        res.send(data)
    })
})

app.post('/newpeople', function (req, res) {
    var error = '<script type="text/javascript">alert("이미 신청되었습니다. 재신청 문의 010-9186-0684");location.href="/main";</script>';
    var success = '<script type="text/javascript">alert("신청되었습니다. 면접일은 3월 16일 ~ 3월 17일 입니다.");location.href="/main";</script>'
    var body = req.body;
    var time = moment().format('YYYY년 MM월 DD일, h:mm:ss A');
    var user = new New({
        time : time,
        name : body.name,
        number : body.number,
        contact : body.contact,
        gua : body.gua,
        part : body.part,
        why : body.why,
        whyteamlog : body.whyteamlog,
        self : body.self
    });

    console.log(body)

    New.findOne({
        contact : body.contact
    }, function (err, result) {
        if(err){
            console.log('/newpeople Error!')
            throw err
        }
        else if(result){
            console.log(body.name+' 재신청')
            res.send(error)
        }
        else {
            user.save(function (err) {
                if(err){
                    console.log('user save Error!')
                    throw err
                }
                else {
                    console.log(body.name+' 신청')
                    res.send(success)
                }
            })
        }
    })
})

app.get('/people', function (req, res) {
    New.find({}, function (err, result) {
        if(err){
            console.log('/dataget Error!')
            throw err
        }
        else if(result){
            if(req.session.people == undefined){
                res.redirect('/peoplepassword')
            }
            else {
                console.log(result)
                fs.readFile('people.html', 'utf-8', function (err, data) {
                    res.send(ejs.render(data, {
                        data: result
                    }));
                })
            }
        }
    })
});

app.get('/peoplepassword', function (req, res) {
    req.session.destroy(function(){
        req.session;
    });
    fs.readFile('password.html', 'utf-8', function (err, data) {
        res.send(data)
    })
});

app.post('/peoplepassword', function (req, res) {
    var body = req.body;
    console.log(body.password);
    if(body.password == 'teamlogzzang2017'){
        req.session.people = 'asdf'
        console.log('Master Login')
        res.redirect('/people')
    }
    else {
        res.redirect('/peoplepassword');
    }
})

app.get('/vote', function (req, res) {
    Vote.find({}, function (err, result) {
        if(err){
            console.log('/vote Error!')
            throw err
        }
        else if(result){
            if(req.session.vote === undefined){
                res.redirect('/votepassword')
            }
            else {
                console.log(result)
                fs.readFile('vote.html', 'utf-8', function (err, data) {
                    res.send(ejs.render(data, {
                        data: result
                    }));
                })
            }
        }
    })
})

app.get('/votepassword', function (req, res) {
    req.session.destroy(function(){
        req.session;
    });
    fs.readFile('password.html', 'utf-8', function (err, data) {
        res.send(data);
    })
});

app.post('/votepassword', function (req, res) {
    var body = req.body;
    if(body.password === 'teamlogzzang2017'){
        req.session.vote = 'asdf'
        console.log('Master Login')
        res.redirect('/vote')
    }
    else {
        res.redirect('/votepassword');
    }
})

app.get('/applicant', function (req, res) {
    fs.readFile('applicant.html','utf-8', function (err, data) {
        res.send(data)
    })
})