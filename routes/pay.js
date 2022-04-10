/**
 * 对接设备支付接口
 */
var express = require('express');
var router = express.Router();
const request = require('../request');

router.post('/abc/payment', async function (req, res, next) {
  let body = JSON.parse(req.body);

  request('/pay/abc/payment', body, function(error, result, body) {
    let resultData = {}
    if(body.msg) {
      resultData = {
        returnCode: '0000',
        errorMessage: body.msg,
        orderNo: '',
        oneQRForAll: ''
      }
    } else {
      let respond = body;
      respond = JSON.parse(body.match(/\{.*\}/)[0]);
      resultData = respond.data
    }
    res.set('Content-Type', 'text/plain')
    res.json(resultData)
  });
})

router.post('/abc/queryOrder', function (req, res, next) {
  let body = JSON.parse(req.body);

  request('/pay/abc/queryOrder', body, function(error, result, body) {
    let respond = body;
    respond = JSON.parse(body.match(/\{.*\}/)[0]);
    respond = respond.data;
    let respondData = {
      returnCode: respond.returnCode,
      returnMsg: respond.returnMsg,
      status: '01'
    }
    if(respond.order) {
      try{
        respond.order = JSON.parse(respond.order)
        respondData.status = respond.order.Status;
      } catch(err) {}
    }
    res.json(respondData)
  });

})

module.exports = router;