const exec = require('ssh-exec')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
var jsonParser = bodyParser.json();

app.post('/results', jsonParser, (req, res) => {
    const term = req.body.term
    console.log(term)
    exec('python3 p.py ' + term, {
        user: 'archisha_majee',
        host: '10.128.0.20',
        key: fs.readFileSync('../f'),
    }, function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
        const s = JSON.parse(stdout)
        console.log(s)
        const result = {
            results: s
        }
        res.send(result);
    });
})

app.post('/trends', jsonParser, (req, res) => {
    const url = req.body.url
    console.log(url)
    exec('python3 p2.py ' + url, {
        user: 'archisha_majee',
        host: '10.128.0.20',
        key: fs.readFileSync('../f'),
    }, function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
        const s = JSON.parse(JSON.stringify(stdout))
        console.log(s)
        const result = {
            clicks: s
        }
        res.send(result);
    });
})


app.post('/popularity', jsonParser, (req, res) => {
    const term = req.body.term
    console.log(term)
    exec('python3 p2.py ' + term, {
        user: 'archisha_majee',
        host: '10.128.0.20',
        key: fs.readFileSync('../f'),
    }, function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
        console.log(stdout)
        const s = JSON.parse(JSON.stringify(stdout))
        console.log(s)
        const result = {
            clicks: s
        }
        res.send(result);
    });
})

app.post('/getBestTerms',jsonParser, (req, res) => {
    const url = req.body.website
    console.log(req.body)
    exec('python3 p4.py ' + url, {
        user: 'archisha_majee',
        host: '10.128.0.20',
        key: fs.readFileSync('../f'),
    }, function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
        const s = JSON.parse(stdout)
        console.log(s)
        const result = {
            best_terms: s
        }
        res.send(result);
    });
})



PORT = 80
app.listen(PORT, () => 
   console.log('Listening ' + PORT)
)
