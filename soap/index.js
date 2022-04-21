// build webService base on soap
const api = require('./api')

const myService = {
  myService: {
    port: api
  }
};

const soap = require('soap');

const xml = require('fs').readFileSync('./soap/service.wsdl', 'utf8');

function SoapInit(server) {
  let soapServer = soap.listen(server, {
    path: '/service',
    services: myService,
    xml,

    enableChunkedEncoding: false,
    forceSoap12Headers: true
  })
}

module.exports = {
  SoapInit
}
