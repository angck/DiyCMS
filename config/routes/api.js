/**
 * API接口管理
 * @author wangzhixiang
 * @since  20160606
 */
const User = require('../../app/controllers/user');

module.exports = function(app) {
    app.post('/user/create', User.create);
};