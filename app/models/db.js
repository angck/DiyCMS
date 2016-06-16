'use strict';
/**
 * 连接数据库
 */
require('dotenv').load();
var mongoose = require('mongoose');
var util = require('../../libs/util');

console.log('Running mongoose version is ', mongoose.version);

var db = exports.Db = mongoose.createConnection();

var options = {
    db: {native_parser: true},
    server: {
        pollSize: 5,
        auto_reconnect: true
    },
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
};

// 连接mongodb
function connect() {
    console.log('mongodb start connect at ' + util.format_date(new Date(), false));
    try {
        db.open(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, options);
    } catch(err) {
        console.log(err);
    }
}

// 监听mongodb异常后断开闲置连接
db.on('error', function(err) {
    console.log('mongodb error at ' + util.format_date(new Date(), false));
    mongoose.disconnect();
});

// 监听db disconnected 事件并重新连接
db.on('disconnected', function() {
    console.log('mongodb disconnected and start reconnect at ' + util.format_date(new Date(), false));
    connect();
});

db.once('open', function() {
    console.log('mongodb open at ' + util.format_date(new Date(), false));
});

db.on('connected', function () {
    console.log('MongoDB connected! at ' + util.format_date(new Date(), false));
});

connect();