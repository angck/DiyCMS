/**
 * 路由入口
 * @author wangzhixiang
 * @since 20160606
 */
module.exports = function(app) {
    require('./admin')(app);
    require('./api')(app);
    require('./frontend')(app);
};