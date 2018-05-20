Page({
  data: {
    newsId: '',
    newsDetail: {},
    nodes: []
  },

  onLoad(option) {
    this.setData({
      newsId: option.id
    })
    this.getNewsDetail()
  },

  /* 
   * 该函数用于获取新闻详情
   */ 
  getNewsDetail(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.newsId
      },
      success: res => {
        let newsDetail = res.data.result
        console.log(newsDetail)
        newsDetail.date = newsDetail.date.slice(0, 19).replace('T', ' ')
        // 若新闻来源为空，则将其赋值为 火星情报局
        newsDetail.source = newsDetail.source ? newsDetail.source : '火星情报局'
        this.setData({
          newsDetail: newsDetail,
        })

        // 将新闻主题文本渲染为富文本
        let nodes = this.drawContent(newsDetail.content)
        this.setData({
          nodes: nodes
        })
      },

      fail: res => {
        wx.showToast({
        title: '获取新闻失败，下拉页面刷新试试',
        })
      },

      complete: () => {
        callback && callback()
      }
    })
  },

  /* 
   * 该函数用于渲染新闻富文本
   */
  drawContent(content) {
    let nodes = []
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === 'image') {
        nodes.push([{
          name: 'img', // name: 标签名，类型为String
          // attrs: 属性，类型为 Object
          attrs: { 
            class: 'article-img', // 若type类型是image，则将其类设为图像类
            src: content[i].src
          }
        }])
      }
      else {
        nodes.push([{
          name: content[i].type,
          attrs: {
            class: 'article-text' // 若type类型非image，则将其类设为文本类
          },
          // children: 子节点列表，类型为Array，结构与 nodes 一致
          children: [{
            type: 'text',
            text: content[i].text
          }]
        }
        ])
      }
    }
    return nodes;
  },

  onPullDownRefresh() {
    this.getNewsDetail(() => {
      wx.stopPullDownRefresh()
    })
  },
})