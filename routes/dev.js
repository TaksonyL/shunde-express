var express = require('express');
var router = express.Router();
const request = require('../request');

/* GET home page. */
router.post('/abc/payment', function (req, res, next) {
  console.log('body', req.body)

  res.set('Content-Type', 'text/plain')
  res.json({
    code: 200,
    msg: 'test',
    data: {
      OneQRForAll: 'https://bank.u51.com/ebus-two/docs/#/api/pay/abc-pay/abc-order'
    },
    OneQRForAll: 'https://bank.u51.com/ebus-two/docs/#/api/pay/abc-pay/abc-order',
    MSG: {
      Message: {
        OneQRForAll: 'https://bank.u51.com/ebus-two/docs/#/api/pay/abc-pay/abc-order'
      }
    }
  })
})


router.get('/getAllstate', function(req, res, next) {
  try{
    request('/api/cabinet/getAllState', {LockNo: 'A1'}, function(_err, _res, body) {
      res.json({
        code: 200,
        message: 'success',
        msg: body.msg,
        data: body.data || {}
      })
    })
  } catch (err) {
    res.json({
      code: 0,
      message: 'failed',
      data: err
    })   
  }
});

router.get('/quertState', function(req, res, next) {
  try{
    request('/api/cabinet/queryState', {CardNo: '123456'}, function(_err, _res, body) {
      res.json({
        code: 200,
        message: 'success',
        msg: body.msg,
        data: body.data || {}
      })
    })
  } catch (err) {
    res.json({
      code: 0,
      message: 'failed',
      data: err
    })   
  }
})

router.get('/downbox', function(req, res, next) {
  try{
    request('/api/cabinet/downBox', {caption: '1', TeminalNo: 'A1'}, function(_err, _res, body) {
      res.json({
        code: 200,
        message: 'success',
        msg: body.msg,
        data: body.data || {}
      })
    })
  } catch (err) {
    res.json({
      code: 0,
      message: 'failed',
      data: err
    })   
  }
})

router.get('/findtel', function(req, res, next) {
  try{
    request('/api/cabinet/findtel', {mobile: '136404455907'}, function(_err, _res, body) {
      res.json({
        code: 200,
        message: 'success',
        msg: body.msg,
        data: body.data || {}
      })
    })
  } catch (err) {
    res.json({
      code: 0,
      message: 'failed',
      data: err
    })   
  }
})

router.get('/querymobile', function(req, res, next) {
  try{
    request('/api/cabinet/quertmobile', {TerminalNo: 'A1'}, function(_err, _res, body) {
      res.json({
        code: 200,
        message: 'success',
        msg: body.msg,
        data: body.data || {}
      })
    })
  } catch (err) {
    res.json({
      code: 0,
      message: 'failed',
      data: err
    })   
  }
})

router.get('/savelog', function(req, res, next) {
  const request = {
    mobile: '13312341234',
    caption: 1,
    rmb: 0,
    itype: 3,
    color: 10,
    TerminalNo: 'A1'
  };
  let where = { 
    box_no: request.caption,
    box_terminal: request.TerminalNo
  }
  let update = {
    box_code: request.caption + request.color,
    box_status: 1,
    box_type: 1
  }
  Box.updateBox(where, update).then(result => {
    res.json({
      code: 200,
      message: 'success',
      data: result
    })
  }).catch(err => {
    res.json({
      code: 0,
      message: 'failed',
      data: err
    })
  })
})

module.exports = router;
