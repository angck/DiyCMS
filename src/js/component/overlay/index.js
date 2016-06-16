define('component/overlay/index', ['./overlay', './mask'], function(require, exports, module) {
    module.exports = {
        Overlay: require('./overlay'),
        Mask: require('./mask')
    }
})