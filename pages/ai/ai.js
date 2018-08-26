// pages/ai/ai.js
var GP
var upng = require('../../utils/upng-js/UPNG.js')

const canvasID = 'scannerCanvas'
var phone64 = ""
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPhone: true,
        phoneImage: "../../images/logo.jpg",
        tagName:"",
        score:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
    },
    onShow(){
        GP.setData({
            isPhone:true,
        })
    },

    toResualt(){
        //TODO 把base数据存在storage里
        wx.setStorageSync("ai", {
            phoneImage: GP.data.phoneImage,
            tagName: GP.data.tagName,
            score: GP.data.score,
        })
        wx.navigateTo({
            url: '/pages/resualt/resualt',
        })
    },


    // 1 拍照
    takePhoto() {
        const camera = wx.createCameraContext()
        camera.takePhoto({
            quality: 'high',
            success: (res) => {
               console.log(res)
                GP.setData({
                    phoneImage: res.tempImagePath,
                    isPhone: false,
                })
                GP.drawTarget(res.tempImagePath)
            }
        })
    },

    // 2 图片画图
    drawTarget(tempImagePath) {
        var canvas = wx.createCanvasContext(canvasID)
        // 1. 绘制图片至canvas
        canvas.drawImage(tempImagePath, 0, 0, 250, 300)
        // 绘制完成后执行回调，API 1.7.0
        canvas.draw(false, () => {
            GP.imageToBase64()
        })
    },

    // 3 开始base编码
    imageToBase64() {

        wx.showLoading({
            title: '识别中...',
        })
        wx.canvasGetImageData({
            canvasId: canvasID,
            x: 0,
            y: 0,
            width: 250,
            height: 300,
            success(res) {
                let platform = wx.getSystemInfoSync().platform
                if (platform == 'ios') {
                    // 兼容处理：ios获取的图片上下颠倒
                    res = that.reverseImgData(res)
                }
                let pngData = upng.encode([res.data.buffer], 250, 300)
                let base64 = wx.arrayBufferToBase64(pngData)
                phone64 = base64
                GP.easyDL()  //获取百度对比结果
            },
            fail(res) {
                console.log(res)
            }
        })
    },

    // 3.1 IOS 图片倒置
    reverseImgData(res) {
        var w = res.width
        var h = res.height
        let con = 0
        for (var i = 0; i < h / 2; i++) {
            for (var j = 0; j < w * 4; j++) {
                con = res.data[i * w * 4 + j]
                res.data[i * w * 4 + j] = res.data[(h - i - 1) * w * 4 + j]
                res.data[(h - i - 1) * w * 4 + j] = con
            }
        }
        return res
    },


    // 百度分析
    easyDL(){

        var access_token = "24.0b9c2684b508fce5e7094f5638632eb3.2592000.1537667288.282335-11721075"
        console.log("phone64:", phone64.length)
        wx.request({
            url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/classification/emoji?access_token=' + access_token,
            method:"POST",
            header: {
                'content-type': 'application/json'
            },
            data: {
                image: phone64,         
                top_num:5,
            },
            success: (res) => {
                console.log(res)
                var log_id = res.data.log_id
                var tag_name = res.data.results[0].name
                var score = res.data.results[0].score

                //图片记录上传后台
                GP.upload(log_id, tag_name, score)
                wx.hideLoading()

                // 设置分数
                GP.setData({
                    tagName : res.data.results[0].name,
                    score : res.data.results[0].score,
                })

                //跳转至结果
                GP.toResualt()

            },
            fail:(res)=>{
                console.log(res)
            },
        })
    },

    // 后台保存
    upload(log_id, tag_name, score){
        wx.request({
            url: 'https://ai.12xiong.top/lite/upload/image/',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                base64: phone64,                
                log_id:log_id, 
                tag_name:tag_name, 
                score:score
            },
            success: (res) => {
                console.log(res)
            }
        })
    },

    onShareAppMessage(){},

})

