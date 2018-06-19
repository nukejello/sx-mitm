const dns = require('native-dns')
const server = dns.createServer()
const asyn = require('async')

const zones = require('./zones.json')

const authority = {
  address: '8.8.8.8',
  port: 53,
  type: 'udp'
}

server.on('listening', () => console.log('server listening on', server.address()))
server.on('close', () => console.log('server closed', server.address()))
server.on('error', (err, buff, req, res) => console.error(err.stack))
server.on('socketError', (err, socket) => console.error(err))


function proxy(q, res, cb) {
  //console.log('proxying', q.name)

  let request = dns.Request({
    question: q,
    server: authority,
    timeout: 1000
  })

  request.on('message', (err, msg) => {
    msg.answer.forEach(a => res.answer.push(a))
  })
  request.on('end', cb)
  request.send()
}

function handleRequest(req, res) {
  //console.log('request from', req.address.address, 'for', req.question[0].name)
  let f = []

  req.question.forEach((q) => {
    let entry = zones.filter(r => new RegExp(r.domain, 'i').exec(q.name))
    if (entry.length) {
      console.log('request from', req.address.address, 'for', req.question[0].name)
      entry[0].records.forEach((record) => {
        record.name = q.name
        record.ttl = record.ttl || 1800
        res.answer.push(dns[record.type](record))
      })
    } else {
      f.push(cb => proxy(q, res, cb))
    }
    
  })
  asyn.parallel(f, function() {
    res.send()
  })
}

server.on('request', handleRequest)

server.serve(53)