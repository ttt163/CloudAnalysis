//import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import ClientBasicInfo from "./client.basic.info"
import ClientKeyInfo from "./client.key.info"
import ClientCheck from "./client.check"
import ClientLogInfo from "./client.log.info"


class ClientInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {configData,location}=this.props;
        const pathName=location.pathname;
        return (
            <div>
                {
                    configData.tabIndex=="1"?
                        <ClientKeyInfo location={location} />:
                        configData.tabIndex=="2"?
                            <ClientCheck location={location} />
                            : configData.tabIndex=="3"?
                            <ClientLogInfo location={location} />:
                            <ClientBasicInfo location={location} />
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {"client":state.client,"configData": state.configData.data}
}
export default connect(mapStateToProps)(ClientInfo)
