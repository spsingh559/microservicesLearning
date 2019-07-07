const healthChecks= [
    {
    protocol: 'http',
    host: 'localhost',
    path: '/api/v1/po',
    port: '4000'
  }, {
    protocol: 'http',
    host: 'localhost',
    path: '/api/vi/invoice',
    port: '4000'
  }
]

// export=module.exports=healthChecks;
exports=module.exports = healthChecks;