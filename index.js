const bodyParser = require('body-parser')
const express = require('express')
const https = require('https')
const http = require('http')
const path = require('path')
const fs = require('fs')

const license = { // thanks simon
  fingerprint: fs.readFileSync(path.join(__dirname, 'fingerprint.txt'), 'utf8'),
  redeem_code: '6CJ0FCRY6P3D',
  license: fs.readFileSync(path.join(__dirname, 'license.txt'), 'utf8')
}

const cert = fs.readFileSync(path.join(__dirname, 'sx.xecuter.com.crt'), 'utf8')
const key = fs.readFileSync(path.join(__dirname, 'sx.xecuter.com.key'), 'utf8')
const sslOpt = {
  cert,
  key
}

const app = express()
require('./dns')
app.use(bodyParser.json())
app.post('/sx-api-server.php', (req, res) => {
  console.log('POST', req.url)
  if (req.query.u === 'sign') {
    console.log(req.body)
    return res.status(200).json({
      status: 'Ok'
    })
    /*return res.status(200).json({
      //status: 'team xecuter please accept my offering of a real license 100%!!'
    })*/
  } else if (req.query.u === 'retrieve') {
    return res.status(200).json({
      license: license.license
    })
  } else {
    console.log(req.query.u)
  }
})

https.createServer(sslOpt, app).listen(443, () => console.log('https server listening on :443 with self signed certs'))
http.createServer(app).listen(80, () => console.log('http server listening on :80'))