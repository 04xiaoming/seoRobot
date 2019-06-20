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

var url = "http://seo.hkxiaopan.com/seojishu/list_16_";
var bigclass = "seo技术";
var arcList = [];
charset(agent); //
var i = 1;
var curPage = 17;
function nextPage(html) {
    var $ = cheerio.load(html);
    if (curPage >= i) {
        ++i;
        var nextUrl = url + i + '.html';
        crawler(nextUrl);
        console.log(nextUrl);
    }
    console.log("111");

    let htmlArry2 = arcList.map((item,key) => {
        return 'NO.第'+key + '<br>' + item.title + '<br>' + item.content + '<br><br>';
    });
    fs.writeFile('./' + bigclass + dateTime + '.html', htmlArry2, {
        'flag': 'a'
    }, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('--------------------------文本文件----------------------------');
    });


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

    console.log("999");

    //return false;

 




}
function crawler(url) {
    var arcList = [];
    agent.get(url).charset('gbk').end(function (err, res) {
        if (res) {
            arcList = filterHtml(res.text);
            nextPage(res.text);
            console.log(888);
            
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
    var aPost = $(".listl li h3 a");
    //console.log(aPost);
    aPost.each(function () {
        var ele = $(this);
        var title = ele.text(); //取list文章的title
        var url = ele.attr("href"); //具体到打开文章的url
        console.log(url);//输出文章列表
        console.log(777);
        agent.get(url).charset('gbk').end(function (err, res) {
            
            if (res) {
                console.log(666);        
                var $ = res.text ? cheerio.load(res.text) : "";
                var content = $(".article-content").text(); //文章页面的内容
                content = content.replace(/信息均来源互联网,不代表黄金之家观点立场，若侵权请联系本站编辑。|家庭理财网小编就暂且先推荐以上几个，希望对大家有用处/g, "");
                content = content.replace(/\n|\r|\t/g, "<br>");
                content = content.replace(/<br><br><br>/g, "<br>");
                content = content.replace(/<br>{2,6}/g, " ");
                content = content.split("来源：")[0]; //去掉来源
                content = content.split("更多相关阅读推荐：")[0]; //更多相关阅读推荐
                content = content.replace(/网贷ABC|嘉丰瑞德/g, "宜信财富");
             


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