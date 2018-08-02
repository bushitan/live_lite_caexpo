
module.exports = {
    Page: Page,
}
function Page( APP,GP) {
    this.onLoad = function (options){
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)
    }
}