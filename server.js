var http = require('http');
var fs = require('fs'); //fs
var path = require('path');
var querystring  =  require('querystring');  //post需导入
var duankou = 8089; //本地服务器端口号，可以自己设置
var documentRoot = __dirname;//总是返回被执行的 js 所在文件夹的绝对路径
var connection = require('./config'); //数据库配置文件
connection=connection.con;
//开始你的mysql连接
connection.connect();

var arr=[];


var server = http.createServer(function(req, res) {

    var url = req.url;
    var file = documentRoot + url;
    console.log(url);
    if(url=="/submitLogin"){

        var  post  =  '';  //定义了一个post变量，用于暂存请求体的信息
        req.on('data',  function(chunk){//通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
            post  +=  chunk;
        });
        //-------注意异步-------------
        req.on('end',  function(){   //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
            post  =  querystring.parse(post);
            console.log('name:'+post['name']+'\n');
            console.log('pwd:'+post['pwd']+'\n');


            if(post['name']=="123"&&post['pwd']=="123"){//简单写登录成功的匹配

                arr.push({
                    title: post['name'],

                    content: post['pwd']

                });

                fs.writeFile('./login.txt', JSON.stringify(arr), {'flag': 'a'}, function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('写入成功.');


                });

                //open("http://localhost:"+duankou+"/index.html");
            }else{
                res.writeHeader(200, {
                    'content-type': 'text/html;charset="utf-8"'
                });
                res.write("用户名密码不正确")
                res.end();

            }

        });



    }
    else if(url=='/index.html'){

        var all_list=[];
        //查询
        var selectSQL = 'select * from `list`';
        connection.query(selectSQL, function(err, rows) {
            // console.log(rows);
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                all_list.push({
                    title: rows[i].title,
                    url: rows[i].url,
                    //content: rows[i].content
                });

            };
            fs.writeFile('./index22.json',"");
            //生成json文件
            fs.writeFile('./index22.json', JSON.stringify(all_list), {'flag': 'a'}, function (err) {
                if (err) {
                    throw err;
                }
                console.log('Saved.');
            });

            return false;


        });
    };


    fs.readFile(file, function(err, data) {

        /*
         一参为文件路径
         二参为回调函数
         回调函数的一参为读取错误返回的信息，返回空就没有错误
         二参为读取成功返回的文本内容
         */
        if (err) {
            console.log(err);
            res.writeHeader(404, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
            res.end();
        } else {
            res.writeHeader(200, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write(data); //将index.html显示在客户端
            res.end();
        }

    });

}).listen(duankou);
//在server关闭的时候也关闭mysql连接
server.on('close',function(){
    connection.end();
});

var open = require("open");  //调用open方法打开网页
open("http://localhost:"+duankou+"/index.html");

console.log("静态资源服务器已启动"+duankou);