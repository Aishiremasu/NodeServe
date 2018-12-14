var mongodb = require("mongodb").MongoClient;
var setting = require("./setting");
function connectDB(callback) {
    var url=setting.url;
    mongodb.connect(url,function (err,db) {
        // var dbBase = db.db("test");
        if (err){
            callback(err);
        }
        callback(err,db);
    })
}
exports.add=function (dbname,collection,json,callback) {
    connectDB(function (err,db) {
        var dbBase = db.db(dbname);
        dbBase.collection(collection).insertOne(json,function (err,data) {
            // console.log("插入成功");
            // console.log(data);
            callback(err,data);
            db.close();
        })
    })
};
exports.del=function (dbname,collection,json,callback) {
    connectDB(function (err,db) {
        var dbBase = db.db(dbname);
        dbBase.collection(collection).remove(json,function (err,data) {
            // console.log("删除成功");
            // console.log(data);
            callback(err,data);
            db.close();
        })
    })
};
exports.update=function (dbname,collection,json,newJson,callback) {
    connectDB(function (err,db) {
        var dbBase = db.db(dbname);
        dbBase.collection(collection).update(json,{$set:newJson},function (err,data) {
            // console.log("更新成功");
            // console.log(data);
            callback(err,data);
            db.close();
        })
    })
};
exports.find=function (dbname,collection,json,callback) {
    connectDB(function (err,db) {
        var dbBase = db.db(dbname);
        dbBase.collection(collection).find(json).toArray(function (err,data) {
            // console.log(data);
            callback(err,data);
            db.close();
        })
    })
};
