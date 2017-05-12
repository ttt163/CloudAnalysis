import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import { Row, Col,Input,Button,Select,Modal   } from 'antd';
import {addModalData} from "../../actions/action.modal"
import {addConfigData,addAccountData,clearAccountData} from "../../actions/action.config";
import {setFormFields, validateField, validateFormFields, delForm} from "../../validate/validateForm"
import ValidateItem from "../../validate/validate.item"
import {pwdRange,passwordReg} from "../../config"
const Option=Select.Option;
class AccountConfig extends Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        const {addModalData, addMassgeData,clearAccountData} = this.props;
        //清除数据
        delForm("editPsdForm");
        clearAccountData();
    }

    editPassword() {
        const {addModalData,query} = this.props;
        addModalData({"editPswShow": true});
        setFormFields("editPsdForm", {
            "oldPwd": {
                "rule": {"required": true,"equal":"123456"},
                "value":!query.oldPwd?"":query.oldPwd,
                "msg": {"required": "请输入原密码！","equal":"原密码错误！"}
            },
            "newPwd": {
                "rule": {"required": true,"notEqual":"admin",
                    "callBack":passwordReg},
                "value":!query.newPwd?"":query.newPwd,
                "msg": {"required": "请输入新密码！","notEqual":"密码不能和用户名相同！",
                "callBack":"密码格式错误！"}
            },
            "repPwd": {
                "rule": {"required": true,"sameField":"newPwd"},
                "value":!query.repPwd?"":query.repPwd,
                "msg": {"required": "请再次输入新密码！","sameField":"两次密码输入不一致！"}
            }
        });
    }
    savePassword(form) {
        const {addModalData} = this.props;
        var isValidate = validateFormFields(form);
        console.log(isValidate);
        if (!isValidate) {
            return;
        }
        //提交数据

    }
    render() {
        const {addModalData,query,validatorForm,modal,addAccountQuery }=this.props;
        //console.log(this.props);
        return (
            <div>
                <h3 className="mb30">安全设置</h3>
                <div className="dividing-line"></div>
                <Row className="mt30">
                    <Col className="text-right" span={3}>登陆账号（邮箱）：</Col>
                    <Col  span={21}>ds@163.com</Col>
                </Row>
                <Row  className="mb30">
                    <Col className="text-right" span={3}>注册时间：</Col>
                    <Col  span={21}>2017-01-02 10:00:00</Col>
                </Row>
                <div className="dividing-line"></div>
                <Row  className="mt30">
                    <Col className="text-right" span={3}>登陆密码：</Col>
                    <Col span={21}>安全性高的密码可以使账号更安全。</Col>
                </Row>
                <Row>
                    <Col  offset={3} span={10}>建议您定期更换密码，设置一个包含字母、符号或数字中至少两项且长度超过6位的密码。</Col>
                    <Col  span={3}><Button onClick={()=>this.editPassword()} className="btn-default-blue">修改</Button></Col>
                </Row>
                {/*修改密码*/}
                <Modal title="修改密码" onCancel={() => {
                    addModalData({"editPswShow": false});delForm("editPsdForm");
                }}
                       onOk={() => this.savePassword("editPsdForm")}
                       visible={!modal.editPswShow ? false : true} className="enable-modal">
                    <div className="modal-cont">
                        <Row>
                            <Col className="text-right" span={6}>原密码：</Col>
                            <Col span={17}>
                                <ValidateItem validatorForm={validatorForm} thisForm="editPsdForm" field="oldPwd">
                                    <Input value={!query.oldPwd ? "" : query.oldPwd}
                                           onChange={(e) => {
                                               validateField("editPsdForm", "oldPwd", e.target.value, addAccountQuery({"oldPwd": e.target.value}))
                                           }}/>
                                </ValidateItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>新密码：</Col>
                            <Col span={17}>
                                <ValidateItem validatorForm={validatorForm} thisForm="editPsdForm" field="newPwd">
                                    <Input value={!query.newPwd ? "" : query.newPwd}
                                           onChange={(e) => {
                                               validateField("editPsdForm", "newPwd", e.target.value, addAccountQuery({"newPwd": e.target.value}))
                                           }}/>
                                </ValidateItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={6}>再次输入新密码：</Col>
                            <Col span={17}>
                                <ValidateItem validatorForm={validatorForm} thisForm="editPsdForm" field="repPwd">
                                    <Input value={!query.repPwd ? "" : query.repPwd}
                                           onChange={(e) => {
                                               validateField("editPsdForm", "repPwd", e.target.value, addAccountQuery({"repPwd": e.target.value}))
                                           }}/>
                                </ValidateItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{"color":"#d04141"}}>提示：密码必须为6-16位字符，且使用大写字母、小写字母、数字及标点符号四种字符中,至少三种组合，且与登录名无相关性。</Col>
                        </Row>
                    </div>
                </Modal>
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
export default connect(mapStateToProps,mapDispatchToProps)(AccountConfig)
