# seoRobot
自定义文章采集器,Custom article collector

##### 使用规则说明

###### 终端运行 

>>node  xiaoshoujiqiao


###### 正则过滤规则
>>content = content.replace(/(https?.*?\.(:?html\b)(?!\.))/g, '');  //过滤url 类似https://www.35ui.cn/14436.html
>>content = content.replace(/(https?.*?\.(:?cn\b|com\b|net\b|org\b|gov\b)(?!\.))/g, '');//过滤url 类似https://www.35ui.cn
>>content = content.replace(/(<br>){2,6}/g, "<br>");  //替换多个<br>

###### 生成文本文件


```
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
```
###### 生成html文件
```
 let htmlArry2 = arcList.map((item,key) => {
        return 'NO.第'+key + '<br>' + item.title + '<br>' + item.content + '<br><br>';
    });
    fs.writeFile('./' + bigclass + dateTime + '.html', htmlArry2, {
        'flag': 'a'
    }, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('--------------------------html文件----------------------------');
    });
```


###### 生成json文件

```
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
```



本工具支持mysql 保存
具体配置文件：config.js

```
var mysql      = require('mysql');
var connection = mysql.createConnection({
host     : 'localhost',
user     : 'root',
password : 'xiaoming',
database : 'xiaoming'
});
```
