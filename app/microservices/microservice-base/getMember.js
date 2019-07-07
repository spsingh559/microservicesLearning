require('seneca')({
    tag: 'repl',
    log: { level: 'none' }
  })
    .use('mesh')
    .repl({
      port: 10001,
      alias: {
        m: 'role:mesh,get:members'
      }
    })