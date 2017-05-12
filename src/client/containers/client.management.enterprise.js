//import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import {Link} from "react-router"
import { Checkbox,Button ,Row, Col,Input, Icon,Switch ,Select } from 'antd';
import Footer from "../component/footer.pagination.js";
import {AUTHENTICATETYPE,IP} from "../../config"
import {addConfigData,changeCheckData,clearCheckData,ajaxSearch } from "../../actions/action.config";
import {addClientData,addClientQuery,clearClientQuery} from "../../actions/action.client"
import {setFormFields, validateField, validateFormFields, delForm} from "../../validate/validateForm"
import ValidateItem from "../../validate/validate.item"
const Option=Select.Option;
var certificatOpt=[];
for (let [key,value] of Object.entries(AUTHENTICATETYPE)){
    certificatOpt.push(<Option key={key}>{value}</Option>);
}
/*for(var i=0;i<AUTHENTICATETYPE.length;i++) {
    certificatOpt.push(<Option key={AUTHENTICATETYPE[i].value}>{AUTHENTICATETYPE[i].name}</Option>);
}*/
class ClientMangPri extends Component {
    constructor(props) {
        super(props);
    }
    changeQueryData(data){
        const {addQuery}=this.props;
        addQuery({...data});
    }
    search(pageObj){
        const {query,ajaxSearch,addData,pageData}=this.props;
        var sendQuery={};
        var pageObj=!pageObj?{}:pageObj;
        for(let [key,value] of Object.entries(query)){
            if(value!=""){
                sendQuery={...sendQuery,[key]:value};
            }
        }
        var _data={"url":`${IP}/customer/index/customerep`,"sendData":{
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
    subSearch(){
        const {addFilterData, query} = this.props;
        var isValidate = validateField("clientForm", "name", query.name);
        console.log(isValidate);
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
                "rule": {"maxLen": 200},
                "msg": {"maxLen": "不能超过200个字符！"}
            }
        });
    }
    componentWillUnmount() {
        const {addFilterData,clearQuery,clearCheckData,addData }=this.props;
        addFilterData({"filterShow":false});
        clearCheckData();
        clearQuery();
        addData({"data":{},"list":[]});
        delForm("clientForm");
    }
    render() {
        const {addFilterData,configData,clearQuery,list,query,pageData,checkData,addConfigData,validatorForm}=this.props;
        return (
            <div>
                <div style={{"minHeight": "650px"}}>
                    <h3 style={{"display":"inline-block"}}>客户列表</h3><span>（共{pageData.total}个）</span>
                    <Row className="mtb20">
                        <Col span={24}>
                            <div style={{"position":"relative"}}>
                              <Button className={!configData.filterShow?"filter-btn":"filter-btn active"} onClick={()=>addFilterData({"filterShow":!configData.filterShow})}><i className={!configData.filterShow?"iconfont icon-down":"iconfont icon-up"}>筛选</i></Button>
                                <div className="log-filter-cont filter-cont" style={{"display":!configData.filterShow?"none":"block"}}>
                                    <Row>
                                        <Col className="text-right" span={2}>认证方式</Col>
                                        <Col span={5}>
                                            <Select value={!query.auth_type?"":query.auth_type}
                                                    onChange={(val)=>this.changeQueryData({"auth_type":val})} style={{ width: "100%" }}>
                                                <Option value="">-----</Option>
                                                {certificatOpt}
                                            </Select>
                                        </Col>
                                        <Col className="text-right" span={2}>企业名称</Col>
                                        <Col span={5}>
                                            <ValidateItem validatorForm={validatorForm} thisForm="clientForm" field="name">
                                                <Input  value={!query.name?"":query.name}
                                                        onChange={(e) => {
                                                            validateField("clientForm", "name", e.target.value, this.changeQueryData({"name": e.target.value}))
                                                        }}/>
                                            </ValidateItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col offset={1} span={20}><div className="dividing-line"></div></Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>
                                            <Button onClick={()=>{this.subSearch()}} className="btn-primary">查询</Button>
                                        </Col>
                                        <Col className="text-center" span={2}><Button onClick={()=>clearQuery()} className="btn-disable enable">重置</Button></Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        {/*<Col span={24}>
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
                                <th>认证方式</th>
                                <th><span>企业名称</span></th>
                                <th><span>操作</span></th>
                            </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                            {!list.length?<tr className="ant-table-row  ant-table-row-level-0"><td className="text-center" colSpan={3}>暂无数据！</td></tr>:
                                list.map((item,index)=>
                                    <tr key={index} className="ant-table-row  ant-table-row-level-0">
                                        <td>{!AUTHENTICATETYPE[item.auth_type]?item.auth_type:AUTHENTICATETYPE[item.auth_type]}</td>
                                        <td>{item.name}</td>
                                        <td><Link onClick={()=>addConfigData({"tabIndex":2})} to={{"pathname":"/client_management/info","query":{"id":item.id,"type":!item.cus_type?"2":item.cus_type,"applyId":item.apply_id,"applyType":item.apply_type,"status":item.status,"name":item.name}}}>详情</Link></td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer search={(obj)=>this.search(obj)}  checkData={checkData} />
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {"query": state.client.clientData.query,
        "list": state.client.clientData.list,
        "pageData":state.configData.pageData,
        "configData": state.configData.data,
        "checkData": state.configData.data.chkData,
        "validatorForm": state.validatorForm
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        clearQuery: (...args) => dispatch(clearClientQuery(...args)),
        addQuery: (...args) => dispatch(addClientQuery(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        ajaxSearch:(...args) => dispatch(ajaxSearch(...args)),
        changeCheckData:(...args) => dispatch(changeCheckData(...args)),
        clearCheckData:(...args) => dispatch(clearCheckData(...args)),
        addConfigData:(...args) => dispatch(addConfigData(...args)),
        addFilterData: (...args) => dispatch(addConfigData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientMangPri)