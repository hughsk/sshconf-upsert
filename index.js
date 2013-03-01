var ssh = require('sshconf-stream')
  , first = require('first-match')

function upsert(input, servers, callback) {
  var parseStream = ssh.createParseStream()
    , callback = callback || function(){}
    , servers = servers || []
    , buffer = ''

  var hosts = servers.map(function(h) {
    return Array.isArray(h.Host) ? h.Host : [h.Host]
  }).map(function(h) {
    return h.join('/')
  })

  parseStream
    .once('error', callback)
    .on('data', function(host) {
      var hostCombo = host.keywords.Host.join('/')
        , index = hosts.indexOf(hostCombo)

      if (index === -1) return buffer += host.raw

      first(servers, function(server) {
        var Host = server.Host
        Host = Array.isArray(Host) ? Host.join('/') : Host

        if (hostCombo === Host) {
          hosts.splice(index, 1)
          buffer += ssh.stringify(server) + '\n'
          return true
        }
      })
    })
    .once('close', function() {
      if (hosts.length) servers.filter(function(host) {
        return hosts.indexOf(host.Host) !== -1
      }).forEach(function(host) {
        buffer += ssh.stringify(host) + '\n'
      })

      callback(null, buffer)
    })
    .end(input)
};

module.exports = upsert
