/* api.js  公共类
    小程序的api接口集合 
 */
var KEY = require('key.js');
// var host_url = 'http://192.168.199.203:8000/huaxun_2/api/';
// var host_url = 'http://127.0.0.1:8000/huaxun_2/api/';
// var host_url = 'http://127.0.0.1:8000/huaxun/api/';
// var host_url = 'http://192.168.200.104:8000/huaxun/api/'; 

var host_url = 'https://xcx.308308.com/huaxun_2/api/';
var meet_url = 'https://xcx.308308.com/huaxun_2/meet/';

// var host_url = 'http://127.0.0.1:8000/huaxun_2/api/';
// var meet_url = 'http://127.0.0.1:8000/huaxun_2/meet/';

// var host_url = 'http://192.168.199.204:8000/huaxun_2/api/';
// var meet_url = 'http://192.168.199.204:8000/huaxun_2/meet/';


// var apiIsLogin = false //是否经登陆
// var apiPreList = [] //未登录前的请求队列 
// var apiFailList = [] //请求失败的队列
// var apiThread = false
var APP
var GlobalData 
var API_TIME = 5000               //检查进程时间间隔
var API_LOGIN_NONE = 0       //未登录
var API_LOGIN_ING = 1           //登陆中
var API_LOGIN_SUCCESS = 2   //已登录
var API_LIVE = 3                       //重连次数
function Request(options) {
    Init() //请求初始化
    InitRequest(options)
}

// 初始化
function Init(){
    APP = getApp()
    GlobalData = APP.globalData
    //初始化 全局变量
    if (GlobalData.apiIsLogin == undefined) {
        GlobalData.apiIsLogin = 0 //是否经登陆
        GlobalData.apiPreList = [] //未登录前的请求队列 
        GlobalData.apiFailList = [] //请求失败的队列
        GlobalData.apiThread = false

    }

    if (GlobalData.apiThread == false) {
        setInterval(
            function () {
                var opt = GlobalData.apiFailList.pop()
                // console.log(opt)
                if (opt != undefined) {
                    opt['live']--
                    _Request(opt)
                }
            }, API_TIME)
        GlobalData.apiThread = true
    }
}

function InitRequest(options){

    options['live'] = API_LIVE //请求重连生命周期
    if (GlobalData.apiIsLogin == API_LOGIN_NONE) {     //未登录
        GlobalData.apiPreList.push(options)
        _RequestLogin()
        GlobalData.apiIsLogin = API_LOGIN_ING
    }
    else if (GlobalData.apiIsLogin == API_LOGIN_ING) {  //登陆中
        GlobalData.apiPreList.push(options)
    }
    else {                                                                             //登陆成功
        _Request(options)
    }
}

function _RequestLogin() {
    wx.login({
        success: function (res) {
            var _session = wx.getStorageSync(KEY.SESSION)
            _Request({
                'live': API_LIVE,
                'url': meet_url + 'login/',
                'data': {
                    js_code: res.code,
                    meet_session: _session,
                },
                'success': function (res) {
                    var object = res.data
                    wx.setStorageSync(KEY.SESSION, res.data.dict_user.session)

                    GlobalData.apiIsLogin = API_LOGIN_SUCCESS //登陆成功
                    // 执行login == false时的请求
                    for (var i in GlobalData.apiPreList){
                        _Request(GlobalData.apiPreList[i])
                    }
                    GlobalData.apiPreList = []
                },
            })
        }
    });
}
    
// 普通登陆
function _Request(options){
    // console.log(options)

    var data = options.data
    if (data == undefined)
        data = {}
    //session 不存在，设置为false
    var _session = wx.getStorageSync(KEY.SESSION)
    if (!_session) //检查session,不存在，为false
        _session = "false"
    data['meet_session'] = _session  //每个请求都加session
    wx.request
        ({
            url: options.url,
            method: "GET",
            data: data,
            success: function (res) {
                if (options.success != undefined)
                    options.success(res)
            },
            fail: function (res) {
                if (options.fail != undefined)
                    options.fail(res)
                if (options['live'] > 0)
                    GlobalData.apiFailList.push(options) //将请求加入失败队列
            },
            complete: function (res) {
                if (options.complete != undefined)
                    options.complete(res)
            },
        })
}


// //下拉滚动查询
function RequestScroll(start = 0, range = 10) {
    // this.GP = _GP
    this.start = start //文章初始位置
    this.range = range //文章加载范围
    var that = this
    this.ReStart = function(){
        this.start = 0
    },
    this.Filter = function (url, data, hack) {
        if (data == undefined) data = {}  //如果数据为空，则创建对象
        data['start_index'] = this.start
        data['end_index'] = this.start + this.range
        var that = this
        _Request({
            'url': url,
            'data': data,
            'success': function (res) {
                // this.start = this.start + this.range //文章索引增加
                that._success() 
                if (res.data.article_list.length < that.range)
                    hack.success(res, false) //没有文章
                else
                    hack.success(res, true) //还有文章
            },
        })
    }
    this._success = function () {
        this.start = this.start + this.range //文章索引增加
    }
}





module.exports = {
    Request: Request,
    RequestScroll: RequestScroll,
    MEET_INDEX: meet_url + 'index/',
    MEET_AGENDA: meet_url + 'agenda/get_list/meet_id/',
    MEET_GUEST: meet_url + 'guest/get_list/meet_id/',
    MEET_NEWS: meet_url + 'news/get_list/meet_id/',
    MEET_SPOT: meet_url + 'spot/get_list/meet_id/',

    MEET_LOGIN: meet_url + 'login/',

    MEET_ARTICLE: meet_url + 'article/get/article_id/',


    MEET_SIGN_GET_INFO: meet_url + 'sign/get/attendee_info/',
    MEET_SIGN_SET_INFO: meet_url + 'sign/set/attendee_info/',
    MEET_SIGN_SET_LOGO: meet_url + 'sign/set/attendee_logo/',
    MEET_SIGN_GET_COST: meet_url + 'sign/get_list/cost/',
    MEET_SIGN_PAY_ORDER: meet_url + 'sign/pay/order/',
    MEET_SIGN_PAY_CHECK: meet_url + 'sign/pay/check/',
    MEET_SIGN_PAY_GET_INFO: meet_url + 'sign/pay/get/info/',
    
    // MEET_SIGN_APY_: meet_url + 'sign/pay/callback/',





    ARTICLE_INDEX: host_url + 'index/',

    ARTICLE_INDEX: host_url + 'article/index/',
    ARTICLE_INDEX: host_url + 'article/index/',

    // GetArticleSearch: host_url + 'api/',
    // 快讯
    ARTICLE_INDEX: host_url + 'article/index/',
    ARTICLE_GET_LIST_TAG: host_url + 'article/get_list/tag/',
    ARTICLE_GET_ID: host_url + 'article/get/id/',
    ARTICLE_GET_LIST_SEARCH: host_url + 'article/get_list/search/',
    ARTICLE_CHECK_SINGLE: host_url + 'article/check/single/',
    //活动
    ARTICLE_GET_LIST_MEET: host_url + 'article/get_list/meet/',

    // 供求
    MATCH_SET_ISSUE: host_url + 'match/set/issue/',
    MATCH_GET_LIST_TAG: host_url + 'match/get_list/tag/',
    MATCH_GET_LIST_SELF: host_url + 'match/get_list/self/',
    MATCH_DELETE_SELF: host_url + 'match/delete/self/',

    // 我 登陆
    MY_LOGIN: host_url + 'my/login/',
    MY_SET_WX: host_url + 'my/set/wx/',
    MY_SET_ROSTER: host_url + 'my/set/roster/',
    MY_GET_SELF: host_url + 'my/get/self/',

    // 支付
    PAY_GET_TAG: host_url + 'pay/get/tag/',
    PAY_CREATE_ORDER: host_url + 'pay/create/order/',
    PAY_CONFIRM_ORDER: host_url + 'pay/confirm/order/',
    PAY_GET_LIST_MEMBER: host_url + 'pay/get_list/member/',
    PAY_GET_LIST_DISCOUNT: host_url + 'pay/get_list/discount/',
    // PAY_CALLBACK_WX: host_url + 'pay/callback/wx/',

    // 花名册
    ROSTER_GET_TAG: host_url + 'roster/get_list/tag/',
    ROSTER_GET_ID: host_url + 'roster/get/id/',
    ROSTER_GET_LIST_SEARCH: host_url + 'roster/get_list/search/',
    ROSTER_GET_SELF: host_url + 'roster/get/self/',
    ROSTER_SET_SELF: host_url + 'roster/set/self/',
    
}
