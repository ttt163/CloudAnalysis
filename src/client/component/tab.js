import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
//import {Link} from "react-router"
import {addConfigData} from "../../actions/action.config"
class TabInfo extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {children,tabItem,configData,addTabData}=this.props;
        return (
            <div>
                <div className="t-tab">
                    {tabItem.map((item,index)=>
                        <div key={index} onClick={()=>{addTabData({"tabIndex":index})}} className={configData.tabIndex==index?"t-item active":"t-item"}>{item}</div>
                    )}
                </div>
                <div className="tab-cont">
                    {children}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {"configData": state.configData.data}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addTabData: (...args) => dispatch(addConfigData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(TabInfo)