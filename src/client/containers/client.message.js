//import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import InnerLeft from "../component/left.inner.js"
import {MESSAGENNERNAV} from "../../config.js"
class ClientMessage extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        const {configData,location}=this.props;
        return (
            <div>
                <InnerLeft navData={MESSAGENNERNAV} location={location}/>
                <div style={{"marginLeft":!configData.navIsShow?"0px":"140px","minHeight": "650px"}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {"client":state.client,"configData": state.configData.data}
}
export default connect(mapStateToProps)(ClientMessage)