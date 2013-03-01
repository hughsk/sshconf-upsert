var test = require('tape')
  , upsert = require('./')

// for not fussing about whitespace
function trim(str) {
  return str.split('\n').filter(function(line) {
    return line.match(/\S/)
  }).map(function(line) {
    return line.replace(/^\s+|\s$/g, '')
  }).join('\n')
};

test('updates hosts', function(t) {
  t.plan(2)

  upsert([
    'Host testing'
  , 'HostName first.try'
  , 'Host filler'
  ].join('\n'), [{
    Host: 'testing'
  , HostName: 'second.try'
  }], function(err, updated) {
    t.error(err)
    t.equal(trim(updated), [
      'Host testing'
    , 'HostName second.try'
    , 'Host filler'
    ].join('\n'))
  })
})

test('inserts hosts', function(t) {
  t.plan(2)

  upsert([
    'Host first'
  , 'HostName first.com'
  , 'Host second'
  , 'HostName second.com'
  ].join('\n'), [{
    Host: 'third'
  , HostName: 'third.com'
  }], function(err, inserted) {
    t.error(err)
    t.equal(trim(inserted), [
      'Host first'
    , 'HostName first.com'
    , 'Host second'
    , 'HostName second.com'
    , 'Host third'
    , 'HostName third.com'
    ].join('\n'))
  })
})

test('preserves other hosts', function(t) {
  t.plan(2)

  upsert([
    '# comment'
  , 'Host preserved'
  , '# another comment'
  , 'Host modified'
  , 'IdentityFile ~/.ssh/file.pem'
  , 'Host untouched'
  , '# comment again'
  ].join('\n'), [{
    Host: 'modified'
  , IdentityFile: '~/.ssh/modified.pem'
  }], function(err, updated) {
    t.error(err)
    t.equal(trim(updated), [
      '# comment'
    , 'Host preserved'
    , '# another comment'
    , 'Host modified'
    , 'IdentityFile ~/.ssh/modified.pem'
    , 'Host untouched'
    , '# comment again'
    ].join('\n'))
  })
})
