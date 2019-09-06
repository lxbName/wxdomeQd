var appurl = "http://localhost:8081"
var appid = "dome网站链接地址"
var config = {
  appurl,
  appid,
  userUrl: `${appurl}/findAll`, //一定要使用tab键上面那个点,不要用英文单引号
  loginUrl: `${appurl}/login`, //登录接口
  userRegisterUrl: `${appurl}/userRegister`, //注册接口
  selectPhoneUrl: `${appurl}/selectPhone`  //查询当前手机号是否已经注册
};
module.exports = config //有了这句话，就代表着，这个页面的内容可以被外部进行引用