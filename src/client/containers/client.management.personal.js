//import "../client.css"
import {IP} from "../../config"
import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {Link} from "react-router"
import Footer from "../component/footer.pagination.js";
import {Checkbox, Button, Row, Col, Input, Icon, Switch} from 'antd';
import {addConfigData,changeCheckData,clearCheckData,ajaxSearch} from "../../actions/action.config";
import {addClientQuery,clearClientQuery,addClientData} from "../../actions/action.client"
class ClientMangPer extends Component {
    constructor(props) {
        super(props);
    }
    changeQueryData(data){
        const {addQuery}=this.props;
        addQuery({...data});
        setTimeout(() => {
            this.search();
        }, 3000);
    }
    search(pageObj){
        const {query,ajaxSearch,addData,pageData}=this.props;
        var sendQuery=!query.cond?{}:{"cond":query.cond};
        var pageObj=!pageObj?{}:pageObj;
        var _data={"url":`${IP}/customer/index/customerps`,"sendData":{
            "page":pageData.currPage,
            "perpage":pageData.pageSize,
            "query":{...sendQuery},
            ...pageObj
        }};
        ajaxSearch(_data,addData);
    }

    componentDidMount() {
        this.search();
    }
    componentWillUnmount() {
        //清空数据
        const {clearCheckData,clearQuery,addData}=this.props;
        clearCheckData();
        clearQuery();
        addData({"data":{},"list":[]});
    }
    render() {
        const {list,query,pageData,checkData,addConfigData}=this.props;
        return (
            <div>
                <div style={{"minHeight": "650px"}}>
                    <h3 style={{"display": "inline-block"}}>客户列表</h3><span>（共{pageData.total}个）</span>
                    <Row className="mtb20">
                        <Col span={24}>
                            <div className="search">
                                <Input value={!query.cond?"":query.cond} onChange={(e)=>this.changeQueryData({"cond":e.target.value})} addonAfter={<i style={{"cursor": "pointer"}} onClick={()=>this.search()} className="iconfont icon-search"></i>}
                                       placeholder="输入真实名称、身份证号码或所在地进行搜索"/>
                            </div>
                        </Col>
                    </Row>

                    <div className="ant-table-body">
                        <table className="table">
                            <thead className="ant-table-thead">
                            <tr>
                                <th>真实姓名</th>
                                <th><span>所在地</span></th>
                                <th><span>身份证号</span></th>
                                <th><span>网站信息</span></th>
                                <th><span>操作</span></th>
                            </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                            {!list.length?<tr className="ant-table-row  ant-table-row-level-0"><td className="text-center" colSpan={5}>暂无数据！</td></tr>:
                                list.map((item,index)=>
                                    <tr key={index} className="ant-table-row  ant-table-row-level-0">
                                        <td>{item.real_name}</td>
                                        <td>{item.location}</td>
                                        <td>{item.id_num}</td>
                                        <td>{item.web_site}</td>
                                        <td><Link onClick={()=>addConfigData({"tabIndex":2})} to={{
                                            "pathname": "/client_management/info",
                                            "query": {"id":item.id,"type":!item.cus_type?"1":item.cus_type,"applyId":item.apply_id,"applyType":item.apply_type,"status":item.status,"name":item.name}
                                        }}>详情</Link></td>
                                    </tr>
                                )
                            }
                            {/*<tr className="ant-table-row  ant-table-row-level-0">
                                <td>wewe</td>
                                <td>eeee</td>
                                <td>ewwww</td>
                                <td>weewwewe</td>
                                <td><Link to={{
                                    "pathname": "/client_management/info",
                                    "query": {"type": "personal"}
                                }}>详情</Link></td>
                            </tr>*/}
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
        "configData": state.configData.data,
        "pageData":state.configData.pageData,
        "checkData": state.configData.data.chkData}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        clearQuery: (...args) => dispatch(clearClientQuery(...args)),
        addQuery: (...args) => dispatch(addClientQuery(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        changeCheckData:(...args) => dispatch(changeCheckData(...args)),
        addConfigData:(...args) => dispatch(addConfigData(...args)),
        ajaxSearch:(...args) => dispatch(ajaxSearch(...args)),
        clearCheckData:(...args) => dispatch(clearCheckData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientMangPer)