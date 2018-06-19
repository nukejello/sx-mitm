const bodyParser = require('body-parser')
const express = require('express')
const https = require('https')
const http = require('http')
const path = require('path')
const fs = require('fs')

const cert = fs.readFileSync(path.join(__dirname, 'sx.xecuter.com.crt'), 'utf8')
const key = fs.readFileSync(path.join(__dirname, 'sx.xecuter.com.key'), 'utf8')
const sslOpt = {
  cert,
  key
}

const app = express()
require('./dns')
app.use(bodyParser.json())
app.get('*', (req, res) => {
  console.log('GET', req.path)
  res.send('hi')
})
app.post('*', (req, res) => {
  console.log('POST', req.path)
  console.log(req.url)
  console.log(req.body)
  res.status(404).json({
    error: 'some error message for now' // how about we send a proper response,
  })
})

https.createServer(sslOpt, app).listen(443, () => console.log('https server listening on :443 with self signed certs'))
http.createServer(app).listen(80, () => console.log('http server listening on :80'))