//import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import TabInfo from "./tab"
/*import ClientAllInfo from "./client.all.info";
import ClientPersonalInfo  from "./client.personal.info";
import ClientEnterpriseInfo from "./client.enterprise.info";*/
import ClientInfo from "./client.info"
//import {Link} from "react-router"
//import {incrementAsync,addData} from "../../actions/action.client.js"
//import InnerLeft from "../component/left.inner.js"
import {CLIENTTAB} from "../../config.js"
import {Switch  } from 'antd';
class TabClientCont extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {configData,location}=this.props;
        return (
            <TabInfo tabItem={CLIENTTAB}>
                <ClientInfo location={location} />
                {/*{query.type=="all"?<ClientAllInfo />:
                    query.type=="personal"?<ClientPersonalInfo />:
                        <ClientEnterpriseInfo />}*/}
            </TabInfo>
        )
    }
}
function mapStateToProps(state) {
    return {"client":state.client,"configData": state.configData.data}
}
export default connect(mapStateToProps)(TabClientCont)
