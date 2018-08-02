
var API = require('../../utils/api.js');
var APP = getApp()
var GP;
Page({
    data: {
        isLoading:true,
        tagList: ["1", "1", "1",],
        agendaSwiperList:[{},{},],
    },
    
    clickSwiper(e){
        return 
        var index = e.detail
        console.log(e.detail)

        API.Request({
            url: API.MEET_SIGN_PAY_CHECK,
            success: function (res) {
                console.log(res)
                if (res.data.is_pay == false)
                    wx.navigateTo({
                                url: '../pay/pay'
                    })
                else
                    wx.showModal({
                        title: '您已经报名成功',
                        content: '请到“我”完善参会信息',
                        confirmText: "完善信息",
                        success: function (res) {
                            if (res.confirm)
                                wx.navigateTo({
                                    url: '../my_info/my_info',
                                })
                        },
                    })
            }
        })


    },
    clickTab(e) {
        console.log(e.detail)
        var index = e.detail
        GP.setData({
            tagIndex: e.detail
        })
    },
    
    clickAgenda(e){
        return 
        var index = e.detail
        console.log(e.detail)
        var coverMatrix = GP.data.coverMatrix
        var tagIndex = GP.data.tagIndex
        var article_id = coverMatrix[tagIndex][index].article_id
        console.log(article_id)
        wx.navigateTo({
            url: '../article/article?article_id=' + article_id ,
        })
    },
    
    /**
     * index初始化
     * 加载默认的标签
     */
    onLoad: function (options) {

        GP = this
        GP.onInit()
    },

    /**
     * 选择新行业后返回，更新默认目录
     */
    onShow() {

        if (APP.globalData.isLogin == true) {  //已经登录

        }
    },

    //必须要登陆以后发起的请求，在这里完成
    onInit: function (options) {

        wx.showLoading({
            title: '加载中',
        })
        API.Request({
            'url': API.MEET_AGENDA,
            'data': { "meet_id": 1 },
            'success': function (res) {
                GP.setData({
                    tagIndex: 0,
                    tagList: res.data.tag_list,
                    coverMatrix: res.data.cover_matrix,
                })
            },
        })
        API.Request({
            'url': API.MEET_INDEX,
            'success': function (res) {
                // APP.globalData.agendaSwiperList = res.data.agenda_swiper_list
                // APP.globalData.newsSwiperList = res.data.news_swiper_list
                APP.globalData.currenMeet = res.data.current_meet
                GP.setData({
                    agendaSwiperList: res.data.agenda_swiper_list,
                    // newsSwiperList: res.data.news_swiper_list,
                    currenMeet: res.data.current_meet,

                    isLoading:false, 
                })
                wx.hideLoading()
            },
        })
    },

    onShareAppMessage: function () {
        return APP.share
    },

})
