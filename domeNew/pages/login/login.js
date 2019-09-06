const loginUrl = require('../../config.js').loginUrl //引用config文件中的loginUrl
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  //获取输入账号
  phoneInput: function(e){
    this.setData({
      phone:e.detail.value
    })
  },

  //获取输入密码
  passwordInput: function(e){
    this.setData({
      password:e.detail.value
    })
  },

  //登录
  login: function(){
    if(this.data.phone.length == 0 || this.data.password.length == 0){
      wx.showToast({
        title: `用户名或密码不能为空`,
        icon: 'none',
        duration: 1000
      })
    } else {
      //this.goIndex(); //调用新页面跳转方法
      //查询用户信息
      wx.request({
        url: loginUrl,
        data:{
          wxcount: this.data.phone,
          password: this.data.password
        },
          method:'GET',
          header:{
            'content-type': 'application/json' //默认值
          },
          success:function(res){
            if (res.data.msg == "success"){
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1000,
                success: function () {
                  wx.navigateTo({  //跳转新页面
                    url: '../wxml/index',
                  })
                }
              })
            } else {
              wx.showToast({
                title: '登录失败',
                icon: 'warn',
                duration: 1000,
              })
              console.log("登录失败-fail==", res);
            }
          },
          fail:function(res){
            wx.showToast({
              title: '调用接口失败',
              icon: 'warn',
              duration: 1000,
            })
            console.log("fail==", res);
          }
      })
    }
  },

  //新页面跳转方法
  goIndex: function(){
    wx.redirectTo({
      url: '../wxml/index'
    })
  },

  //注册跳转页面
  registerBtn:function(){
    wx.showToast({
      title: '进入注册页面',
      icon:'none',
      duration:100,
      success:function(){
        wx.navigateTo({
          url: '../register/register',
        })
      },
      fail:function(){
        console.info("进入注册页面失败---");
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})