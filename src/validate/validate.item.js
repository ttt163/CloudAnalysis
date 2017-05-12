import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
class ValidateItem extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        const {validatorForm,thisForm,field}=this.props;
        var fieldValideMsg=!validatorForm||!validatorForm[thisForm]||!validatorForm[thisForm].valideMsg?"":validatorForm[thisForm].valideMsg[field];
        const isError=!fieldValideMsg?true:fieldValideMsg.isValider;
        return (
            <div className={!isError?"form-item has-error":"form-item"}>
                {this.props.children}
                {!isError? <div className="ant-form-explain">{fieldValideMsg.error}</div>:""}
                </div>
        )
    }
}
function mapStateToProps(state) {
    return {"validatorForm": state.validatorForm
    }
}
export default connect(mapStateToProps)(ValidateItem)

