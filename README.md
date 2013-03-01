# sshconf-upsert [![Build Status](https://travis-ci.org/hughsk/sshconf-upsert.png?branch=master)](https://travis-ci.org/hughsk/sshconf-upsert)

Upsert hosts into your `~/.ssh/config` file(s).

## Installation ##

``` bash
$ npm install sshconf-upsert
```

## Usage ##

**require('sshconf-upsert')(contents, hosts, callback)**

``` javascript
var upsert = require('sshconf-upsert')
  , fs = require('fs')

var config = fs.readFileSync(process.env.HOME + '/.ssh/config', 'utf8')

upsert(config, [{
  Host: 'second',
  HostName: 'google.com'
}, {
  Host: 'third',
  HostName: '192.167.2.16'
}], function(err, upserted) {
  fs.writeFileSync(process.env.HOME + '/.ssh/config', upserted)
})
```

Essentially, `sshconf-upsert` takes a config string and an array of hosts,
returning an updated version. Existing entries will be modified, and missing
ones added to the end. The above script should take this:

``` bash
Host first
  HostName 192.168.2.1

# comments and formatting
# are preserved

Host second
  HostName 192.168.2.4
```

And turn it into this:

``` bash
Host first
  HostName 192.168.2.1

# comments and formatting
# are preserved

Host second
  HostName google.com

Host third
  HostName 192.168.2.16
```
