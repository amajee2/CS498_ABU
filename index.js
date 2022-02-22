const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
var connection = mysql.createConnection({
        host: 'localhost',
        user: 'master',
        password: 'cs498',
        database: 'userdb',
});
connection.connect();

const { otherHost } = require("./host");
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

let secReq = req.body.isSecondaryRequest;
let query = `INSERT INTO Users(username) VALUES ("${u}")`;
try {
     connection.query(query,(e, r) => {
            console.log(r);
            if (e){
                     console.log(e);
            }
            else{
                    //res.json({'username':r});
                    console.log(r);
             }
     });
     if(!secReq) {
            axios.post("http://" + otherHost + '/register', {
                   'username':u,
                    'isSecondaryRequest': true
            }).catch();
     }
} catch(e) {
            console.log(e);
} finally {
            res.sendStatus(200);
}
});

app.get('/list', (req, res) => {
let query = 'SELECT * FROM Users'
let query_res = [];
connection.query(query,(err, results, fields) => {
     if (err)
            console.log(err)
     else {
            const list = results.map(e => e.username);
            res.json({'users': list});
        }
    });
});


app.post('/clear', (req, res) => {
    let query = `DELETE FROM Users`;
    connection.query(query,(e, r) => {
        console.log(r);
         if (e){
                 console.log(e);
        }
        else{
                res.sendStatus(200);
                console.log('delete success');
        }
    });
    axios.post('http://' + otherHost + "/clear-no-pushing");
});

app.post('/clear-no-pushing', (req, res) => {
    let query = `DELETE FROM Users`;
    connection.query(query,(e, r) => {
        console.log(r);
         if (e){
                 console.log(e);
        }
        else{
                res.sendStatus(200);
                console.log('delete success');
        }
    });
});
PORT = 80
app.listen(PORT, () =>
    console.log('Listening ' + PORT)
)

PORT = 80
app.listen(PORT, () =>
    console.log('Listening ' + PORT)
)
