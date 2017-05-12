import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import { Row, Col,Input,Button,Select  } from 'antd';
import {addConfigData,addAccountData,clearAccountData} from "../../actions/action.config";
import {setFormFields, validateField, validateFormFields, delForm} from "../../validate/validateForm"
import ValidateItem from "../../validate/validate.item"
import {phoneReg} from "../../config"
const Option=Select.Option;
class AccountInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {query,addAccountQuery} = this.props;
        addAccountQuery({"phone": "133XXXXX","oldPhone": "133XXXXX"});
        setFormFields("editInfoForm", {
            "phone": {
                "rule": {"required": true,"regexp":phoneReg},
                "value":!query.phone?"":query.phone,
                    "msg": {"required": "请输入联系电话!","regexp":"电话格式错误！"}
            }
        });
    }
    componentWillUnmount() {
        const {clearAccountData} = this.props;
        //清除数据
        delForm("editInfoForm");
        clearAccountData();
    }
    saveInfo(form) {
        var isValidate = validateFormFields(form);
        console.log(isValidate);
        if (!isValidate) {
            return;
        }
        //提交数据

    }
    render() {
        const {query,validatorForm,addAccountQuery}=this.props;
        //console.log(this.props);
        return (
            <div>
                <h3 className="mb30">基本资料</h3>
                <div className="dividing-line"></div>
                <Row className="mt30">
                    <Col className="text-right" span={3}>真实姓名：</Col>
                    <Col  span={21}>王二</Col>
                </Row>
                <Row >
                    <Col className="text-right" span={3}>用户组：</Col>
                    <Col  span={21}>点播运维组</Col>
                </Row>
                <Row>
                    <Col className="text-right" span={3}>策略：</Col>
                    <Col  span={21}>点播运维组</Col>
                </Row>
                <div className="acc-role">
                    <div className="block-title">点播运维主管 策略权限详情</div>
                    <div className="ml40">
                        <p>1）云解析模块</p>
                        <div className="role-block">
                            <p>只读访问云解析相关的所有策略</p>
                            <p> NS服务器管理：增/删/改/查NS服务器</p>
                            <p> 域名管理：启用/禁用域名</p>
                            <p> 消息管理：增/删/改/查消息模块；增/删/改/查消息发送方式</p>
                        </div>
                        <p>2）用户与权限</p>
                        <div className="role-block">
                            <p>只读访问所有策略</p>
                            <p>关联/移除策略</p>
                        </div>
                    </div>
                </div>
                <h3 className="mb30">联系信息</h3>
                <div className="dividing-line"></div>
                <Row className="mt30 mb10">
                    <Col className="text-right" span={3}>邮箱：</Col>
                    <Col  span={21}>wang'er@gosun.com</Col>
                </Row>
                <Row >
                    <Col className="text-right" span={3}>联系电话：</Col>
                    <Col  span={6}>
                        <ValidateItem validatorForm={validatorForm} thisForm="editInfoForm" field="phone">
                        <Input value={!query.phone ? "" : query.phone}
                               onChange={(e) => {
                                   validateField("editInfoForm", "phone", e.target.value, addAccountQuery({"phone": e.target.value}))
                               }}/>
                    </ValidateItem></Col>
                </Row>
                <Row className="mt30">
                    <Col className="text-right" span={4}>
                        <Button onClick={()=>{query.phone!=query.oldPhone?this.saveInfo("editInfoForm"):""}} className={query.phone==query.oldPhone?"btn-disable":"btn-primary"}>保存</Button></Col>
                </Row>
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {"query": state.configData.userQuery,
        "modal":state.configData.modal,
        "validatorForm": state.validatorForm}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addAccountQuery:(...args) => dispatch(addAccountData(...args)),
        clearAccountData:(...args)=>dispatch(clearAccountData(...args)),
        addConfigData: (...args) => dispatch(addConfigData(...args)),
        addModalData: (...args) => dispatch(addModalData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(AccountInfo)
