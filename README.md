# seoRobot
自定义文章采集器,Custom article collector

##### 使用规则说明

###### 终端运行 
node  xiaoshoujiqiao

######生成文本文件
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

######生成json文件

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
