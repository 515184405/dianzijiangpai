Page({
  data: {
    avatarUrl: '',
    fileUrl: '../image/bg.jpg',
    hidden : false,
    screenWidth:'',
    canvasHeight : '',
  },
  onLoad() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                hidden : true,
              })
              console.log(that.data.avatarUrl)
              that.drawCanvas();
              
            }
          })
        }
      }
    });

    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        that.setData({
          screenWidth: res.screenWidth,
        })
      }
    })
  },
  //绘制奖牌方法
  drawCanvas(){
    var that = this;
    const ctx = wx.createCanvasContext('share', that);
    //下载头像
    wx.downloadFile({
      url: that.data.avatarUrl,
      success: function (res) {
        //读取头像信息
        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (res) {
            //读取背景信息
            wx.getImageInfo({
              src: that.data.fileUrl,
              success: function (res2) {
                that.setData({
                  canvasHeight: that.data.screenWidth / res2.width * res2.height
                });
                // 画图开始
                ctx.drawImage(that.data.fileUrl, 0, 0, that.data.screenWidth, that.data.canvasHeight);
                // 绘制圆形头像
                var avatarurl_width = 200 * that.data.screenWidth / res2.width;    //绘制的头像宽度
                var avatarurl_heigth = 200 * that.data.screenWidth / res2.width;   //绘制的头像高度
                var avatarurl_x = that.data.screenWidth / 2 - avatarurl_width / 2;   //绘制的头像在画布上的位置
                var avatarurl_y = 455 / res2.height * that.data.canvasHeight ;   //绘制的头像在画布上的位置
                ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);

                ctx.clip();
                //绘制头像
                ctx.drawImage(res.path, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);

                //生成真实图片
                ctx.draw(true, function(){
                  wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: that.data.screenWidth,
                  height: that.data.canvasHeight,
                  destWidth: that.data.screenWidth * 2,
                  destHeight: that.data.canvasHeight * 2,
                  canvasId: 'share',
                  quality: 1,
                  success: function (res) {

                    let shareImg = res.tempFilePath;
                    that.setData({
                      shareImg: shareImg,
                      showModal: true,
                      showShareModal: false
                    })
                  },
                  fail: function (res) {
                  }
                })
                });

                

              }
            });
          }
        })
      }
    })
  },
  //生成图片
  createImage(){
    var that = this;
    wx.showToast({
      title: '正在保存...',
      icon: 'none'
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImg,
      success() {
        wx.showToast({
          title: '保存成功'
        })
      },
      fail() {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },
  bindGetUserInfo(e) {
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      hidden: true,
    })
    this.drawCanvas();
    console.log(this.data.avatarUrl)
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
  },
})