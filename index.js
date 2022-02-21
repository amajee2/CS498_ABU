const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
var connection = mysql.createConnection({
        host: 'localhost',
        user: 'master',
        password: 'cs498',
        database: 'userdb',
});
connection.connect();
// Init web app
const app = express();
var jsonParser = bodyParser.json();
app.get('/greeting', (req, res) => {
    res.send('Hello World!')
})
app.post('/register',jsonParser, (req, res) => {
    console.log(req.body.username);
    let u = req.body.username;
    let query = `INSERT INTO Users(username) VALUES ("${u}")`;
    connection.query(query,(e, r) => {
        console.log(r);
         if (e){
                 console.log(e);
        }
        else{
                res.json({'messge':'add success', 'username':r});
                console.log(r);
        }
    });
});

app.get('/list', (req, res) => {
    let query = 'SELECT * FROM Users'
    let query_res = [];
    connection.query(query,(err, results, fields) => {
         if (err)
                console.log(err)
         else {
                for (const item of results) {
                        console.log(item);  
                        var str = JSON.stringify(item);
                        var objVal = JSON.parse(str);
                        query_res.push(objVal['username']);
                }
                console.log(query_res)
                res.json({'users': query_res});
            }
        });
});

app.post('/clear', () => {
    let query = `DELETE FROM Users`;
    connection.query(query,(e, r) => {
        console.log(r);
         if (e){
                 console.log(e);
        }
        else{
                console.log('delete success');
        }
    });
});

PORT = 80
app.listen(PORT, () =>
    console.log('Listening ' + PORT)
)
