//加载express 作用：连接路由 编写接口
var express = require("express");
//解析路径
var path = require("path");
//调用express方法
var app = express();
//链接数据库
// var db = require("./modul/db");
//执行接口文件
var index =require("./index");
//后期保存信息
// var session = require("express-session");
//路由  接口的跳转
// var router = require("express-router");
//处理post请求
var bodyparser = require("body-parser");
var cookie = require("cookie-parser");

var flash = require("connect-flash");

app.use(flash());
// app.use(session());

/*app.use(session({
    secret:"fcht",  //链接sessionid
    name:"fcht",    //session名称
    "cookie":{maxAge:90000},    //最大储存数量
    saveUninitialized:false,     //是否保存为初始化的内容
}));*/

app.use(cookie());
//处理post请求   处理json数据
app.use(bodyparser.json());
//处理字符串
app.use(bodyparser.urlencoded({extended:true}));

//加载静态资源目录
app.use(express.static(path.join(__dirname,"static")));

app.use("/Handler",index);

// node解决跨域问题
app.all('*', function(req, res, next) {
    //响应头  允许所有网段请求
    res.header("Access-Control-Allow-Origin", "*");
    //方式
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    //版本
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

    res.header("X-Powered-By",' 3.2.1');
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});
// console.log(1);

module.exports=app;


// app.listen(3000);

