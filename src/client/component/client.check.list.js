import {IP,APPLAYTYPE,formatDataTime,CHECKTYPE} from "../../config"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import {Link} from "react-router"
import {addConfigData,ajaxSearch} from "../../actions/action.config";
//import {addModalData} from "../../actions/action.modal";
import {addClientQuery,clearClientQuery,addClientData} from "../../actions/action.client"
import ClientCheckListInfo from "./client.check.list.info"
import Footer from "./footer.pagination"
class ClientCheckList extends Component {
    constructor(props) {
        super(props)
    }
    getCheckList(){
        const {ajaxSearch,addData,location}=this.props;
        var _query=location.query;
        ajaxSearch({"url":`${IP}/customer/index/auditlog`,"sendData":{"id":_query.id}},addData);
    }
    componentDidMount() {
        this.getCheckList();
    }
    componentWillUnmount() {
        const {addData,clearQuery}=this.props;
        addData({"list":[]});
        //clearQuery();
    }
    render() {
        const {configData,location,addTabData,list,addQuery}=this.props;
        return (
            <div>
                {!configData.checkInfo?
                    <div>
                        <div className="ant-table-body" style={{"minHeight":"450px"}}>
                            <table className="table">
                                <thead className="ant-table-thead">
                                <tr>
                                    <th>申请实名认证类型</th>
                                    <th><span>申请实名认证时间</span></th>
                                    <th><span>审批实名认证时间</span></th>
                                    <th><span>审批结果</span></th>
                                    <th><span>操作</span></th>
                                </tr>
                                </thead>
                                <tbody className="ant-table-tbody">
                                {!list.length?
                                    <tr className="ant-table-row  ant-table-row-level-0">
                                        <td className="text-center" colSpan={5}>暂无审核记录！</td>
                                    </tr>
                                    :
                                    list.map((item,index)=>
                                        <tr key={index} className="ant-table-row  ant-table-row-level-0">
                                            <td>{!APPLAYTYPE[item.app_type]?item.app_type:APPLAYTYPE[item.app_type]}</td>
                                            <td>{!parseInt(item.apply_time)?"":formatDataTime(item.apply_time)}</td>
                                            <td>{!parseInt(item.audit_time)?"":formatDataTime(item.audit_time)}</td>
                                            <td>{!CHECKTYPE[item.status]?item.status:CHECKTYPE[item.status]}</td>
                                            <td>
                                                <a href="javascript:void(0)"
                                                   onClick={()=>{addTabData({"checkInfo":"info","checkInfoType":item.app_type});addQuery({"log_id":item.uid,"apply_id":item.apply_id})}}>详情</a>
                                            </td>
                                        </tr>
                                    )
                                }
                                {/*<tr className="ant-table-row  ant-table-row-level-0">
                                    <td>企业</td>
                                    <td>2016-06-09 09:00:00</td>
                                    <td>2016-06-09 09:00:00</td>
                                    <td>未通过</td>
                                    <td>
                                        <a href="javascript:void(0)"
                                           onClick={()=>addTabData({"checkInfo":"info","checkInfoType":"enterprise"})}>详情</a>
                                    </td>
                                </tr>
                                <tr className="ant-table-row  ant-table-row-level-0">
                                    <td>个人</td>
                                    <td>2016-06-09 09:00:00</td>
                                    <td>2016-06-09 09:00:00</td>
                                    <td>未通过</td>
                                    <td>
                                        <a href="javascript:void(0)" onClick={()=>addTabData({"checkInfo":"info","checkInfoType":"personal"})}>详情</a>
                                    </td>
                                </tr>*/}
                                </tbody>
                            </table>
                        </div>
                        <Footer />
                    </div>
                    :
                   <ClientCheckListInfo location={location} />
                }

            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {"query": state.client.clientData.query,"data":state.client.clientData.data,"list":state.client.clientData.list,"configData": state.configData.data}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        clearQuery: (...args) => dispatch(clearClientQuery(...args)),
        addQuery: (...args) => dispatch(addClientQuery(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        ajaxSearch:(...args) => dispatch(ajaxSearch(...args)),
        addTabData: (...args) => dispatch(addConfigData(...args)),
        addModalData:(...args) => dispatch(addModalData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientCheckList)
