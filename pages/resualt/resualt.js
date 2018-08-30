// pages/resualt/resualt.js
var GP
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phoneImage:"../../images/logo.jpg", 
        tagName:"螺蛳粉",   
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        var ai = wx.getStorageSync("ai")
        var tagName = ai.tagName == "非菜" ? "这不是菜！" : ai.tagName
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