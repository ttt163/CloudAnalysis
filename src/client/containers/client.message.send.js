//import "../client.css"
import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {addMassgeQuery, addMassgeData} from "../../actions/action.client"
import {Checkbox, Button, Row, Col, Input, Switch, Modal, Select, Tooltip,message} from 'antd';
import {addModalData} from "../../actions/action.modal";
import {setFormFields, validateField, validateFormFields, delForm} from "../../validate/validateForm"
import ValidateItem from "../../validate/validate.item"
import {textAreaMaxLen,IP,SENDWAYS}  from "../../config"
import {
    addConfigData,
    ajaxSearch,
    ajax,
    changeCheckData,
    clearCheckData,
    editCheckData,
    checkAllData
} from "../../actions/action.config";
const Option = Select.Option;
let typeOpt=[];
class ClientMsgSend extends Component {
    constructor(props) {
        super(props);
    }

    addSendType() {
        const {addModalData,list} = this.props;
        addModalData({"addMsgShow": true});
        typeOpt=[];
        for(let [key,value] of Object.entries(SENDWAYS)){
            let _index=list.findIndex(function(item) {
                return item.type == key;
            });
            if(_index==-1) {
                typeOpt.push(<Option key={key}>{value}</Option>);
            }else{
                typeOpt.push(<Option disabled key={key}>{value}</Option>);
            }
        }
        setFormFields("sendTypeform", {
            "massageType": {
                "rule": {"required": true},
                "msg": {"required": "请选择消息发送方式！"}
            }
        });
    }

    //保存消息发送方式
    saveSendType(form) {
        const {query,ajax}=this.props;
        var isValidate=validateField(form, "massageType", query.massageType);
        console.log(isValidate);
        if (!isValidate) {
            return;
        }
        //提交数据
        let _data = {
            "url": `${IP}/customer/infomation/addsendway`, "sendData": {
                "type":query.massageType,
                "name":SENDWAYS[query.massageType]
            }
        };
        ajax(_data,true, function(){
            this.searchSend();
            addModalData({"addMsgShow": false});
        });
    }

    //备注
    addRemark(data) {
        const {addModalData,addMassgeQuery,query} = this.props;
        addMassgeQuery({...data});
        addModalData({"remkModalShow": true});
        setFormFields("sendTypeform", {
            "remark": {
                "value":query.remark,
                "rule": {"maxLen": textAreaMaxLen},
                "msg": {"maxLen": `不能超过${textAreaMaxLen}个字符`}
            }
        });
    }
    saveRemark(form) {
        const {query,ajax}=this.props;
       // var isValitete = validateFormFields(form);
        let isValidate=validateField(form, "remark", query.remark);
        console.log(isValidate);
        if (!isValidate) {
            return;
        }
        //提交数据
       let _data = {
            "url": `${IP}/customer/infomation/addremark`, "sendData": {
               "id":query.id,
               "name":query.name,
                "note":query.remark
           }
        };
        ajax(_data,true, this.searchSend);
    }
    //删除
    delSendWay(type,data){
        const {addModalData,addMassgeQuery}=this.props;
        addModalData({"delModalShow": true});
        type=="single"?addMassgeQuery({...data,"_type":type}):addMassgeQuery({"_type":type});
    }
    //确定删除
    confirmDel() {
        const {addModalData,checkData,query} = this.props;
        let _data = [];
        if(query._type!="single"){
            checkData.map((item, index) => {
                if (item.isCheck) {
                    _data.push({"id": item.id, "name": item.name});
                }
            });
        }else{
            _data.push({"id": query.id, "name": query.name});
        }
        this.changeStatus(_data, "delsendway", function () {
            addModalData({"delModalShow": false});
        });
    }

    //禁用/启用/删除
    changeStatus(data, status, callback) {
        const {ajax} = this.props;
        var url = `${IP}/customer/infomation/${status}`, idArr = [];
        Array.isArray(data) ? idArr = data : idArr.push(data);
        ajax({"url": url, "sendData": idArr}, true, function () {
            this.searchSend();
            callback()
        });
    }
    //加载搜索列表
    searchSend() {
        const {ajaxSearch, addMassgeData, addConfigData} = this.props;
        addConfigData({"chkData": []});
        var _data = {
            "url": `${IP}/customer/infomation/sendwayindex`, "sendData": {}
        };
        ajaxSearch(_data, addMassgeData);
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
        this.searchSend();
    }
    componentWillUnmount() {
        const {addModalData, addMassgeData} = this.props;
        //清除数据
        delForm("sendTypeform");
        addModalData({"addMsgShow": false});
        addMassgeData({"list": [], "query": {}})
    }
    render() {
        const {addModalData, modal, validatorForm, addMassgeQuery, query,list,checkData,changeCheckData, editCheckData, checkAllData} = this.props;
        return (
            <div>
                <div style={{"minHeight": "650px"}}>
                    <h3>消息发送方式管理</h3>
                    <Row className="mtb20">
                        <Col span={20}>
                            <div>
                                <Button className="btn-primary mr10" onClick={() => this.addSendType()}><i
                                    className="iconfont icon-add">添加</i></Button>
                                <Button
                                    onClick={() => !checkData.length ? "" : this.delSendWay("mutil")}
                                    className={!checkData.length ? "btn-disable mr10" : "btn-disable enable mr10"}><i
                                    className="iconfont icon-delete">删除</i></Button>
                            </div>
                        </Col>
                    </Row>
                    <div className="ant-table-body">
                        <table className="table">
                            <thead className="ant-table-thead">
                            <tr>
                                <th className="ant-table-selection-column">
                                    <Checkbox  checked={!list.length || list.length != checkData.length ? false : true}
                                               onChange={(e) => checkAllData({"isCheck": e.target.checked}, list)}
                                    />
                                </th>
                                <th>消息发送方式</th>
                                <th><span>禁用/启用</span></th>
                                <th><span>操作</span></th>
                            </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                            {!list.length?
                                <tr className="ant-table-row  ant-table-row-level-0">
                                    <td colSpan={4}>
                                        <div className="no-data">消息发送方式记录！</div>
                                    </td>
                                </tr>
                                :
                                list.map((item,index)=>
                                    <tr key={index} className="ant-table-row  ant-table-row-level-0">
                                        <td className="ant-table-selection-column">
                                            <Checkbox  checked={this.listIsChecked(item.id)}
                                                       onChange={(e) => changeCheckData({
                                                           "id": item.id,
                                                           "name": item.name,
                                                           "isCheck": e.target.checked
                                                       })}/>
                                        </td>
                                        <td>{!item.type?"":!SENDWAYS[item.type]?item.type:SENDWAYS[item.type]}</td>
                                        <td>
                                            <Tooltip title={!item.status?"禁用":"启用"}>
                                                <Switch checked={!item.status ? false : true}
                                                        onChange={(checked) => this.changeStatus([{
                                                            "id": item.id,
                                                            "name": item.name
                                                        }], !checked ? "disablesendway" : "enablesendway")}
                                                />
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <a className="mr10" href="javascript:void(0)"
                                               onClick={() =>this.delSendWay("single",{"id": item.id,"name": item.name})}>删除</a>
                                            <a href="javascript:void(0)"
                                               onClick={() => this.addRemark({"id": item.id,"name": item.name,"remark": item.remark})}>备注</a>
                                        </td>
                                    </tr>
                                )
                            }

                           {/* <tr className="ant-table-row  ant-table-row-level-0">
                                <td className="ant-table-selection-column"><Checkbox  /></td>
                                <td>站内信</td>
                                <td><Switch /></td>
                                <td>
                                    <a className="mr10" href="javascript:void(0)">删除</a>
                                    <a href="javascript:void(0)">备注</a>
                                </td>
                            </tr>
                            <tr className="ant-table-row  ant-table-row-level-0">
                                <td className="ant-table-selection-column"><Checkbox  /></td>
                                <td>邮件</td>
                                <td><Switch /></td>
                                <td>
                                    <a className="mr10" href="javascript:void(0)">删除</a>
                                    <a href="javascript:void(0)">备注</a>
                                </td>
                            </tr>*/}
                            </tbody>
                        </table>
                        {/*添加*/}
                        <div style={{
                            "borderBottom": "1px solid #e9e9e9",
                            "paddingTop": "10px",
                            "display": !modal.addMsgShow ? "none" : "block"
                        }}>
                            <Row>
                                <Col offset={1} span={7}>
                                    <ValidateItem validatorForm={validatorForm} thisForm="sendTypeform" field="massageType">
                                        <Select style={{"width": "100%"}}
                                                value={!query.massageType ? "" : query.massageType} onChange={(val) => {
                                            validateField("sendTypeform", "massageType", val, addMassgeQuery({"massageType": val}))
                                        }}>
                                            <Option value="">-------</Option>
                                            {typeOpt}
                                        </Select>
                                    </ValidateItem>

                                </Col>
                                <Col span={10} offset={1}>
                                    <Button onClick={() => this.saveSendType("sendTypeform")}
                                            className="btn-primary mr10">保存</Button>
                                    <Button onClick={() => {
                                        addModalData({"addMsgShow": false})
                                    }}
                                            className="btn-disable  enable">取消</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                {/*删除*/}
                <Modal title="提示"
                       footer={
                           <Row>
                               <Col span={24}>
                                   <Button onClick={()=>this.confirmDel()} className="btn-primary">确定</Button>
                                   <Button onClick={()=>{addModalData({"delModalShow":false});
                                   }} className="btn-disable  enable">取消</Button>
                               </Col>
                           </Row>}
                       onCancel={()=>{addModalData({"delModalShow":false});}}
                       visible={!modal.delModalShow ? false : true} className="enable-modal">
                    <div className="modal-cont">
                        <div className="modal-tip-cont">确定删除此消息发送方式?</div>
                    </div>
                </Modal>
                {/*备注*/}
                <Modal title="站内信"
                       footer={
                           <Row>
                               <Col span={24}>
                                   <Button onClick={()=>this.saveRemark("sendTypeform")} className="btn-primary">确定</Button>
                                   <Button onClick={()=>addModalData({"remkModalShow":false})} className="btn-disable  enable">取消</Button>
                               </Col>
                           </Row>}
                       onCancel={()=>{addModalData({"remkModalShow":false})}}
                       visible={!modal.remkModalShow ? false : true} className="enable-modal">
                    <div className="modal-cont">
                        <Row>
                            <Col className="text-right" span={4}>备注</Col>
                            <Col span={20}>
                                <ValidateItem validatorForm={validatorForm} thisForm="sendTypeform" field="remark">
                                    <Input type="textarea" rows="6" value={!query.remark ? "" : query.remark}
                                           onChange={(e) => {
                                               validateField("sendTypeform", "remark", e.target.value, addMassgeQuery({"remark": e.target.value}))
                                           }}/>
                                </ValidateItem>
                            </Col>
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
        "messageData": state.client.messageData,
        "query": state.client.messageData.query,
        "list": state.client.messageData.list,
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
export default connect(mapStateToProps, mapDispatchToProps)(ClientMsgSend)