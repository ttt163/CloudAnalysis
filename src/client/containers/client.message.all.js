//import "../client.css"
import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {addMassgeQuery, addMassgeData} from "../../actions/action.client"
import {Checkbox, Button, Row, Col, Input, Modal, Switch, Select, Tooltip} from 'antd';
import {addModalData} from "../../actions/action.modal"
import {
    addConfigData,
    ajaxSearch,
    ajax,
    changeCheckData,
    clearCheckData,
    editCheckData,
    checkAllData
} from "../../actions/action.config";
import {setFormFields, validateField, validateFormFields, delForm} from "../../validate/validateForm"
import ValidateItem from "../../validate/validate.item"
import {IP, MESSAGETYPE, EVENTTYPE, SENDWAYS, formatDataTime, textAreaMaxLen}  from "../../config"
const Option = Select.Option;
let messageOpt = [], eventOpt = [];
for (let [key, value] of Object.entries(MESSAGETYPE)) {
    messageOpt.push(<Option key={key}>{value}</Option>)
}
class ClientMsgAll extends Component {
    constructor(props) {
        super(props);
    }
//添加
    addMessage() {
        const {addModalData, addMassgeQuery} = this.props;
        addModalData({"addModalShow": true, "type": "add"});
        addMassgeQuery({"action": "addmodule"});
        setFormFields("messageForm", {
            "msgType": {
                "rule": {"required": true},
                "msg": {"required": "请选择消息类型！"}
            },
            "eventItem": {
                "rule": {"required": true},
                "msg": {"required": "请选择事件项！"}
            },
            "sendType": {
                "rule": {"required": true},
                "msg": {"required": "请选择消息可发送方式！"}
            },
            "remark": {
                "rule": {"maxLen": textAreaMaxLen},
                "msg": {"maxLen": `备注不能超过${textAreaMaxLen}个字符`}
            }
        });
    }
//编辑
    editMessage(data) {
        const {addModalData, addMassgeQuery} = this.props;
        addModalData({"addModalShow": true, "type": "edit"});
        addMassgeQuery({"action": "modedit","flag":"edit","id":data.id,"msgType":data.type,"eventItem":data.name,"sendType":data.send_way.split(","),"remark":data.remark});
        setFormFields("messageForm", {
            "sendType": {
                "value": !data.send_way.split(",").length?false:true,
                "rule": {"required": true},
                "msg": {"required": "请选择消息可发送方式！"}
            },
            "remark": {
                "value": data.remark,
                "rule": {"maxLen": textAreaMaxLen},
                "msg": {"maxLen": `备注不能超过${textAreaMaxLen}个字符`}
            }
        });
    }
//详情
    showInfo(data) {
        const {addModalData, addMassgeQuery} = this.props;
        addModalData({"infoModalShow": true});
        addMassgeQuery({"msgType":data.type,"eventItem":data.name,"sendType":data.send_way,"remark":data.remark,"time":data.addtime});
    }

    //保存消息发送方式
    saveMessage(form) {
        const {addModalData, ajax, query} = this.props;
        var isValidate = validateFormFields(form);
        console.log(isValidate);
        if (!isValidate) {
            return;
        }
        //提交数据
        let _data = {
            "data": {
                "type": query.msgType,
                "name": query.eventItem,
                "send_way": query.sendType.join(","),
                "remark": query.remark
            }
        };
        if(query.action=="modedit"){
            _data={..._data,"id":query.id}
        }
        ajax({"url": `${IP}/customer/infomation/${query.action}`, "sendData": _data}, true, this.searchMesage);
    }

    //加载搜索列表
    searchMesage() {
        const {ajaxSearch, addMassgeData, addConfigData} = this.props;
        addConfigData({"chkData": []});
        var _data = {
            "url": `${IP}/customer/infomation/moduleindex`, "sendData": {}
        };
        ajaxSearch(_data, addMassgeData);
    }

    getTypeByKey(typeStr, keyObj) {
        if (!typeStr) {
            return "";
        }
        var typeArr = !Array.isArray(typeStr)?typeStr.split(","):typeStr;
        var types = typeArr.map((item) => {
            return !keyObj[item] ? item : keyObj[item];
        });
        return types.join(",");
    }

    //批量禁用/启用/删除
    confirmModal() {
        const {modal, configData, addModalData} = this.props;
        var _data = [];
        configData.choseData.map((item, index) => {
            if (item.isCheck) {
                _data.push({"id": item.id, "name": item.name});
            }
        });
        this.changeStatus(_data, modal.status, function () {
            addModalData({"enableModalShow": false});
        });
    } //单条删除
    delMessage(data) {
        const {addModalData, query} = this.props;
        this.changeStatus([{"id": query.id, "name": query.name}], "delmod", function () {
            addModalData({"delModalShow": false});
        });
    }

    //禁用/启用/删除
    changeStatus(data, status, callback) {
        const {ajax} = this.props;
        var url = `${IP}/customer/infomation/${status}`, idArr = [];
        Array.isArray(data) ? idArr = data : idArr.push(data);
        /* if(!idArr.length){
         addConfigData({"btnDisable":true});
         return;
         }else{
         addConfigData({"btnDisable":false});
         }*/
        ajax({"url": url, "sendData": idArr}, true, function () {
            this.searchMesage();
            callback
        });
    }

    listIsChecked(id) {
        const {checkData} = this.props;
        var index = checkData.findIndex((obj) => {
            return obj.id == id
        });
        if (index == -1) {
            return false;
        }
        return checkData[index].isCheck;
    }

    componentDidMount() {
        this.searchMesage();
    }

    //事件项opt
    upDateEventOpt(val) {
        const {addMassgeQuery} = this.props;
        let arrEvent = EVENTTYPE[val];
        eventOpt = [];
        addMassgeQuery({"eventItem": ""});
        arrEvent.map((value) =>
            eventOpt.push(<Option key={value}>{value}</Option>)
        );
    }

    //消息发送方式
    changeSendWays(id, isChk) {
        const {addMassgeQuery, query} = this.props; //sendType
        let sendType = !query.sendType ? [] : query.sendType;
        if (!isChk) {
            //取消
            let index = sendType.indexOf(id);
            if (index != -1) {
                sendType = [
                    ...sendType.slice(0, index),
                    ...sendType.slice(index + 1)
                ]
            }
        } else {
            //选中
            sendType.push(id);
        }
        addMassgeQuery({"sendType": sendType});
    }

    updateMessage(data) {
        const {addModalData, addConfigData, checkData} = this.props;
        addModalData({...data, "enableModalShow": true});
        addConfigData({"choseData": checkData});
    }

    componentWillUnmount() {
        const {addMassgeData, clearCheckData} = this.props;
        //清除数据
        delForm("messageForm");
        addMassgeData({"list": [], "query": {}});
        clearCheckData();
    }

    render() {
        const {configData, addConfigData, addModalData, modal, validatorForm, query, addMassgeData, list, proList, accList, changeCheckData, editCheckData, checkAllData, checkData, addMassgeQuery} = this.props;
        return (
            <div>
                <div style={{"minHeight": "650px"}}>
                    <h3>消息模块管理</h3>
                    <Row className="mtb20">
                        <Col span={20}>
                            <div>
                                <Button onClick={() => this.addMessage()} className="btn-primary mr10"><i
                                    className="iconfont icon-add">添加</i></Button>
                                <Button
                                    onClick={() => !checkData.length ? "" : this.updateMessage({
                                        "modalTitle": "删除",
                                        "status": "delmod"
                                    })}
                                    className={!checkData.length ? "btn-disable mr10" : "btn-disable enable mr10"}><i
                                    className="iconfont icon-delete">删除</i></Button>
                                <Button
                                    onClick={() => !checkData.length ? "" : this.updateMessage({
                                        "modalTitle": "启用",
                                        "status": "enablemod"
                                    })}
                                    className={!checkData.length ? "btn-disable mr10" : "btn-disable enable mr10"}><i
                                    className="iconfont icon-qiyong">启用</i></Button>
                                <Button
                                    onClick={() => !checkData.length ? "" : this.updateMessage({
                                        "modalTitle": "禁用",
                                        "status": "disablemod"
                                    })}
                                    className={!checkData.length ? "btn-disable" : "btn-disable enable "}><i
                                    className="iconfont icon-disable">禁用</i></Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1} className="text-center"><Checkbox
                            checked={!list.length || list.length != checkData.length ? false : true}
                            onChange={(e) => checkAllData({"isCheck": e.target.checked}, list)}
                        /></Col>
                        <Col span={9}>事件项</Col>
                        <Col span={3}><span className="left-line">消息可发送方式</span></Col>
                        <Col span={2}><span className="left-line">禁用/启用</span></Col>
                        <Col span={4}><span className="left-line">创建时间</span></Col>
                        <Col span={4}><span className="left-line">操作</span></Col>
                    </Row>
                    {
                        !list.length ?
                            <div className="no-data">
                                暂无相关记录!
                            </div>
                            :
                            <div>
                                <div className="ant-table-body">
                                    <table className={!configData.showCase ? "table mb30" : "table"}>
                                        <thead className="ant-table-thead">
                                        <tr>
                                            <th className="text-left" colSpan={6}>账户消息</th>
                                            <th className="text-center"
                                                style={{"border": "1px solid #d0d5de", "width": "4.16%"}}>
                                                <i onClick={() => addConfigData({"showCase": !configData.showCase})}
                                                   className={!configData.showCase ? "iconfont icon-shouqi-down pointer" : "iconfont icon-shouqi-up pointer"}></i>
                                            </th>
                                        </tr>
                                        </thead>
                                        {
                                            !configData.showCase ?
                                                <tbody className="ant-table-tbody"></tbody>
                                                :
                                                <tbody className="ant-table-tbody">
                                                {
                                                    !accList.length ?
                                                        <tr className="ant-table-row  ant-table-row-level-0">
                                                            <td colSpan={6} className="ant-table-selection-column">
                                                                <div className="no-data">
                                                                    暂无账户消息相关记录!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        :
                                                        accList.map((item, index) =>
                                                            <tr key={index}
                                                                className="ant-table-row  ant-table-row-level-0">
                                                                <td style={{"width": "4.16%"}}
                                                                    className="ant-table-selection-column">
                                                                    <Checkbox checked={this.listIsChecked(item.id)}
                                                                              onChange={(e) => changeCheckData({
                                                                                  "id": item.id,
                                                                                  "name": item.name,
                                                                                  "isCheck": e.target.checked
                                                                              })}/>
                                                                </td>
                                                                <td style={{"width": "37.5%"}}>
                                                                    {item.name}
                                                                </td>
                                                                <td style={{"width": "12.5%"}}>
                                                                    {this.getTypeByKey(item.send_way, SENDWAYS)}
                                                                </td>
                                                                <td style={{"width": "8.33%"}}>
                                                                    <Tooltip title={!item.status ? "禁用" : "启用"}>
                                                                        <Switch checked={!item.status ? false : true}
                                                                                onChange={(checked) => this.changeStatus([{
                                                                                    "id": item.id,
                                                                                    "name": item.name
                                                                                }], !checked ? "disablemod" : "enablemod")}
                                                                        />
                                                                    </Tooltip>
                                                                </td>
                                                                <td style={{"width": "16.67%"}}>
                                                                    {!parseInt(item.addtime) ? "" : formatDataTime(item.addtime)}
                                                                </td>
                                                                <td colSpan={2} style={{"width": "20.83%"}}>
                                                                    <a onClick={() => this.showInfo(item)}
                                                                       className="mr10"
                                                                       href="javascript:void(0)">详情</a>
                                                                    <a onClick={() => this.editMessage(item)}
                                                                       className="mr10"
                                                                       href="javascript:void(0)">编辑</a>
                                                                    <a onClick={() => {
                                                                        addModalData({"delModalShow": true});
                                                                        addMassgeQuery({
                                                                            "id": item.id,
                                                                            "name": item.name
                                                                        })
                                                                    }}
                                                                       className="mr10"
                                                                       href="javascript:void(0)">删除</a>
                                                                </td>
                                                            </tr>
                                                        )

                                                }

                                                {/* <tr className="ant-table-row  ant-table-row-level-0">
                                                 <td style={{"width": "4.16%"}}
                                                 className="ant-table-selection-column">
                                                 <Checkbox /></td>
                                                 <td style={{"width": "37.5%"}}>账号登录通知</td>
                                                 <td style={{"width": "12.5%"}}>站内信，邮件</td>
                                                 <td style={{"width": "8.33%"}}><Switch defaultChecked={false}/></td>
                                                 <td style={{"width": "16.67%"}}>2017-01-10 13:45:43</td>
                                                 <td colSpan={2} style={{"width": "20.83%"}}>
                                                 <a className="mr10" href="javascript:void(0)">详情</a>
                                                 <a className="mr10" href="javascript:void(0)">编辑</a>
                                                 <a className="mr10" href="javascript:void(0)">删除</a>
                                                 </td>
                                                 </tr>
                                                 <tr className="ant-table-row  ant-table-row-level-0">
                                                 <td style={{"width": "4.16%"}}
                                                 className="ant-table-selection-column">
                                                 <Checkbox /></td>
                                                 <td style={{"width": "37.5%"}}>账号登录通知</td>
                                                 <td style={{"width": "12.5%"}}>站内信，邮件</td>
                                                 <td style={{"width": "8.33%"}}><Switch defaultChecked={false}/></td>
                                                 <td style={{"width": "16.67%"}}>2017-01-10 13:45:43</td>
                                                 <td colSpan={2} style={{"width": "20.83%"}}>
                                                 <a className="mr10" href="javascript:void(0)">详情</a>
                                                 <a className="mr10" href="javascript:void(0)">编辑</a>
                                                 <a className="mr10" href="javascript:void(0)">删除</a>
                                                 </td>
                                                 </tr>*/}
                                                </tbody>
                                        }
                                    </table>
                                </div>
                                <div className="ant-table-body">
                                    <table className="table">
                                        <thead className="ant-table-thead">
                                        <tr>
                                            <th className="text-left" colSpan={6}>产品消息</th>
                                            <th className="text-center"
                                                style={{"border": "1px solid #d0d5de", "width": "4.16%"}}><i
                                                onClick={() => addConfigData({"showProd": !configData.showProd})}
                                                className={!configData.showProd ? "iconfont icon-shouqi-down pointer" : "iconfont icon-shouqi-up pointer"}></i>
                                            </th>
                                        </tr>
                                        </thead>
                                        {
                                            !configData.showProd ?
                                                <tbody className="ant-table-tbody"></tbody>
                                                :
                                                <tbody className="ant-table-tbody">
                                                {
                                                    !proList.length ?
                                                        <tr className="ant-table-row  ant-table-row-level-0">
                                                            <td colSpan={6} className="ant-table-selection-column">
                                                                <div className="no-data">
                                                                    暂无产品消息相关记录!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        :
                                                        proList.map((item, index) =>
                                                            <tr key={index}
                                                                className="ant-table-row  ant-table-row-level-0">
                                                                <td style={{"width": "4.16%"}}
                                                                    className="ant-table-selection-column">
                                                                    <Checkbox checked={this.listIsChecked(item.id)}
                                                                              onChange={(e) => changeCheckData({
                                                                                  "id": item.id,
                                                                                  "name": item.name,
                                                                                  "isCheck": e.target.checked
                                                                              })}/>
                                                                </td>
                                                                <td style={{"width": "37.5%"}}>
                                                                    {item.name}
                                                                </td>
                                                                <td style={{"width": "12.5%"}}>
                                                                    {this.getTypeByKey(item.send_way, SENDWAYS)}
                                                                </td>
                                                                <td style={{"width": "8.33%"}}>
                                                                    <Tooltip title={!item.status ? "禁用" : "启用"}>
                                                                        <Switch checked={!item.status ? false : true}
                                                                                onChange={(checked) => this.changeStatus([{
                                                                                    "id": item.id,
                                                                                    "name": item.name
                                                                                }], !checked ? "disablemod" : "enablemod")}
                                                                        />
                                                                    </Tooltip>
                                                                </td>
                                                                <td style={{"width": "16.67%"}}>
                                                                    {!parseInt(item.addtime) ? "" : formatDataTime(item.addtime)}
                                                                </td>
                                                                <td colSpan={2} style={{"width": "20.83%"}}>
                                                                    <a onClick={() => this.showInfo(item)}
                                                                       className="mr10"
                                                                       href="javascript:void(0)">详情</a>
                                                                    <a onClick={() => this.editMessage(item)}
                                                                       className="mr10"
                                                                       href="javascript:void(0)">编辑</a>
                                                                    <a onClick={() => {
                                                                        addModalData({"delModalShow": true});
                                                                        addMassgeQuery({
                                                                            "id": item.id,
                                                                            "name": item.name
                                                                        })
                                                                    }}
                                                                       className="mr10"
                                                                       href="javascript:void(0)">删除</a>
                                                                </td>
                                                            </tr>
                                                        )
                                                }
                                                {/*<tr className="ant-table-row  ant-table-row-level-0">
                                                 <td style={{"width": "4.16%"}}
                                                 className="ant-table-selection-column">
                                                 <Checkbox /></td>
                                                 <td style={{"width": "37.5%"}}>域名被冻结，不能正常解析/域名解冻，恢复正常解析。</td>
                                                 <td style={{"width": "12.5%"}}>站内信，邮件</td>
                                                 <td style={{"width": "8.33%"}}><Switch defaultChecked={false}/></td>
                                                 <td style={{"width": "16.67%"}}>2017-01-10 13:45:43</td>
                                                 <td colSpan={2} style={{"width": "20.83%"}}>
                                                 <a className="mr10" href="javascript:void(0)">详情</a>
                                                 <a className="mr10" href="javascript:void(0)">编辑</a>
                                                 <a className="mr10" href="javascript:void(0)">删除</a>
                                                 </td>
                                                 </tr>
                                                 <tr className="ant-table-row  ant-table-row-level-0">
                                                 <td style={{"width": "4.16%"}}
                                                 className="ant-table-selection-column">
                                                 <Checkbox /></td>
                                                 <td style={{"width": "37.5%"}}>域名被冻结，不能正常解析/域名解冻，恢复正常解析。</td>
                                                 <td style={{"width": "12.5%"}}>站内信，邮件</td>
                                                 <td style={{"width": "8.33%"}}><Switch defaultChecked={false}/></td>
                                                 <td style={{"width": "16.67%"}}>2017-01-10 13:45:43</td>
                                                 <td colSpan={2} style={{"width": "20.83%"}}>
                                                 <a className="mr10" href="javascript:void(0)">详情</a>
                                                 <a className="mr10" href="javascript:void(0)">编辑</a>
                                                 <a className="mr10" href="javascript:void(0)">删除</a>
                                                 </td>
                                                 </tr>
                                                 <tr className="ant-table-row  ant-table-row-level-0">
                                                 <td style={{"width": "4.16%"}}
                                                 className="ant-table-selection-column">
                                                 <Checkbox /></td>
                                                 <td style={{"width": "37.5%"}}>域名被冻结，不能正常解析/域名解冻，恢复正常解析。</td>
                                                 <td style={{"width": "12.5%"}}>站内信，邮件</td>
                                                 <td style={{"width": "8.33%"}}><Switch defaultChecked={false}/></td>
                                                 <td style={{"width": "16.67%"}}>2017-01-10 13:45:43</td>
                                                 <td colSpan={2} style={{"width": "20.83%"}}>
                                                 <a className="mr10" href="javascript:void(0)">详情</a>
                                                 <a className="mr10" href="javascript:void(0)">编辑</a>
                                                 <a className="mr10" href="javascript:void(0)">删除</a>
                                                 </td>
                                                 </tr>*/}
                                                </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                    }


                </div>
                {/*单个删除*/}
                <Modal title="提示"
                       footer={
                           <Row>
                               <Col span={24}>
                                   <Button onClick={() => this.delMessage()} className="btn-primary">确定</Button>
                                   <Button onClick={() => {
                                       addModalData({"delModalShow": false});
                                       addMassgeData({"query": {}});
                                   }}
                                           className="btn-disable  enable">取消</Button>
                               </Col>
                           </Row>}
                       onCancel={()=>{
                           addModalData({"delModalShow": false});
                           addMassgeData({"query": {}});
                       }}
                       visible={!modal.delModalShow ? false : true} className="enable-modal">
                    <div className="modal-cont">
                        <div className="modal-tip-cont">确定删除此事件项?</div>
                    </div>
                </Modal>
                {/*禁用/启用/删除*/}
                <Modal title="提示"
                       footer={
                           <Row>
                               <Col span={24}>
                                   <Button onClick={() => !configData.btnDisable ? this.confirmModal() : ""}
                                           className={!configData.btnDisable ? "btn-primary" : "btn-disable"}>确定</Button>
                                   <Button onClick={() => {
                                       addModalData({"enableModalShow": false});
                                       addConfigData({"choseData": []});
                                   }}
                                           className="btn-disable  enable">取消</Button>
                               </Col>
                           </Row>}
                       onCancel={()=>{
                           addModalData({"enableModalShow": false});
                           addConfigData({"choseData": []});
                       }}
                       visible={!modal.enableModalShow ? false : true} className="enable-modal">
                    <div className="modal-cont">
                        <div className="body-title">确定{!modal.modalTitle ? "" : modal.modalTitle}如下已选中事件项：</div>
                        <div className="body-cont">
                            <Row>
                                {
                                    !configData.choseData ? "" :
                                        configData.choseData.map((item, index) =>
                                            <Col key={index} span={8}>
                                                <Checkbox title={item.name} className="text-over" checked={item.isCheck}
                                                          onChange={(e) => editCheckData({
                                                              "isCheck": e.target.checked,
                                                              "id": item.id
                                                          })}
                                                >{item.name}</Checkbox></Col>
                                        )
                                }
                            </Row>
                        </div>
                    </div>
                </Modal>
                {/*添加/编辑*/}
                <Modal title={modal.type == "edit" ? "编辑消息模块" : "添加消息模块"}
                       footer={
                           <Row>
                               <Col span={24}>
                                   <Button onClick={() => this.saveMessage("messageForm")}
                                           className="btn-primary">确定</Button>
                                   <Button onClick={() => {
                                       addModalData({"addModalShow": false});
                                       addMassgeData({"query": {}});
                                       delForm("messageForm")
                                   }} className="btn-disable  enable">取消</Button>
                               </Col>
                           </Row>}
                       onCancel={()=>{
                           addModalData({"addModalShow": false});
                           addMassgeData({"query": {}});
                           delForm("messageForm")
                       }}
                       visible={!modal.addModalShow ? false : true} className="enable-modal">
                    <div className="modal-cont">
                        <Row>
                            <Col className="text-right" span={6}>消息类型：</Col>
                            <Col span={10}>
                                {modal.type == "add" ?
                                    <ValidateItem validatorForm={validatorForm} thisForm="messageForm" field="msgType">
                                        <Select style={{"width": "100%"}}
                                                value={!query.msgType ? "" : query.msgType}
                                                onChange={(val) => {
                                                    validateField("messageForm", "msgType", val, addMassgeQuery({"msgType": val}));
                                                    this.upDateEventOpt(val)
                                                }}>
                                            <Option value="">-------</Option>
                                            {messageOpt}
                                        </Select>
                                    </ValidateItem>
                                    : !query.msgType ? "" : !MESSAGETYPE[query.msgType]?query.msgType:MESSAGETYPE[query.msgType]}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>事件项：</Col>
                            <Col span={17}>
                                {modal.type == "add" ?
                                    <ValidateItem validatorForm={validatorForm} thisForm="messageForm"
                                                  field="eventItem">
                                        <Select style={{"width": "100%"}}
                                                value={!query.eventItem ? "" : query.eventItem}
                                                onChange={(val) => {
                                                    validateField("messageForm", "eventItem", val, addMassgeQuery({"eventItem": val}))
                                                }}>
                                            <Option value="">-------</Option>
                                            {eventOpt}
                                        </Select>
                                    </ValidateItem>
                                    : !query.eventItem ? "" : query.eventItem}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>消息可发送方式：</Col>
                            <Col span={17}>
                                <ValidateItem validatorForm={validatorForm} thisForm="messageForm" field="sendType">
                                    {Object.keys(SENDWAYS).map((item, index) =>
                                        <Checkbox key={item}
                                                  checked={!query.sendType || query.sendType.indexOf(item) == -1 ? false : true}
                                                  onChange={(e) => {
                                                      validateField("messageForm", "sendType", e.target.checked || query.sendType.length > 1 ? true : false, this.changeSendWays(item, e.target.checked))
                                                  }}>{SENDWAYS[item]}</Checkbox>
                                    )}

                                    {/* <Checkbox checked={!query.emailWays ? false : true} value="2"
                                     onChange={(e) => {
                                     validateField("messageForm", "sendType", e.target.checked || query.letterWays, addMassgeQuery({"emailWays": e.target.checked}))
                                     }}>邮件</Checkbox>*/}
                                </ValidateItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>备注：</Col>
                            <Col span={17}>
                                <ValidateItem validatorForm={validatorForm} thisForm="messageForm" field="remark">
                                    <Input type="textarea" rows="6" value={!query.remark ? "" : query.remark}
                                           onChange={(e) => {
                                               validateField("messageForm", "remark", e.target.value, addMassgeQuery({"remark": e.target.value}))
                                           }}/>
                                </ValidateItem>
                            </Col>
                        </Row>
                    </div>
                </Modal>
                {/*详情*/}
                <Modal title="详情"
                       footer={
                           <Row>
                               <Col span={24}>
                                   <Button onClick={() => {addModalData({"infoModalShow": false});addMassgeData({"query": {}});}} className="btn-primary">确定</Button>
                                   <Button onClick={() => {addModalData({"infoModalShow": false});addMassgeData({"query": {}});}}
                                           className="btn-disable  enable">取消</Button>
                               </Col>
                           </Row>}
                       onCancel={()=>{
                           addModalData({"infoModalShow": false});addMassgeData({"query": {}});
                       }}
                       visible={!modal.infoModalShow ? false : true} className="enable-modal">
                    <div className="modal-cont">
                        <Row>
                            <Col className="text-right" span={6}>消息类型：</Col>
                            <Col span={17}>{!query.msgType ? "" : !MESSAGETYPE[query.msgType]?query.msgType:MESSAGETYPE[query.msgType]}</Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>事件项：</Col>
                            <Col span={17}>{!query.eventItem ? "" : query.eventItem}</Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>消息可发送方式：</Col>
                            <Col span={17}>{!query.sendType ? "" : this.getTypeByKey(query.sendType, SENDWAYS)}</Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>备注：</Col>
                            <Col span={17}>{!query.remark ? "" : query.remark}</Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>创建时间：</Col>
                            <Col span={17}>{!parseInt(query.time) ? "" : formatDataTime(query.time)}</Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {
        "list": state.client.messageData.list,
        "accList": state.client.messageData.list.filter((item) => {
            return item.type == "1"
        }),
        "proList": state.client.messageData.list.filter((item) => {
            return item.type == "2"
        }),
        "query": state.client.messageData.query,
        "modal": state.configData.modal,
        "configData": state.configData.data,
        "pageInfo": state.configData.pageData,
        "checkData": state.configData.data.chkData,
        "validatorForm": state.validatorForm
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addMassgeData: (...args) => dispatch(addMassgeData(...args)),
        addMassgeQuery: (...args) => dispatch(addMassgeQuery(...args)),
        addConfigData: (...args) => dispatch(addConfigData(...args)),
        addModalData: (...args) => dispatch(addModalData(...args)),
        changeCheckData: (...args) => dispatch(changeCheckData(...args)),
        editCheckData: (...args) => dispatch(editCheckData(...args)),
        clearCheckData: (...args) => dispatch(clearCheckData(...args)),
        checkAllData: (...args) => dispatch(checkAllData(...args)),
        ajax: (...args) => dispatch(ajax(...args)),
        ajaxSearch: (...args) => dispatch(ajaxSearch(...args))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientMsgAll)