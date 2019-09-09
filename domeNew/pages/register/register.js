const userRegisterUrl = require('../../config.js').userRegisterUrl;    //注册接口
const selectPhoneUrl = require('../../config.js').selectPhoneUrl;  //查询手机号是否注册
const sendSmsUrl = require('../../config.js').sendSmsUrl;  //发送短信验证码接口
// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'获取验证码', //按钮文字
    currentTime:61, //倒计时
    disable:false, //按钮是否禁用
    phone:'',//获取到手机栏中的值
    VerificationCode:'',
    Code:'',  //验证码
    NewWxname:'', //姓名
    NewWxcount:'', //账号
    NewPassword:'', //密码
    NewChangesAgain:'',  //确认密码
    success:false,
    state:''
  },

  /**
   * 返回首页
   */
  return_home:function(e){
    wx.navigateTo({
      url: '../login/login',
    })
  },

  /**
   * 输入内容验证
   */
  handleInputPhone:function(e){
    this.setData({
      phone:e.detail.value
    })
  },

  handleVerificationCode:function(e){
    this.setData({
      Code:e.detail.value
    })
  },

  handleNewWxname:function(e){
    this.setData({
      NewWxname:e.detail.value
    })
  },

  handleNewWxcount:function(e){
    this.setData({
      NewWxcount:e.detail.value
    })
  },

  handleNewPassword:function(e){
    this.setData({
      NewPassword:e.detail.value
    })
  },

  handleNewChangeAgain:function(e){
    this.setData({
      NewChangesAgain:e.detail.value
    })
  },

  //获取手机验证码
  doGetCode: function(){
    var that = this;
    that.setData({
      disable:true,  //只要点击了按钮就让按钮禁用
      color:'#ccc',
    })

    var phone = that.data.phone;
    var currentTime = that.data.currentTime; //把手机号和倒计时的值变成js值
    var warn = null; //warn为当手机号为空格或者格式不正确时提示用户的文字，默认为空
    
    wx.request({
      url: selectPhoneUrl, //后端判断手机号是否已被注册，已被注册返回1，未被注册返回0
      data:{
        phone:that.data.phone
      },
      method: "GET",
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        that.setData({
          state:res.data.data
        })
        if(phone == ""){
          warn = "手机号码不能为空";
        } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
          warn = "手机号码格式不正确";
        } else if (res.data.data == 1){
          warn = "手机号码已被注册";
        } else {
          console.info("that.data==", that.data.phone);
          wx.request({
            url: sendSmsUrl, //填写发送验证码接口
            data:{
              phone:that.data.phone
            },
            method: "GET",
            header:{
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
              console.info(res.data);
              if (res.data == null){
                that.setData({
                  VerificationCode: res.data.verifyCode
                })
              }
              //当手机号正确的时候提示用户短信验证码已发送
              wx.showToast({
                title: '短信验证码已发送',
                inco:'none',
                duration:1000
              });

              //设置一分钟的倒计时
              var interval = setInterval(function(){
                currentTime--; //每执行一次让倒计时秒数减一
                that.setData({
                  text: currentTime + 's',//按钮文字变成倒计时对应秒数
                })

                //如果当秒数小于等于0时，停止计时器，且按钮文字变成重新发送，变成按钮可用状态
                if(currentTime <= 0){
                  clearInterval(interval)
                  this.setData({
                    text:'重新发送',
                    currentTime:61,
                    disable:false,
                    color:'#33FF99'
                  })
                }
              },100);
            }
          })
        };
        //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
        if(warn != null){
          wx.showModal({
            title: '提示',
            content: warn,
          })
          that.setData({
            disable:false,
            color:'#33FF99'
          })
          return;
        }
      }
    })
  },

  /**
   * 提交按钮
   */
  submit: function(e){
    var that = this
    if(this.data.phone == ''){
      wx.showToast({
        title: '请输入手机号码',
        icon:'none',
        duration:1000
      })
      return
    } else if(this.data.Code == ''){
      wx.showToast({
        title: '请输入验证码',
        icon:'none',
        duration:1000
      })
      return
    } else if (this.data.NewWxname == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (this.data.NewWxcount == '') {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (this.data.NewPassword == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (this.data.NewChangesAgain != this.data.NewPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 1000
      })
      return
    } else {
      var that = this
      var phone = that.data.phone;
      var data = {
        phone: phone,
        code: that.data.Code,
        wxname: that.data.NewWxname,
        wxcount: that.data.NewWxcount,
        password: that.data.NewPassword,
        passwordAgain: that.data.NewChangesAgain
      };
      wx.request({
        url: userRegisterUrl, //提交后台保存接口
        method: 'POST',
        data: JSON.stringify(data),
        header: {
          'content-type': 'application/json;charset=utf-8'
        },
        success: function(res){
          wx.showToast({
            title: '注册成功',
            inco:'loading',
            duration:1000
          })
          console.info(res)
          if(res.data.code != 200){
            wx.showToast({
              title: '注册失败',
              inco: 'none',
              duration: 1000
            })
          } else {
            that.setData({
              success: true
            })
          }
        },
        fail: function(res){
          wx.showToast({
            title: '注册失败',
            inco:'none',
            duration:1000
          })
        }
      })
    }
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