//import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
//import {Link} from "react-router"
//import {incrementAsync,addData} from "../../actions/action.client.js"
import InnerLeft from "../component/left.inner.js"
import {CLIENTINNERNAV} from "../../config.js"
//import { Checkbox,Button ,Row, Col,Input, Icon,Switch  } from 'antd';
class ClientIndex extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {configData,location}=this.props;
        return (
        <div>
            <InnerLeft navData={CLIENTINNERNAV} location={location}/>
            <div style={{"marginLeft":!configData.navIsShow?"0px":"140px","minHeight": "650px"}}>
                {this.props.children}
            </div>
            {/* <div style={{"marginLeft":!configData.navIsShow?"0px":"140px"}} className="cont-footer">
             <Row>
             <Col span={6}>已选0项，共1项</Col>
             <Col span={18}>
             <Pagination showSizeChanger onShowSizeChange={()=>this.onShowSizeChange} defaultCurrent={3} total={500} />
             </Col>
             </Row>
             </div>*/}
        </div>
        )
    }
}
function mapStateToProps(state) {
    return {"client":state.client,"configData": state.configData.data}
}
/*const mapDispatchToProps = (dispatch, ownProps) => {
 return {
 addClientData: (...args) => dispatch(incrementAsync(...args))
 }
 };*/
export default connect(mapStateToProps)(ClientIndex)
