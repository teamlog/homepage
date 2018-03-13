'use strict';
//require modules
const koa = require('koa');
const Router = require('koa-router');
const https = require('https');
const logger = require('koa-logger');
const favicon = require('koa-favicon');
const render = require('./lib/render');
const fs = require('fs');
const serve = require('koa-static');
const db = require('mongoose');
const moment = require('moment');
const kbody = require('koa-body');
//create Object
const app = module.exports = new koa();
const router = module.exports = new Router();
const Schema = db.Schema;
//config
const People = new Schema({
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
});
const people = db.model('people',People);
const serverOption = {
    key : fs.readFileSync('./key.pem'),
    cert : fs.readFileSync('./cert.pem')
//     key : fs.readFileSync('/letsencrypt/live/privkey.pem'),
//     cert: fs.readFileSync('/letsencrypt/live/fullchain.pem')
};
db.Promise = global.Promise;
db.connect("mongodb://localhost:27017/new")
    .then(()=>{
        console.log('connect');
    })
    .catch(err=>{
        console.error(err);
    });
//middleware
app.use(kbody());
app.use(favicon(__dirname+'/public/favicon.ico'));
app.use(render);
app.use(serve(__dirname+'/public'));
//route
router.get('/',async (ctx,next)=>{
    await ctx.render('index.html');
    await next();
})
    .get('/newpeople',async (ctx,next)=>{
        await ctx.render('newpeople.html');
        await next();
})
    .post('/newpeople',async (ctx,next)=>{
        const error = '<html><body><meta charset="UTF-8"><body><script type="text/javascript">alert("이미 신청되었습니다. 재신청 문의 010-2629-2060");location.href="/";</script></body></html>';
        const success = '<html><body><meta charset="UTF-8"><script type="text/javascript">alert("신청되었습니다. 시연회는 22-23일 입니다.");location.href="/";</script></body></html>';
        const body = ctx.request.body;
        const time = moment().format('YYYY년 MM월 DD일, h:mm:ss A');
        const user = new people({
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
        let result;
        console.log(body);
        people.findOne({contact : body.contact})
            .then(result => {
            if(result){
                console.log(body.name+' 재신청');
            }
            else {
                user.save()
                    .then(()=>{
                        console.log(body.name+' 신청');
                    })
                    .catch((err)=>{
                        console.error('user saved err');
                        throw err;
                    });
            }
        });
        console.log(a);
        if(a) ctx.res.end(error);
        else ctx.res.end(success);
        await next();
    });

app.use(router.routes());
app.use(router.allowedMethods());

const server = https.createServer(serverOption,app.callback());
server.listen(3000);
