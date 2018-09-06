// pages/resualt/resualt.js
var GP
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phoneImage:"../../images/info_unselect.png", 
        tagName:"",   
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        var ai = wx.getStorageSync("ai")
        var tagName
        if (ai.tagName == "非菜") tagName = "这不是粉啊！"
        else if (ai.indexOf("面") != -1) tagName = "有面T_T，好难嗦！"
        else if (ai.indexOf("粉") != -1) tagName = ai.tagName + ",嗦粉好嗨森^_^！"
        else  tagName = "我也不懂这是啥！"




        var tagName = ai.tagName == "非菜" ? "这不是粉啊！" : ai.tagName
        GP.setData({
            phoneImage:ai.phoneImage,
            tagName: tagName,
            score: parseInt(ai.score*100),
        })
    },

    toAI(){
        wx.navigateBack({ })
    },
})