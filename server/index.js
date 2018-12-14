// 接口文件
var express = require("express");
var router = express.Router();
var db = require("./modul/db");
var crypto = require("crypto");
var objectId = require("mongodb").ObjectID;
// console.log(objectId);
router.get("/AdminHandler", function (req, res) {
    var actions = req.query.action;
    switch (actions) {
        case "veri":
            /*
            * 获取验证码
            * 1.生成随机数
            *
            * */
            // randomNum(0,str.length);
            var randomNum = function (min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            };
            var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var newStr = "";

            for (var i = 0; i < 4; i++) {
                var index = randomNum(0, str.length);
                newStr += str[index];
            }
            req.flash.veri = newStr;
            res.send({ "success": newStr });
            break;
        case "checkveri":
            /*
            * 校验验证码
            *
            *
            * */
            if (req.query.veri == req.flash.veri) {
                res.send({ data: true });
            } else {
                res.send({ data: false });
            }
            break;
    }
});
router.post("/AdminLogin", function (req, res) {
    var actions = req.query.action;
    switch (actions) {
        case "login":
            var mdlogin = crypto.createHash("md5");
            var password = mdlogin.update(req.body.password).digest("base64");
            db.find("userData", "login", { "username": req.body.username }, function (err, data) {
                var a = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].username == req.body.username) {
                        a = i;
                    }
                }
                if (data.length == 0) {
                    res.send("没有此用户");
                } else {
                    if (password != data[a].password) {
                        res.send("密码错误");
                    } else {
                        res.send("登陆成功");
                        var user = data[a];
                        req.flash.user = user;
                    }
                    // console.log(data);
                    /*
                    * 1.拿到用户名
                    * 2.电话
                    * 3.邮箱
                    * 4.管理员
                    * */
                    // console.log(user);
                }
            });
            // res.send();
            break;
        /*
        * 退出登陆
        * */
        case "quit":
            // console.log(req.flash.user);
            if (req.flash.user) {
                req.flash.user = {};
                res.send({ "success": "退出成功" });
            }
            break;
        case "returnInfo":
            /*
            * 获取用户信息
            * */
            if (req.flash.user) {
                var sessionId = new objectId(req.flash.user._id);
                db.find("userData", "login", { "_id": sessionId }, function (err, data) {
                    res.send({ "success": "获取成功", "data": data })
                });
            }
            break;
        case "register":
            // case "add":
            /**
             * 用户名 username
             * 姓名 name
             * 手机 phone
             * 密码 password
             * 邮箱
             * 权限
             *  系统管理员
             *  课程管理员
             *  权限编码 0 1
             * */
            //加密
            var md5 = crypto.createHash("md5");
            var password = md5.update(req.body.password).digest("base64");
            var tokenId = 0;
            db.find("userData", "login", {}, function (err, data) {
                tokenId = data.length
                console.log(tokenId)

                // console.log(password);
                db.find("userData", "login", { "username": req.body.username }, function (err, data) {
                    if (data.length != 0) {
                        res.send({ "err": "此用户名已被注册" });
                    } else {
                        var regPhone = new RegExp(/^1[34578]\d{9}$/);  //手机号码
                        var regMailbox = new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/);  //邮箱正则
                        // console.log(regPhone.test(req.body.phone))
                        if (regPhone.test(req.body.phone) == false) {
                            res.send({ "err": "请输入正确的电话" });
                        } else if (regMailbox.test(req.body.mailbox) == false) {
                            res.send({ "err": "请输入正确的邮箱" });
                        } else {
                            db.add("userData", "login", {
                                "username": req.body.username,
                                "name": req.body.name,
                                "phone": req.body.phone,
                                "password": password,
                                "mailbox": req.body.mailbox,
                                "identity": req.body.identity,
                                "updateAt": new Date(),
                                "tokenId": tokenId
                            }, function (err, data) {
                                // console.log(data);
                                res.send({ "success": "注册成功" });
                            })
                        }
                    }
                })

            });
            break;
        case "changePassword":
            /*
            * 更改密码
            * */
            // console.log(req.body);
            // 登陆后修改密码
            /*if (req.flash.user) {
                var sessionId = new objectId(req.flash.user._id);
                db.find("userData", "login", {"_id": sessionId}, function (err, data) {
                    res.send({"success": "获取成功", "data": data})
                });
            }*/
            db.find("userData", "login", { "username": req.body.username }, function (err, data) {
                var mdOld = crypto.createHash("md5");
                var oldpassword = mdOld.update(req.body.oldpassword).digest("base64");
                var mdNew = crypto.createHash("md5");
                var newpassword = mdNew.update(req.body.newpassword).digest("base64");
                var a = 0;
                var dataLen = data.length;
                for (var i = 0; i < dataLen; i++) {
                    if (data[i].username == req.body.username) {
                        a = i;
                    }
                }
                if (data.length == 0) {
                    res.send({ result: "请输入正确的用户名" });
                } else if (data[a].password != oldpassword) {
                    res.send({ result: "请输入正确的旧密码" });
                } else {
                    db.update(
                        "userData",
                        "login",
                        { "username": req.body.username },
                        { "password": newpassword },
                        function (err, data) {
                            res.send({ result: "密码修改成功" });
                        });
                }
            });
            break;
        case "cancel":
            /*
            * 删除账号
            * */
            var mdloginC = crypto.createHash("md5");
            var passwordC = mdloginC.update(req.body.password).digest("base64");
            db.find("userData", "login", { "username": req.body.username }, function (err, data) {
                var a = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].username == req.body.username) {
                        a = i;
                    }
                }
                if (data.length == 0) {
                    res.send({ "result": "没有此用户" });
                } else {
                    if (passwordC != data[a].password) {
                        res.send({ "result": "密码错误" });
                    } else {
                        /** 
                        * 删除账号操作
                        * */
                        db.del("userData", "login", { "username": req.body.username }, function (err, data) {
                            res.send({ "result": "账号删除成功" });
                        })
                    }
                }
            });
            break;
        case "userList":
            // console.log(req.body.pageStart)
            db.find("userData", "login", {}, function (err, adata) {
                // var pageStart = req.body.pageStart<adata.length?req.body.pageStart:1;
                var selector = !req.body.searchTxt ? {
                    tokenId: {
                        $gte: parseInt(req.body.pageStart) * 3 - 3,
                        $lt: parseInt(req.body.pageStart) * 3
                    }
                } : req.query.searchTxt;
                db.find("userData", "login", {}, function (err, allData) {
                    db.find("userData", "login", selector, function (err, data) {
                        if (data.length == 0) {
                            res.send({ "err": "没有此用户" });
                        } else {
                            var result = {
                                "success": "成功",
                                data: {
                                    pageSize: 3,
                                    count: allData.length,
                                    list: data
                                }
                            }
                            res.send(result);
                        }

                    })
                })

            });
            /** 
             * 
             * 
             * 
             * 
             */
            break;
        case "delete":
            /* 删除数据库的数据 */
            db.del("userData", "login", { "tokenId": req.body.tokenId }, function (err, data) {
                var tokenIdGt = {
                    tokenId: {
                        $gt: req.body.tokenId
                    }
                }
                db.find("userData", "login", tokenIdGt, function (err, data) {
                    //     var newtokenId = data.tokenId-1;
                    // console.log(data.length)
                    for (var i = 0; i < data.length; i++) {
                        // data[i].tokenId
                        var newtokenId = data[i].tokenId - 1;
                        db.update("userData", "login", { tokenId: data[i].tokenId }, { tokenId: newtokenId }, function (err, upData) {
                            // console.log(1)
                        })
                    }


                })

                res.send({ "success": "删除成功" });
            })

            break;
    }
});
module.exports = router;