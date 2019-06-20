/**
 * Created by zhangxiaoming on 18/4/26.
 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'xiaoming',
    database : 'xiaoming'
});

connection.connect();

//查数据库
// var  sql = 'SELECT * FROM list';
// connection.query(sql,function (err, result) {
//     if(err){
//         console.log('[SELECT ERROR] - ',err.message);
//         return;
//     }
//
//     console.log('\n\n--------------------------SELECT结果----------------------------');
//     console.log(result);
//     console.log('------------------------------------------------------------\n\n');
// });


//插入数据库
for(i=0; i<10; i++) {
    var addSql = 'INSERT INTO list(Id,title,url,content) VALUES(0,?,?,?)';
    var addSqlParams = ['你好'+i, 'https://c.runoob.com', '88788'];
//增
    connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);
        console.log('INSERT ID:', result);
        console.log('-----------------------------------------------------------------\n\n');
    });
}






connection.end();