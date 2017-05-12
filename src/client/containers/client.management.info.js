//import "../client.css"
import {IP} from "../../config"
import React,{Component,PropTypes} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import TabClientCont from "../component/tab.client.cont"
import { addClientData} from "../../actions/action.client"
import {addConfigData,ajax} from "../../actions/action.config";
import {Switch  } from 'antd';
class ClientManageInfo extends Component {
    constructor(props) {
        super(props);
    }
    //禁用/启用
    changeStatus(status){
        //status,disable;禁用，enable:启用
        const {ajax,addConfigData,location,addData}=this.props;
        let _query=location.query;
        var url=`${IP}/customer/index/${status}`;
        ajax({"url":url,"sendData":[{"id":_query.id,"name":_query.name}]},true,function(){
            addData({"status":status=="enable"?"1":"0"});
        });
    }
    componentDidMount() {
        const {addData,location} = this.props;
        let _query=location.query;
        addData({"status": _query.status});
    }

    componentWillUnmount() {
        const {addConfigData} = this.props;
        addConfigData({"tabIndex":0,"innerTabIndex":0});
    }
    render() {
        const {configData,location,clientData}=this.props;
        return (
        <div>
            <div className="info-top">
                <a href="javascript:void(0)" onClick={()=>this.context.router.goBack()}>
                <i className="iconfont icon-left-jiantou"></i>
                    返回
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>|&nbsp;&nbsp;&nbsp;&nbsp;{location.query.name}</span>
            </div>
            <div style={{"margin": "30px 10px"}}>
                <label  style={{"fontSize": "15px","marginRight": "40px"}}>账户禁用/启用</label>
                <Switch onChange={(checked)=>this.changeStatus(!checked?"disable":"enable")} checked={!clientData.status?false:true} />
            </div>
           <TabClientCont location={location} />
        </div>
        )
    }
}
function mapStateToProps(state) {
    return { "clientData": state.client.clientData,"configData": state.configData.data}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        ajax: (...args) => dispatch(ajax(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        addConfigData:(...args) => dispatch(addConfigData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientManageInfo)
ClientManageInfo.contextTypes={
    router: PropTypes.object
};
