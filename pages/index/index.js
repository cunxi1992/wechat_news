const typeMap = {
  gn: "国内",
  gj: "国际",
  cj: "财经",
  yl: "娱乐",
  js: "军事",
  ty: "体育",
  other: "其他"
}

Page({
  data: {
    type: "gn",
    typeMap,
    newsType: ["gn", "gj", "cj", "yl", "js", "ty", "other"],
    /* 用于展示的新闻列表，点击某个类型后将获取到的新闻列表添加到这个数组中，然后展示 */
    newsList: [],
  },
  onLoad(){
    this.getNews()
  },

  /* 
   * 函数getNews()用于获取新闻列表，
   * 并将获取到的新闻列表添加到要展示的新闻列表中 
   */
  getNews(callback) {
    wx.showLoading({
      title: '正在获取最新的新闻...'
    })

    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.type
      },
      success: res => {
        const result = res.data.result
        const newsRes = result.map(item => ({
          id: item.id,
          title: item.title,
          date: item.date.slice(0, 19).replace('T',' '),
          source: item.source ? item.source : '火星情报局',
          firstImage: item.firstImage
        }))
        
        this.setData({
          /* 将当前类型的新闻列表赋值给展示新闻列表的数组 */
          newsList: newsRes
        })
      },
      complete: () => {
        wx.hideLoading();
        callback && callback();
      },
      fail: res => {
        wx.showToast({
          title: '获取新闻失败，下拉页面刷新试试',
        })
      }
    })
  },

  /* 选择新闻类型标题，触发事件
   * 主要作用是，将选择的类型标题样式进行更改
   */
  chooseType(e) {
    /* 获取点击事件 data- 中的值  */
    const { categories } = e.currentTarget.dataset
    /* 重置type的值，以便让选择的类型标题更改样式 */
    this.setData({
      type: categories,
      /* 点击其他类型，需要将原有的展示新闻数组清空，然后才能得到该类型的新闻列表 */
      newsList: []
    })
    this.getNews()
  },

  /*
   * 函数newsDetail()用于进入新闻详情页
   */
  newsDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id
    })
  },

  onPullDownRefresh() {
    this.getNews(() => {
      wx.stopPullDownRefresh()
    })
  },
})
