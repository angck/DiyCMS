'use strict';

/**
 * 获取一个随机字符
 * @param  {Number} len 随机字符长度
 * @return {String}     随机字符
 */

const md5      = require('md5');
const User     = DB.model('User');

function randomStr(len) {
    len = len || 32;
    var $char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $char.length;
    var pwd = '';

    for (var i = 0; i < len; i++) {
        pwd += $char.charAt(Math.floor(Math.random() * maxPos));
    }

    return pwd;
}

module.exports = {
    create: function(req, res, next) {
        let userDoc = new User();
        let salt = randomStr(4);
        userDoc.username = req.body.username;
        userDoc.email = req.body.email;
        userDoc.nick = req.body.nick;
        userDoc.salt = salt;
        userDoc.password = md5(md5(req.body.password) + salt);
        
        userDoc.save(function (err) {
            if (err) {
                console.log('err', err);
                return next(err);
            }
            res.send({
                success: true,
                msg: '恭喜您注册成功，请登录！（已发送激活邮件至您的邮箱，请从邮箱激活！）',
                data: []
            });
        });
    }
};