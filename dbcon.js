var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit     : 10,
  host                : 'classmysql.engr.oregonstate.edu',
  user                : 'cs340_username',
  password            : '',
  database            : 'cs340_username',
  multipleStatements  : true
});
module.exports.pool = pool;
