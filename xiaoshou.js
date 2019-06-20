/**
 * Created by zhangxiaoming on 18/4/17.
 */
var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
var charset = require("superagent-charset"); //gbk编码
var agent = require("superagent"); //gbk编码
var fs = require('fs');
var connection = require('./config'); //数据库配置文件
site = connection.site;
connection = connection.con;

var url = "http://xiaoshou.mlbuy.com/xsjq/list_5_1.html";
var bigclass = "销售技巧";
var arcList = [];
charset(agent); //


function nextPage(html) {
    var $ = cheerio.load(html);
    var nextUrl = 0;
    console.log(nextUrl);

    var curPage = 25;
    if (!nextUrl) {
        console.log("该分类全部采集完毕");

    } else {
        //var nextPage = nextUrl.substring(nextUrl.indexOf('=') + 1);
      var nextPage= nextUrl+1;
    }
    if (curPage > nextPage) //控制结束写入
    {
        crawler(nextUrl);
    } else {
        console.log("提前结束");



        //文本文件
        let htmlArry = arcList.map(item => {
            return item.url + '\n' + item.title + '\n' + item.content + '\n\n\n\n'
        });
        fs.writeFile('./' + bigclass + dateTime / 1000 + '.txt', htmlArry, {
            'flag': 'a'
        }, function(err) {
            if (err) {
                console.log(err);
            }
            console.log('--------------------------文本文件----------------------------');
        });

        return false;

        //生成json文件
        fs.writeFile('./index' + dateTime + '.json', JSON.stringify(arcList), {
            'flag': 'a'
        }, function(err) {
            if (err) {
                throw err;
            }
            console.log('--------------------------json文件生成----------------------------');
        });

        return false;



        //插入数据库
        connection.connect();


        for (i = 0; i < arcList.length; i++) {
            console.log(arcList[i]);
            var addSql = 'INSERT INTO list(Id,title,url,content,bigclass) VALUES(0,?,?,?,?)';
            var addSqlParams = [arcList[i].title, arcList[i].url, arcList[i].content, arcList[i].bigclass];
            connection.query(addSql, addSqlParams, function(err, result) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message);
                    return;
                }


            });
        }

        connection.end();
        console.log('--------------------------插入数据库已完成----------------------------');


    }


}
var dateTime = new Date().getTime();

function crawler(url) {
    var arcList = [];
    agent.get(url).charset('gbk').end(function(err, res) {
        if (res) {
            nextPage(res.text);
            //console.log(res);
            arcList = filterHtml(res.text);
        } else {
            console.log(err);
        }

    });
    var dateTime2 = (new Date().getTime() - dateTime) / 1000;
    console.log('## 编译完成，共耗时：' + dateTime2 + "秒，请耐心抓取完成");

}
crawler(url);

function filterHtml(html) {
    var $ = cheerio.load(html);
    var aPost = $(".tangfei_1200df_xld .tangfei_1200df_bbda");
    aPost.each(function() {
        var ele = $(this);
        var title = ele.find("dt").text(); //取list文章的title
        var url = ele.find("dt a").attr("href"); //具体到打开文章的url
        console.log(url);//输出文章列表
        agent.get(url).charset('gbk').end(function(err, res) {
            if (res) {

                var $ = res.text ? cheerio.load(res.text) : "";
                var content = $("#article_content").text(); //文章页面的内容
                content = content.replace(/信息均来源互联网,不代表黄金之家观点立场，若侵权请联系本站编辑。|家庭理财网小编就暂且先推荐以上几个，希望对大家有用处/g, "");
                content = content.replace(/\n|\r|\t/g, "\n");
                content = content.replace(/<br>{3,6}/g, "\n");
                content = content.split("来源：")[0]; //去掉来源
                content = content.split("更多相关阅读推荐：")[0]; //更多相关阅读推荐
                content = content.replace(/网贷ABC|嘉丰瑞德/g, "宜信财富");
                content = content.replace(/(\d|一|二|三|四|五|六|七|八)、.*?(，|<br>)/g, function(word) {
                    return "<br><b>" + word + "</b>"

                });

                arcList.push({
                    title: title,
                    url: url.split("-")[1],
                    content: content,
                    bigclass: bigclass
                });
            } else {
                console.log(err);
            };

        });

    });


    return arcList;
}