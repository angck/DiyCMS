'use strict';
/**
 * express middlewares
 */
require('dotenv').load();
const fs              = require('fs');
const path            = require('path');
const _               = require('lodash');
const express         = require('express');
const minify          = require('express-html-minify');
const favicon         = require('serve-favicon');
const flash           = require('express-flash');
const session         = require('express-session');
const compression     = require('compression');
const morgan          = require('morgan');
const cookieParser    = require('cookie-parser');
const cookieSession   = require('cookie-session');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const csrf            = require('csurf');
const multer          = require('multer');
const Routes          = require('./routes');
const Loader          = require('loader');
const passport        = require('passport');
const SessionStore    = require('session-mongoose')({session: session});
const DB              = require('../app/models/db').Db;
const models          = path.normalize(__dirname + '/../app/models');
const store           = new SessionStore({
                            connection : DB,
                            interval   : 1000 * 60 * 60 * 24,
                            ttl        : 3600
                        });

const app             = express();

const env             = process.env.NODE_ENV || 'development';  // test, development, production
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), {flags: 'a'});

global.DB     = DB;
global.Upload = multer({ dest: '../uploads/' });


fs.readdirSync(models)
    .filter(file => ~file.indexOf('.js') && !~file.indexOf('db'))
    .forEach(file => require(path.join(models, file)));

_.extend(app.locals, {
    name           : process.env.NAME,
    website_name   : process.env.WEBSITE_NAME, // 项目名称
    website_slogan : process.env.WEBSITE_SLOGAN,
    keywords       : process.env.KEYWORDS,
    description    : process.env.DESCRIPTION,
    resVersion     : process.env.RESVERSION,
    Loader         : Loader
});

app.use(compression({
    threshold: 512
}));

// 静态文件中间件
app.use(express.static(path.normalize(__dirname + '/../asset')));
app.use(favicon(path.normalize(__dirname + '/../favicon.ico')));

if(env === 'production') {
    app.use(morgan('combined', {stream: accessLogStream}));
} else {
    app.use(morgan('dev'));
}

// view engine setup
app.set('views', path.join(__dirname, '../app/views'));
app.set('view engine', 'html');
app.set('view cache', true);
app.engine('html', require('ejs-mate'));

app.use(minify);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(methodOverride(function(req) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(cookieParser('DiyCMS'));
app.use(cookieSession({ secret: 'DiyCMS' }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 2} // 过期时间2小时
}));

app.use(passport.initialize());
app.use(passport.session());

Routes(app);

app.use(flash());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: err.status,
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: err.status,
        message: err.message,
        error: {}
    });
});

if(env === 'production') {
    app.use(csrf());

    app.use(function(req, res, next) {
        res.locals.csrf_token = req.csrfToken();
        next();
    });
}


module.exports = app;