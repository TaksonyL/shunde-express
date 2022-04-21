# 基础

此协议基于soap

根据场景可能需要对wsdl文件进行修改

```
  <wsdl:service name="Service">
    <wsdl:port name="ServiceSoap" binding="tns:ServiceSoap">
      <soap:address location="http://10.212.8.68:9001/Service.asmx" />
    </wsdl:port>
    <wsdl:port name="ServiceSoap12" binding="tns:ServiceSoap12">
      <soap12:address location="http://10.212.8.68:9001/Service.asmx" />
    </wsdl:port>
  </wsdl:service>
```
<br/>

```
  <wsdl:service name="服务名称">
    <wsdl:port name="绑定空间" binding="tns:ServiceSoap">
      <soap:address location="服务地址" />
    </wsdl:port>
    <wsdl:port name="绑定空间" binding="tns:ServiceSoap12">
      <soap12:address location="服务地址" />
    </wsdl:port>
  </wsdl:service>
```

<br/>

# 协议内容

### <span id="tips1">1、同步服务端设备信息</span>

### GetAllState

> 平时约每20秒设备自动查询一次，执行其他操作时也会触发查询

设备发送

属性|类型|示例|说明
:--:|:--:|:--:|:--:
LockNo|string|A1|设备区域号

<br/>

服务端返回

> 建议soap12传输协议

属性|类型|示例|说明
:--:|:--:|:--:|:--:
GetAllStateResult|base64Binary|--|返回格子信息表|

<br/>

> GetAllStateResult 原始参数
>
> GetAllStateResult原始为xml格式，需经过base64编码后返回设备
>
> 示例：
>
> ```
> <boxs>
>   <box>
>     <boxNo>1</boxNo>
>     <qrcode>334509194</qrcode>
>     <boxStatus>1</boxStatus>
>   </box>
>   <box>
>     <boxNo>2</boxNo>
>     <qrcode>334509192</qrcode>
>     <boxStatus>1</boxStatus>
>   </box>
>   ……
> </boxs>
> ```
>
> 属性|类型|示例|说明
> :--:|:--:|:--:|:--:
> boxNo|int|1|格子号(应匹配设备后台设置的箱门号)
> qrcode|string|123456|绑定信息（手机号or卡号）
> boxStatus|int|0|格子状态（0-空闲 1-占用 2-锁定 3-故障）
>> 注：qrcode 为手机号时格式为 手机号 + [生肖值](#color), 如1331234123410（手机号13312341234 + 生肖值10（鸡））

</br>
</br>
</br>

### <span id="tips2">二、刷卡识别</span>

### QueryState

设备发送

属性|类型|示例|说明
:--:|:--:|:--:|:--:
CardNo|string| 123456 | 读取到的卡号
TerminalNo|string|A1|设别所在区号

<br/>

服务端返回

> 建议soap12传输协议

属性|类型|示例|说明
:--:|:--:|:--:|:--:
QueryStateResult|base64Binary|--|返回信息|

<br/>

> QueryStateResult 原始参数
>
> QueryStateResult原始为xml格式，需经过base64编码后返回设备
>
> 示例：
>
> ```
> <box>
>   <terminal>
>     <boxMsg/>
>     <boxStatus>1</boxStatus>
>   </terminal>
> </box>
> ```
>
> 属性|类型|示例|说明
> :--:|:--:|:--:|:--:
> boxMsg|--|--|提示信息
> boxStatus|int|1|返回1可用，返回4时表示卡号不在此格子，5请到其他区域存放，6余额不足，7该腕带无效

</br>
</br>
</br>

### <span id="tips3">三、查询空闲格子</span>

### downbox

设备发送

属性|类型|示例|说明
:--:|:--:|:--:|:--:
caption|int| 9 | 格子号
TerminalNo|string|A1|设别所在区号

</br>

服务端返回

属性|类型|示例|说明
:--:|:--:|:--:|:--:
downboxResult|int|1|1-可用

</br>
</br>
</br>

### <span id="tips4">四、查询手机号绑定格子</span>

### findtel

设备发送

属性|类型|示例|说明
:--:|:--:|:--:|:--:
mobile|string| 13312341234 | 手机号

</br>

服务端返回

属性|类型|示例|说明
:--:|:--:|:--:|:--:
findtelResult|string| 0 | 返回信息 0-执行下一步

> 一般返回0以进行下一步操作  
> 在执行租柜时，设备会检查本地数据排查相同手机号  
> 通过服务端检查手机号是否可用  

</br>
</br>
</br>

### <span id="tips5">五、手机号绑定格子</span>

### quertmobile

> 必须在 [findtel](#tips4) 指令返回0时才会触发

设备发送

属性|类型|示例|说明
:--:|:--:|:--:|:--:
tel|string| 13312341234 | 手机号
TerminalNo|string| A1 | 区号

</br>

服务端返回

> 服务端需检测出可用格子并返回

属性|类型|示例|说明
:--:|:--:|:--:|:--:
querymobileResult|int| 1 | 返回已绑定的格子号


### <span id="tips6">六、上交租柜数据</span>

### Savelog

> 设备等待支付回调后上传信息至服务端

设备发送

属性|类型|示例|说明
:--:|:--:|:--:|:--:
mobile|string| 13312341234 | 手机号
catpion|caption| 6 | 格子号
rmb|int|0|金额
itype|int|1|1-初始租借 2-结束租借 3-继续租借
<span id="color">color</span>|string|04|1-12对应设备上选择的十二生肖
TerminalNo|string|A1|设备区号

</br>

服务端返回

属性|类型|示例|说明
:--:|:--:|:--:|:--:
SavelogResult|int| 0 | 返回0


</br>
</br>
</br>


# 操作流程

设备联网后会定时向服务端请求数据进行同步，可以通过[同步接口](#tips1)对于设备格子的状态以及绑定情况进行设定。

### 刷卡取物

设备读取到卡号会发送[请求](#tips2)至服务端，在服务端返回正常状态同时本地数据可以匹配到卡号就会开门。

### 自助租柜

**储存**
1. 设备检查本地数据选出空闲格子，[请求](#tips3)服务端检查是否有可用
2. 用户在设备上确认电话号码，发送至服务端匹配区号进行[检查手机号](#tips4)是否可用
3. 确认手机可用，设备发送[请求服务端](#tips5)返回绑定格子，绑定的格子以服务端返回数据为准
4. 设备发起支付请求，等待支付成功回调后[上传信息](#tips6)

**开柜**
1. 用户在设备上确认电话号码，发送至服务端匹配区号进行[检查手机号](#tips4)是否可用
2. 确认手机可用，设备发送[请求服务端](#tips5)返回绑定格子
3. 用户确认生肖密码打开柜子，选择租借结束或继续后[上传信息](#tips6)


</br>
</br>
</br>

# 图片上传

在设备后台上绑定ftp的IP地址

在相应IP地址建立FTP，建议默认端口号21

设备会自动读取根目录下的三张jpg图片作为轮播图，建议尺寸800*600