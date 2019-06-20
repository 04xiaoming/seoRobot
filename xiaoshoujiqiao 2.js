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
var dateTime = new Date().getTime();
site = connection.site;
connection = connection.con;

var url = "http://xiaoshou.mlbuy.com/xsjq/list_5_";
var bigclass = "销售技巧";
var arcList = [];
charset(agent); //
var i = 1;
var curPage = 61;
function nextPage(html) {
    var $ = cheerio.load(html);
    if (curPage > i) {
        ++i;
        var nextUrl = url + i + '.html';
        crawler(nextUrl);
        console.log(nextUrl);
    }
    //文本文件
    let htmlArry = arcList.map((item,key) => {
        return 'NO.第'+key + '\n' + item.title + '\n' + item.content + '\n\n\n\n';
    });
    fs.writeFile('./' + bigclass + dateTime + '.txt', htmlArry, {
        'flag': 'a'
    }, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('--------------------------文本文件----------------------------');
    });

    return false;

    //生成json文件
    fs.writeFile('./index' + dateTime + '.json', JSON.stringify(arcList), {
        'flag': 'a'
    }, function (err) {
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
        connection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }


        });
    }

    connection.end();
    console.log('--------------------------插入数据库已完成----------------------------');


}
function crawler(url) {
    var arcList = [];
    agent.get(url).charset('gbk').end(function (err, res) {
        if (res) {
            nextPage(res.text);

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
    var aPost = $(".listbox .e2 .title");
    aPost.each(function () {
        var ele = $(this);
        var title = ele.find("b").text(); //取list文章的title
        var url = "http://xiaoshou.mlbuy.com" + ele.attr("href"); //具体到打开文章的url
        console.log(url);//输出文章列表
        agent.get(url).charset('gbk').end(function (err, res) {
            if (res) {

                var $ = res.text ? cheerio.load(res.text) : "";
                var content = $(".viewbox .content").text(); //文章页面的内容
                content = content.replace(/信息均来源互联网,不代表黄金之家观点立场，若侵权请联系本站编辑。|家庭理财网小编就暂且先推荐以上几个，希望对大家有用处/g, "");
                content = content.replace(/\n|\r|\t/g, "\n");
                content = content.replace(/<br>{3,6}/g, "\n");
                content = content.split("来源：")[0]; //去掉来源
                content = content.split("更多相关阅读推荐：")[0]; //更多相关阅读推荐
                content = content.replace(/网贷ABC|嘉丰瑞德/g, "宜信财富");
                content = content.replace(/(\d|一|二|三|四|五|六|七|八)、.*?(，|<br>)/g, function (word) {
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