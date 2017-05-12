import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import ClientCheckInfo from "./client.check.info"
import ClientCheckList from "./client.check.list"
import {addConfigData} from "../../actions/action.config";
import {clearClientQuery} from "../../actions/action.client"
class ClientCheck extends Component {
    constructor(props) {
        super(props)
    }
    componentWillUnmount() {
        const {addTabData,clearQuery}=this.props;
        addTabData({"innerTabIndex":0,"checkInfo":"","checkInfoType":""});
        clearQuery();
    }
    render() {
        const {configData,location,addTabData}=this.props;
        const query=location.query;
        return (
            <div style={{"display":configData.tabIndex=="2"?"block":"none"}}>
                <div className="inner-tab">
                    <div onClick={()=>{addTabData({"innerTabIndex":0})}} className={configData.innerTabIndex==0?"inner-item active":"inner-item"}>待审核信息</div>
                    <div onClick={()=>{addTabData({"innerTabIndex":1})}} className={configData.innerTabIndex==1?"inner-item active":"inner-item"}>审核记录</div>
                </div>
                {
                    configData.innerTabIndex=="1"?
                        <ClientCheckList location={location}/>
                        :
                        <ClientCheckInfo location={location}/>
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    //console.log(state);
    return {"configData": state.configData.data}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        clearQuery: (...args) => dispatch(clearClientQuery(...args)),
        addTabData: (...args) => dispatch(addConfigData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientCheck)
