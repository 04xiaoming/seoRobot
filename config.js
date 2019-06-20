var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'xiaoming',
    database : 'xiaoming'
});
var site={
url:"http://www.huangjinzhijia.com/hjbk/index.php?page=",
bigclass:"金融百科"
};

module.exports.con=connection;

module.exports.site=site;