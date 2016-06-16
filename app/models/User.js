/**
 *  用户模型
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // table 结构

const UserSchema = new Schema({
    username: {type: String, unique: true, index: true}, // 登录名
    nick: {type: String}, // 中文名
    password: {type: String}, // 密码
    email: {type: String, unique: true}, // 用户邮箱
    group_id: {type: Number, 'default': 5}, // 所属部门
    salt: {type: String}, // 加密字符
    create_at: {type: Date, 'default': Date.now}, //创建时间
    email_active: {type: Boolean, 'default': false}, //邮箱是否激活
    active: {type: Boolean, 'default': true} //账号是否正常
}, {collection: 'user'});

//////
//  验证属性
//////
UserSchema.path('username').validate(function(v) {
    console.log('username');
    return v.trim().length > 0;
}, '用户名不能为空');
UserSchema.path('email').validate(function(v) {
    console.log('email');
    return v.trim().length > 0;
}, '邮箱不能为空');
UserSchema.path('nick').validate(function(v) {
    console.log('nick');
    return v.trim().length > 0;
}, '昵称不能为空');

UserSchema.pre('save', function(next) {
    if(!this.isNew) return next();
    console.log(this);
});

UserSchema.statics = {
    load: (options, cb) => {
        options.select = options.select || 'username, email, nick';
        return this.findOne(options.criteria)
                    .select(options.select)
                    .exec(cb);
    }
};

mongoose.model('User', UserSchema);