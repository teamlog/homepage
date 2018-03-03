'use strict';
//require modules
const koa = require('koa');
const Router = require('koa-router');
const http2 = require('http2');
const favicon = require('koa-favicon');
const render = require('./lib/render');
const fs = require('fs');
const serve = require('koa-static');
//create Object
const app = module.exports = new koa();
const router = module.exports = new Router();
const serverOption = {
    key : fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERT)
};
//config
//middleware
app.use(favicon(__dirname+'/public/favicon.ico'));
app.use(render);
app.use(serve(__dirname+'/public'));
//route
router.get('/',async (ctx,next)=>{
    await ctx.render('index.html');
    await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http2.createSecureServer(serverOption,app.callback());
server.listen(443);
