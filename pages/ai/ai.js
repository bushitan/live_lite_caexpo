// pages/ai/ai.js
var GP
var upng = require('../../utils/upng-js/UPNG.js')
const canvasID = 'scannerCanvas'
const ctx = wx.createCanvasContext(canvasID)
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPhone:!false,
        phoneImage:"../../images/logo.jpg",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        GP._drawTarget()
        // GP.baseStart()
    },

    takePhoto() {
        // const ctx = wx.createCameraContext()
        // ctx.takePhoto({
        //     quality: 'high',
        //     success: (res) => {
        //         GP.setData({
        //             phoneImage: res.tempImagePath
        //         })
        //         GP.easyDL()
        //     }
        // })
        // GP.easyDL()
        // GP.upload(12321,"biaoqingbao",0.56,)


        //把图像数据获取
        GP.baseStart()
    },

    easyDL(){
        var access_token = "24.0b9c2684b508fce5e7094f5638632eb3.2592000.1537667288.282335-11721075"
        wx.request({
            url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/classification/emoji?access_token=' + access_token,
            method:"POST",
            header: {
                'content-type': 'application/json'
            },
            data:{
                image: imageBase64,
                top_num:5,
            },
            success: (res) => {
                console.log(res)
                var log_id = res.data.log_id
                var tag_name = res.data.results[0].name
                var score = res.data.results[0].score
                GP.upload(log_id, tag_name, score)

                // GP.setData({
                //     phoneImage: res.tempImagePath
                // })
                // GP.easyDL()
            }
        })
    },

    upload(log_id, tag_name, score){
        wx.request({
            url: 'http://ai.12xiong.top/lite/upload/image/',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                base64: imageBase64,
                log_id:log_id, 
                tag_name:tag_name, 
                score:score
            },
            success: (res) => {
                console.log(res)
            }
        })
    },


    // 开始base编码
    baseStart(){
        wx.canvasGetImageData({
            canvasId: canvasID,
            x: 0,
            y: 0,
            width: 250,
            height:300,
            success(res) {
                console.log(res)
                let pngData = upng.encode([res.data.buffer], 250,300)
                console.log(pngData)
                // let platform = wx.getSystemInfoSync().platform
                // if (platform == 'ios') {
                //     // 兼容处理：ios获取的图片上下颠倒
                //     res = that.reverseImgData(res)
                // }
                // resolve({
                //     buffer: res.data.buffer,
                //     width: res.width,
                //     height: res.height
                // })
            },
            fail(res) {
                console.log(res)
                // reject({
                //     code: 1,
                //     reason: '读取图片数据失败'
                // })
            }
        })
    },

    // 2 IOS 图片倒置
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

    //3 png转base64
    _toPNGBase64(buffer, width, height) {

        let pngData = upng.encode([buffer], width, height)
        resolve(wx.arrayBufferToBase64(pngData))
         
    },

    //4 画 图片
    _drawTarget() {

        // const canvasID = 'scannerCanvas'
        // const ctx = wx.createCanvasContext(canvasID)
        // wx.chooseImage({
        //     success: function (res) {
        //         ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
        //         ctx.draw()
        //     }
        // })


        ctx.drawImage(GP.data.phoneImage, 0, 0, 250, 300)
        ctx.draw()

        // this.finishDraw = false
        // var path = GP.data.
        // this.canvas.drawImage(, this.target.left, this.target.top, this.target.width, this.target.height)
        // this.canvas.draw(false, () => {
        //     that.finishDraw = true
        // })
    }
})
