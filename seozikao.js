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
//var url = "https://www.xminseo.com/page/";
var url = "http://blog.zhijin.com/news/"; //seo技术
var bigclass = "自考";
var contentInfo = ".pageCont"; // 内容页面必须是唯一的
var listTitle = ".wrap .word a"; //列表页获取title
var utfCharset = 'utf-8'; //页面字符集
var arcList = [];
charset(agent); //
var i = 1,
curPage = 4;

let crawler=(url)=> {
    console.log("-----------" + url + "-----------------");
    let arcList = [];
    agent.get(url).charset(utfCharset).end(function (err, res) {
        if (res) {
            arcList = filterHtml(res.text);
        } else {
            console.log(err);
            productHtml();
        }

    });
    let dateTime2 = (new Date().getTime() - dateTime) / 1000;
    console.log('## 编译完成，共耗时：' + dateTime2 + "秒，请耐心抓取完成");

}

let nextPage=()=> {
    if (curPage >= i) {
        let nextUrl = url + i+"/"; //页码
        ++i;
        crawler(nextUrl);
        console.log(nextUrl);
    } else {
        productHtml();
    }
}
nextPage();

let productHtml=()=> {
    let htmlArry2 = arcList.map((item, key) => {
        return 'NO.第' + key + '<br><div id=' + key + '><h2>' + item.title + '</h2><div class="rightContent">' + item.content + '</div><br><br>';
    });

    let htmlLeft = arcList.map((item, key) => {
        return '<a href=#' + key + '>第' + key + '--' + item.title + '</a><br>';
    });

    let indexHtml = "<html><head><meta charset='utf-8'>"
    +"<title>【北京seo教程】北京seo外包公司,北京seo优化教程_靠谱北京seo优化外包团队</title>"
    +"<meta name='keywords' content='北京seo教程,北京seo,北京seo优化,北京seo优化外包公司'>"
    +"<meta name='description' content='北京seo教程_靠谱北京seo优化外包团队,北京seo优化外包公司专业十年北京seo优化外包团队、北京seo教程、seo优化、网站优化服务、网站运营外包'>"
    +"<body> <link rel='stylesheet' type='text/css' href='./css.css?v=201806'/>"
    +"<div class=content><div class='left' >" + htmlLeft + "</div><div class='right'>" + htmlArry2 + "</div></div>";
    fs.writeFile('./' + bigclass + dateTime + '.html', indexHtml, {
        'flag': 'a'
    }, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('------------------生产' + bigclass + dateTime + '.html完成----------------------------');
    });
}




let filterHtml=(html)=> {

    let $ = cheerio.load(html);
    let aPost = $(listTitle).eq(0); //列表页面title
    console.log(aPost.length);
    aPost.each(function () {
        let ele = $(this);
        let title = ele.text(); //取list文章的title
        let url = ele.attr("href"); //具体到打开文章的url
        console.log(url + "-------------" + title); //输出文章列表        
        agent.get(url).charset(utfCharset).end(function (err, res) {
           // console.log(res);       
            if (res) {

                let $ = res.text ? cheerio.load(res.text) : "";
                let content = $(contentInfo).text(); //文章页面的内容必须是唯一的
                // let contentcc=$(".wb-excerpt").text();//匹配相同的内容过滤掉
                // content = content.replace(contentcc, "www.35ui.cn");
                content = content.replace(/<[^>]+>/g, "<br>");  //过滤掉所有的html标签
                content = content.replace(/(https?.*?\.(:?html\b)(?!\.))/g, '');  //过滤url 类似https://www.xminseo.com/14436.html
                content = content.replace(/(https?.*?\.(:?cn\b|com\b|net\b|org\b|gov\b)(?!\.))/g, '');//过滤url 类似https://www.xminseo.com
                content = content.replace(/当前位置：seo教程 »|SEO优化技术 »|大杂烩 »|本文地址：|最后编辑于：|作者：小明seo|喜欢|or分享/g, "");
                content = content.replace(/\n|\r|\t/g, "<br>");
                content = content.replace(/(<br>){2,10}/g, "<br>");
                content = content.replace(/\(.*\)/g, "")//去掉括号及内容 例如：(7)
                content = content.split("来源：")[0]; //去掉来源
                content = content.split("更多相关阅读推荐：")[0]; //更多相关阅读推荐
                content = content.replace(/www.xminseo.com|嘉丰瑞德/g, "www.35ui.cn");

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