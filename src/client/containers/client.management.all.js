//import "../client.css"
import {CLIENTTYPE,CHECKSTUTUS,IP,PRODUCTTYPE,formatDataTime,emailOrPhoneReg} from "../../config"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import {Link} from "react-router"
import { Checkbox,Button ,Row, Col,Input, Icon,Switch,Modal,Select,Tooltip,message } from 'antd';
import Footer from "../component/footer.pagination.js";
import {addModalData} from "../../actions/action.modal"
import {addConfigData,changeCheckData,clearCheckData,ajaxSearch,ajax,editCheckData,checkAllData} from "../../actions/action.config";
import {addClientQuery,clearClientQuery,addClientData} from "../../actions/action.client"
import {setFormFields, validateField, validateFormFields, delForm} from "../../validate/validateForm"
import ValidateItem from "../../validate/validate.item"
const Option=Select.Option;
var clientOpt=[],statusOpt=[],productOpt=[];
for (let [key,value] of Object.entries(CLIENTTYPE)){
    clientOpt.push(<Option key={key}>{value}</Option>);
}
for (let [key,value] of Object.entries(CHECKSTUTUS)){
    statusOpt.push(<Option key={key}>{value}</Option>);
}
for (let [key,value] of Object.entries(PRODUCTTYPE)){
    productOpt.push(<Option key={key}>{value}</Option>);
}
/*for(var i=0;i<CLIENTTYPE.length;i++) {
    clientOpt.push(<Option key={CLIENTTYPE[i].value}>{CLIENTTYPE[i].name}</Option>);
}*/
/*for(var i=0;i<CHECKSTUTUS.length;i++) {
    statusOpt.push(<Option key={CHECKSTUTUS[i].value}>{CHECKSTUTUS[i].name}</Option>);
}*/
class ClientMangAll extends Component {
    constructor(props) {
        super(props);
    }
    changeQueryData(data){
        const {addQuery}=this.props;
        addQuery({...data});
    }
    search(pageObj){
        const {query,ajaxSearch,addData,pageData,addConfigData}=this.props;
        addConfigData({"chkData":[]});
        var sendQuery={};
        for(let [key,value] of Object.entries(query)){
            if(value!=""){
                sendQuery={...sendQuery,[key]:value};
            }
        }
        var pageObj=!pageObj?{}:pageObj;
        var _data={"url":`${IP}/customer/index/customerAll`,"sendData":{
            "page":pageData.currPage,
            "perpage":pageData.pageSize,
            "query":{...sendQuery},
            ...pageObj
        }};
        ajaxSearch(_data,addData);
       /* "query":{
            "cus_type":!query.cus_type?"":query.cus_type,
                "name":!query.name?"":query.name,
                "account":!query.account?"":query.account,
                "acc_status":!query.acc_status?"":query.acc_status,
                "product":!query.product?"":query.product
        }*/
    }
    isEnableUser(data){
        const {addModalData,addConfigData,checkData}=this.props;
        addModalData({...data,"enableModalShow":true});
        addConfigData({"choseData":checkData});
    }
    confirmModal(){
        const {modal,configData}=this.props;
        var _data=[];
        configData.choseData.map((item,index)=>{
            if(item.isCheck){
                _data.push({"id":item.id,"name":item.name});
            }
        });
        this.changeStatus(_data,modal.status);
    }
    //禁用/启用
    changeStatus(data,status){
        //status,disable;禁用，enable:启用
        const {ajax,addConfigData}=this.props;
        var url=`${IP}/customer/index/${status}`,idArr=[];
        Array.isArray(data)?idArr=data:idArr.push(data);
       /* if(!idArr.length){
            addConfigData({"btnDisable":true});
            return;
        }else{
            addConfigData({"btnDisable":false});
        }*/
        ajax({"url":url,"sendData":idArr},true,this.search);
    }
    listIsChecked(id){
        const {checkData}=this.props;
        var index=checkData.findIndex((obj)=>{return obj.id==id});
        if(index==-1){
            return false;
        }
        return checkData[index].isCheck;
    }
    prodoctType(typeStr){
        if(!typeStr){
            return "";
        }
        var typeArr=typeStr.split(",");
        var product=typeArr.map((item)=>{
           return  PRODUCTTYPE[item];
        });
        return product.join(",");
    }
    subSearch(){
        const {addFilterData} = this.props;
        var isValidate = validateFormFields("clientForm");
        if (!isValidate) {
            return;
        }
        this.search();
        addFilterData({"filterShow":false})
    }
    componentDidMount() {
        this.search();
        setFormFields("clientForm", {
            "name": {
                "rule": {"maxLen": 50},
                "msg": {"maxLen": "不能超过50个字符！"}
            },
            "account": {
                "rule": {"maxLen": 200},
                "msg": {"maxLen":"不能超过200个字符"}
            }
        });
    }
    componentWillUnmount() {
        //清空数据
        const {addFilterData,clearCheckData,clearQuery,addData}=this.props;
        addFilterData({"filterShow":false});
        clearCheckData();
        clearQuery();
        addData({"data":{},"list":[]});
        delForm("clientForm");
    }
    render() {
        const {modal,addModalData,location,configData,addFilterData,changeCheckData,checkData,clearQuery,list,query,pageData,editCheckData,addConfigData,checkAllData,validatorForm}=this.props;
        return (
            <div>
                <div style={{"minHeight": "650px"}}>
                    <h3 style={{"display":"inline-block"}}>客户列表</h3><span>（共{pageData.total}个）</span>
                    <Row className="mtb20">
                        <Col span={24}>
                            <div style={{"position":"relative"}}>
                                <Button className={!checkData.length?"btn-disable mr10":"btn-disable active mr10"}
                                        onClick={()=>!checkData.length?"":this.isEnableUser({"modalTitle":"启用","status":"enable"})}>
                                    <i className="iconfont icon-qiyong">启用</i>
                                </Button>
                                <Button className={!checkData.length?"btn-disable mr10":"btn-disable enable mr10"}
                                        onClick={()=>!checkData.length?"":this.isEnableUser({"modalTitle":"禁用","status":"disable"})}>
                                    <i className="iconfont icon-disable">禁用</i>
                                </Button>
                                <Button className={!configData.filterShow?"filter-btn":"filter-btn active"} onClick={()=>addFilterData({"filterShow":!configData.filterShow})}><i className={!configData.filterShow?"iconfont icon-down":"iconfont icon-up"}>筛选</i></Button>
                                <div className="log-filter-cont filter-cont" style={{"display":!configData.filterShow?"none":"block","top": "32px"}}>
                                    <Row>
                                        <Col className="text-right" span={2}>客户类型</Col>
                                        <Col span={5}>
                                            <Select value={!query.cus_type?"":query.cus_type}
                                                    onChange={(val)=>this.changeQueryData({"cus_type":val})}
                                                    style={{ width: "100%" }}>
                                                <Option value="">-----</Option>
                                                {clientOpt}
                                            </Select>
                                        </Col>
                                        <Col className="text-right" span={2}>名称</Col>
                                        <Col span={5}>
                                            <ValidateItem validatorForm={validatorForm} thisForm="clientForm" field="name">
                                                <Input  value={!query.name?"":query.name}
                                                       onChange={(e) => {
                                                           validateField("clientForm", "name", e.target.value, this.changeQueryData({"name": e.target.value}))
                                                       }}/>
                                            </ValidateItem>
                                        </Col>
                                        <Col className="text-right" span={2}>账户</Col>
                                        <Col span={5}>
                                            <ValidateItem validatorForm={validatorForm} thisForm="clientForm" field="account">
                                                <Input  value={!query.account?"":query.account}
                                                onChange={(e) => {
                                                validateField("clientForm", "account", e.target.value, this.changeQueryData({"account": e.target.value}))
                                            }}/>
                                            </ValidateItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>账户状态</Col>
                                        <Col span={5}>
                                            <Select value={!query.acc_status?"":query.acc_status}
                                                    onChange={(val)=>this.changeQueryData({"acc_status":val})}
                                                    style={{ width: "100%" }}>
                                                <Option value="">-----</Option>
                                                {statusOpt}
                                            </Select>
                                        </Col>
                                        <Col className="text-right" span={2}>已开通产品</Col>
                                        <Col span={5}>
                                            <Select value={!query.product?"":query.product}
                                                    onChange={(val)=>this.changeQueryData({"product":val})}
                                                    style={{ width: "100%" }}>
                                                <Option value="">-----</Option>
                                                {productOpt}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col offset={1} span={20}><div className="dividing-line"></div></Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}><Button onClick={()=>{this.subSearch()}} className="btn-primary">查询</Button></Col>
                                        <Col className="text-center" span={2}><Button onClick={()=>clearQuery()}  className="btn-disable enable">重置</Button></Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        {/*<Col span={14}>
                            <div className="search">
                                <Input addonAfter={<i className="iconfont icon-search"></i>}
                                       placeholder="输入客户类型、名称、已开通产品或启用禁用进行搜索"/>
                            </div>
                        </Col>*/}
                    </Row>

                    <div className="ant-table-body">
                        <table className="table">
                            <thead className="ant-table-thead">
                            <tr>
                                <th className="ant-table-selection-column">
                                    <Checkbox  checked={!list.length||list.length!=checkData.length?false:true}
                                               onChange={(e)=>checkAllData({"isCheck":e.target.checked},list)} /></th>
                                <th><span>客户类型</span></th>
                                <th><span>名称</span></th>
                                <th><span>账户</span></th>
                                <th><span>已开通产品</span></th>
                                <th><span>注册时间</span></th>
                                <th><span>最后一次登录</span></th>
                                <th><span>账户禁用/启用</span></th>
                                <th><span>操作</span></th>
                            </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                            {!list.length?<tr className="ant-table-row  ant-table-row-level-0"><td className="text-center" colSpan={9}>暂无数据！</td></tr>:
                                list.map((item,index)=>
                                    <tr key={index} className="ant-table-row  ant-table-row-level-0">
                                        <td className="ant-table-selection-column">
                                            <Checkbox
                                                checked={this.listIsChecked(item.id)}
                                                onChange={(e)=>changeCheckData({"id":item.id,"name":item.name,"isCheck":e.target.checked})}  /></td>
                                        <td>{CLIENTTYPE[item.cus_type]}</td>
                                        <td>{item.name}</td>
                                        <td>{item.account}</td>
                                        <td>{this.prodoctType(item.product_type)}</td>
                                        <td>{formatDataTime(item.created_at)}</td>
                                        <td>{!item.last_login_at||item.last_login_at=="0"?"":formatDataTime(item.last_login_at)}</td>
                                        <td>
                                            <Tooltip title={!item.status?"":CHECKSTUTUS[item.status]}>
                                                <Switch onChange={(checked)=>this.changeStatus([{"id":item.id,"name":item.name}],!checked?"disable":"enable")} checked={!item.status?false:true}/>
                                            </Tooltip>
                                        </td>
                                        <td><Link to={{"pathname":"/client_management/info","query":{"id":item.id,"type":item.cus_type,"applyId":item.apply_id,"applyType":item.apply_type,"status":item.status,"name":item.name}}}>详情</Link></td>
                                    </tr>
                                )
                            }
                           {/* <tr className="ant-table-row  ant-table-row-level-0">
                                <td className="ant-table-selection-column"><Checkbox onChange={()=>changeCheckData({"id":"1","name":"未实名认证","isCheck":!checkData[0]?true:!checkData[0].isCheck})}  /></td>
                                <td>未实名认证</td>
                                <td>eeee</td>
                                <td>ewwww</td>
                                <td>ewwww</td>
                                <td>weewwewe</td>
                                <td>weewewew</td>
                                <td>
                                    <Tooltip title="启用">
                                        <Switch defaultChecked={true}/>
                                    </Tooltip>
                                </td>
                                <td><Link to={{"pathname":"/client_management/info","query":{"id":"3","type":"3"}}}>详情</Link></td>
                            </tr>
                            <tr className="ant-table-row  ant-table-row-level-0">
                                <td className="ant-table-selection-column"><Checkbox  /></td>
                                <td>个人</td>
                                <td>eeee</td>
                                <td>ewwww</td>
                                <td>ewwww</td>
                                <td>weewwewe</td>
                                <td>weewewew</td>
                                <td><Switch defaultChecked={true}/></td>
                                <td><Link to={{"pathname":"/client_management/info","query":{"id":"3","type":"1"}}}>详情</Link></td>
                            </tr>
                            <tr className="ant-table-row  ant-table-row-level-0">
                                <td className="ant-table-selection-column"><Checkbox  /></td>
                                <td>公司</td>
                                <td>eeee</td>
                                <td>ewwww</td>
                                <td>ewwww</td>
                                <td>weewwewe</td>
                                <td>weewewew</td>
                                <td><Switch defaultChecked={true}/></td>
                                <td><Link to={{"pathname":"/client_management/info","query":{"id":"3","type":"2"}}}>详情</Link></td>
                            </tr>*/}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer search={(obj)=>this.search(obj)}  checkData={checkData} />
                {/*禁用/启用*/}
                <Modal title="提示"
                       footer={
                           <Row>
                               <Col span={24}>
                                   <Button onClick={()=>!configData.btnDisable?this.confirmModal():""}
                                           className={!configData.btnDisable?"btn-primary":"btn-disable"}>确定</Button>
                                   <Button onClick={()=>{addModalData({"enableModalShow":false});addConfigData({"choseData":[]});}} className="btn-disable  enable">取消</Button>
                               </Col>
                           </Row>}
                       onCancel={()=>{
                           addModalData({"enableModalShow":false});addConfigData({"choseData":[]});
                       }}
                        visible={modal.enableModalShow} className="enable-modal" >
                    <div className="modal-cont">
                        <div className="body-title">确定{!modal.modalTitle?"":modal.modalTitle}如下已选中用户：</div>
                        <div className="body-cont">
                            <Row>
                                {
                                    !configData.choseData?"":
                                        configData.choseData.map((item,index)=>
                                        <Col key={index} span={8}>
                                            <Checkbox checked={item.isCheck}
                                                      onChange={(e)=>editCheckData({"isCheck":e.target.checked,"id":item.id})}
                                            >{item.name}</Checkbox></Col>
                                    )
                                }
                            </Row>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {"query": state.client.clientData.query,
        "list": state.client.clientData.list,
        "modal":state.configData.modal,
        "configData": state.configData.data,
        "pageData":state.configData.pageData,
        "checkData": state.configData.data.chkData,
        "validatorForm": state.validatorForm
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        clearQuery: (...args) => dispatch(clearClientQuery(...args)),
        addQuery: (...args) => dispatch(addClientQuery(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        addFilterData: (...args) => dispatch(addConfigData(...args)),
        addConfigData: (...args) => dispatch(addConfigData(...args)),
        addModalData:(...args) => dispatch(addModalData(...args)),
        changeCheckData:(...args) => dispatch(changeCheckData(...args)),
        checkAllData:(...args) => dispatch(checkAllData(...args)),
        editCheckData:(...args) => dispatch(editCheckData(...args)),
        clearCheckData:(...args) => dispatch(clearCheckData(...args)),
        ajaxSearch:(...args) => dispatch(ajaxSearch(...args)),
        ajax:(...args) => dispatch(ajax(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientMangAll)