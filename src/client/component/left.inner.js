import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import {Link} from "react-router"
import {addData} from "../../actions/action.nav.js"
class InnerLeft extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {navData ,configData,dispatch,location}=this.props;
        return (
            <div className="innerLeft">
                <div className={!configData.navIsShow?"expandmax left":"expandmax right"} onClick={()=>dispatch(addData({"navIsShow":!configData.navIsShow}))}>
                    <i className={!configData.navIsShow?"iconfont icon-shouqi-right":"iconfont icon-shouqi-left"}></i></div>
                <ul className="innerleftNav" style={{"overflow": "hidden","width":!configData.navIsShow?"0px":"140px"}}>
                    {!navData ? "" :
                        navData.map((item, index)=>
                                <li key={index} className="overview">
                                    <Link to={item.url} data-id={item.id}
                                          className={location.pathname.indexOf(item.url)!="-1"?"innerLeftactive":""}
                                          activeClassName="innerLeftactive">{item.name}</Link>
                                </li>
                        )
                    }
                </ul>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {"configData": state.configData.data}
}
export default connect(mapStateToProps)(InnerLeft)