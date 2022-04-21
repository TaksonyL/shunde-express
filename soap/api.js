const Xml2js = require('xml2js');
const request = require('../utils/request');

// string2base64
function stringToBase64(str) {
  var base64Str = Buffer.from(str).toString('base64');
  return base64Str;
}

// obj2xml
function getXml (obj) {
  const builder = new Xml2js.Builder({rootName: 'terminal'});
  const xml = builder.buildObject(obj);
  return xml;
}

// 获取设备信息
const GetAllState = async ({LockNo}, cb, headers, req) => {
  // get ip address
  let ip = '';
  try{
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
    ip = ip.match(/\d.*\d/)[0]   
  } catch(err) {
    console.log(err)
  }

  let data = await request('/api/cabinet/getAllState', {LockNo, ip});
  if(data.length > 0) {
    data = data.map(item => {
      return {
        boxNo: item.boxNo,
        qrcode: item.qrcode,
        boxStatus: item.boxStatus
      }
    })  
  }

  data = getXml({boxs: {box: data}});
  return { GetAllStateResult: stringToBase64(data) };
}

// 查询
const QueryState = async ({CardNo, TerminalNo}) => {
  let data = await request('/api/cabinet/queryState', {CardNo, TerminalNo});
  let xml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<terminal>
  <box>
    <boxMsg>${data.boxMsg}</boxMsg>
    <boxStatus>${data.boxStatus}</boxStatus>
  </box>
</terminal>`;
  return { QueryStateResult: stringToBase64(xml) };
}

// 获取信息
const GetLog = (card, terminal, lock) => {
  return { GetLogResponse: '' }
}

// 保存信息
const Savelog = async ({mobile, catpion, itype, color, TerminalNo, date, rmb}) => {
  let respond = { SavelogResult: 0 }
  try{
    let data = await request('/api/cabinet/saveLog', {mobile, catpion, itype, color, TerminalNo, date, rmb});
    console.log('saveLog', data)
    if(data === []) respond.SavelogResult = 1
    return respond
  } catch (err) {
    return { SavelogResult: 1 }
  }
  
}

// 查询格子状态
const downbox = async ({caption, TerminalNo}) => {
  try{
    let data = await request('/api/cabinet/downBox', {caption, TerminalNo});
    // return { downboxResult: 1 };
    return data;
  } catch (err) {
    return { downboxResult: 0 }
  }
}

// 查询电话号码
const findtel = async ({mobile}) => {
  let respond = { findtelResult: 0 }
  try{
    let result = await request('/api/cabinet/findtel', {mobile});
    if(result === []) respond.findtelResult = 1
    return respond;
  } catch (err) {
    return respond
  }
}

// 查询电话绑定设备
const querymobile = async ({tel, TerminalNo}) => {
  try{
    let result = await request('/api/cabinet/quertmobile', {TerminalNo, tel});
    return result || { querymobileResult: 0 }
  } catch (err) {
    return { querymobileResult: 0 }
  }
}

module.exports = {
  GetAllState,
  QueryState,
  GetLog,
  Savelog,
  downbox,
  findtel,
  querymobile
}