/**
 * Created by zhangxiaoming on 18/4/17.
 */
var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
var charset = require("superagent-charset"); //gbk编码
var agent = require("superagent"); //gbk编码
var fs = require('fs');
var dateTime = new Date().getTime();
var url = "https://www.xminseo.com/page/";
//var url = "https://www.xminseo.com/category/seohexin/page/"; //seo技术
var bigclass = "seo优化教程";
var contentInfo = ".article-content"; // 内容页面必须是唯一的
var listTitle = ".excerpt h2 a"; //列表页获取title

var utfCharset = 'UTF-8'; //页面字符集
var arcList = [];
charset(agent); //
var i = 2;
var curPage = 40;

function nextPage() {

    if (curPage >= i) {

        var nextUrl = url + i; //页码
        ++i;
        crawler(nextUrl);
        console.log(nextUrl);
    } else {
        productHtml();
    }
}

function productHtml() {
    let htmlArry2 = arcList.map((item, key) => {
        return 'NO.第' + key + '<br><div id=' + key + '><h2>' + item.title + '</h2><br>' + item.content + '</div><br><br>';
    });

    let htmlLeft = arcList.map((item, key) => {
        return '第<a href=#' + key + '>' + key + '--' + item.title + '</a><br>';
    });

    let indexHtml = "<div class=content><div style='position:fixed; width:260px; border-right:3px solid #999; height:800px; overflow-y:scroll;' >" + htmlLeft + "</div><div style=margin-left:300>" + htmlArry2 + "</div></div>";
    fs.writeFile('./' + bigclass + dateTime + '.html', indexHtml, {
        'flag': 'a'
    }, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('------------------生产' + bigclass + dateTime + '.html完成----------------------------');
    });
}


function crawler(url) {
    console.log("-----------" + url + "-----------------");
    var arcList = [];
    agent.get(url).charset(utfCharset).end(function(err, res) {
        if (res) {
            arcList = filterHtml(res.text);
        } else {
            console.log(err);
            productHtml();
        }

    });
    var dateTime2 = (new Date().getTime() - dateTime) / 1000;
    console.log('## 编译完成，共耗时：' + dateTime2 + "秒，请耐心抓取完成");

}
crawler(url);

function filterHtml(html) {

    var $ = cheerio.load(html);
    var aPost = $(listTitle); //列表页面title

    aPost.each(function() {
        var ele = $(this);
        var title = ele.text(); //取list文章的title
        var url = ele.attr("href"); //具体到打开文章的url
        console.log(url + "-------------" + title); //输出文章列表        
        agent.get(url).charset(utfCharset).end(function(err, res) {

            if (res) {

                var $ = res.text ? cheerio.load(res.text) : "";
                var content = $(contentInfo).text(); //文章页面的内容必须是唯一的
                content = content.replace(/信息均来源互联网,不代表黄金之家观点立场，若侵权请联系本站编辑。|家庭理财网小编就暂且先推荐以上几个，希望对大家有用处/g, "");
                content = content.replace(/\n|\r|\t/g, "<br>");
                content = content.replace(/<br><br><br>/g, "<br>");
                content = content.replace(/<br>{2,6}/g, " ");
                content = content.split("来源：")[0]; //去掉来源
                content = content.split("更多相关阅读推荐：")[0]; //更多相关阅读推荐
                content = content.replace(/网贷ABC|嘉丰瑞德/g, "宜信财富");
                //console.log(content);
                arcList.push({
                    title: title,
                    url: url.split("-")[1],
                    content: content,
                    bigclass: bigclass
                });
            } else {
                console.log(err);
                productHtml();
            };

        });

    });
    nextPage();

    return arcList;
}