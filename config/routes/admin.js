/**
 * 后端路由管理
 * @author wangzhixiang
 * @since 20160606
 */
module.exports = function(app) {
    app.get('/admin', function(req, res, next) {
        res.render('index', {title: '添加用户'});
    });

    app.get('/admin/login', function(req, res, next) {
        res.render('login', {title: '登录后台'});
    });
};