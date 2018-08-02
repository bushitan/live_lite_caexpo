// components/xx_cover_news/xx_cover_news.js
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        list: {
            type: Array,
            value: [],
            observer: '_change',
            /** 数据结构
             list[0] = {
                    "cover_url":'',
                    "article_id":'',
                }
            */
        },
        width: {
            type: String,
            value: "750rpx",
        },
        height: {
            type: String,
            value: "423rpx",
        }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 改变
    _change(newVal, oldVal) {
        console.log(newVal, oldVal )
        console.log(this.data.list)
    },

    /**
     * return: 点击列表的index
     */
    click(e) {
        this.triggerEvent('click', e.currentTarget.dataset.index);
    },
  }
})
