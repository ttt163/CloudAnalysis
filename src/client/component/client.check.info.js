import {IP, APPLAYTYPE, AUTHENTICATETYPE, formatDataTime, CHECKTYPE} from "../../config"
import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {Row, Col, Input, Button, Select} from 'antd';
import {Link} from "react-router"
import {addConfigData, getAjaxData, ajax} from "../../actions/action.config";
import {addModalData} from "../../actions/action.modal";
import {addClientData, addClientQuery} from "../../actions/action.client"
//import Footer from "./footer.pagination"
const Option = Select.Option;
let checkOpt = [];
for (let [key, value] of Object.entries(CHECKTYPE)) {
    checkOpt.push(<Option key={key}>{value}</Option>);
}
/*for(var i=0;i<CHECKTYPE.length;i++){
 checkOpt.push(<Option key={CHECKTYPE[i].value}>{CHECKTYPE[i].name}</Option>);
 }*/
class ClientCheckInfo extends Component {
    constructor(props) {
        super(props)
    }

    showImg(e, img) {
        const {addModalData} = this.props;
        var imgObj = new Image();
        imgObj.src = img;
        addModalData({
            "left": e.clientX,
            "top": e.clientY - imgObj.height < 70 ? 70 : e.clientY - imgObj.height,
            "imgModal": true,
            "imgSrc": img
        });
    }

    getCheckInfo() {
        const {getAjaxData, addData, location} = this.props;
        var _query = location.query;
        getAjaxData({
            "url": `${IP}/customer/index/tobeaudit`, "sendData": {
                "id": _query.id,
                "cus_type": _query.type, "apply_type": _query.applyType
            }
        }, false, addData);
    }

    //执行审核
    checkSubmit() {
        const {ajax, location, checkQuery, data} = this.props;
        let _query = location.query,
            _data = {
                "apply_type": _query.applyType,
                "apply_time": data.data.apply.apply_time,
                "status": checkQuery.checkStatus
            };
        if (checkQuery.checkStatus == "2") {
            _data = {..._data, "reason": checkQuery.checkReason}
        }
        ajax({
            "url": `${IP}/customer/index/audit`, "sendData": {
                "uid": _query.id,
                "apply_id": _query.applyId,
                "data": _data
            }
        }, true);
    }

    componentDidMount() {
        const {addData, addQuery} = this.props;
        addQuery({"checkStatus": "0"});
        this.getCheckInfo();
    }

    componentWillUnmount() {
        const {addData} = this.props;
        addData({"data": {}});
    }

    render() {
        const {location, data, clientData, addData, checkQuery, addQuery} = this.props;
        const _query = location.query, _data = data.data;
        return (
            <div>
                {!data || !data.msg ?
                    <div>
                        <Row>
                            <Col style={{"textAlign": "center", "marginTop": "120px"}} span={18}>当前此客户没有待审核信息！</Col>
                        </Row>
                    </div>
                    : _query.applyType == "2" ?
                        <div >
                            <div className="block">
                                <div className="block-title"><h4>实名认证申请</h4></div>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>申请类型</Col>
                                    <Col span={18}
                                         offset={1}>{!APPLAYTYPE[_query.applyType] ? _query.applyType : APPLAYTYPE[_query.applyType]}</Col>
                                </Row>
                                <Row>
                                    <Col className="text-right" span={2}>申请时间 </Col>
                                    <Col span={18} offset={1}>
                                        {!_data.apply || !parseInt(_data.apply.apply_time) ? "" : formatDataTime(_data.apply.apply_time)}
                                    </Col>
                                </Row>
                            </div>
                            <div className="block">
                                <div className="block-title"><h4>实名认证信息</h4></div>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>认证方式</Col>
                                    <Col span={18} offset={1}>
                                        {!_data.info || !_data.info.auth_type ? "" : !AUTHENTICATETYPE[_data.info.auth_type] ? _data.info.auth_type : AUTHENTICATETYPE[_data.info.auth_type]}
                                    </Col>
                                </Row>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>主题信息</Col>
                                    <Col span={18} offset={1}>
                                        <Row>
                                            <Col span={2}>企业名称</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.topic_info || !_data.info.topic_info.name ? "" : _data.info.topic_info.name}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2}>企业信用代码</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.topic_info || !_data.info.topic_info.code ? "" : _data.info.topic_info.code}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2}>企业地址</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.topic_info || !_data.info.topic_info.enterprise_address ? "" : _data.info.topic_info.enterprise_address}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2}>执照扫描件</Col>
                                            <Col span={18} offset={1}>
                                                <div className="yy-img">
                                                    <img src={!_data.info || !_data.info.topic_info || !_data.info.topic_info.license_path ? "" : _data.info.topic_info.license_path}/>
                                                </div>
                                                <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.topic_info || !_data.info.topic_info.license_path ? "" : _data.info.topic_info.license_path)}
                                                   href="javescript:void(0)">查看原图</a></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>业务信息</Col>
                                    <Col span={18} offset={1}>
                                        <Row>
                                            <Col span={2}>业务信息</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.business_info || !_data.info.business_info.bus_info ? "" : _data.info.business_info.bus_info}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2}>所属行业</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.business_info || !_data.info.business_info.industry ? "" : _data.info.business_info.industry}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2}>网站信息</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.business_info || !_data.info.business_info.web_site ? "" : _data.info.business_info.web_site}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>运营者信息</Col>
                                    <Col span={18} offset={1}>
                                        <Row>
                                            <Col span={2}>运营者姓名</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_name ? "" : _data.info.operator_info.opt_name}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2}>所在地</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.operator_info || !_data.info.operator_info.location ? "" : _data.info.operator_info.location}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2}>身份证号码</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.operator_info || !_data.info.operator_info.id_number ? "" : _data.info.operator_info.id_number}

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={4}>
                                                <div className="grzz-img">
                                                    <img src={!_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_p_path ? "" : _data.info.operator_info.opt_id_p_path}/>
                                                </div>
                                                <div>持证照-正面
                                                    <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_p_path ? "" : _data.info.operator_info.opt_id_p_path)}
                                                       href="javescript:void(0)">查看原图</a></div>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                <div className="grzz-img">
                                                    <img src={!_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_b_path ? "" : _data.info.operator_info.opt_id_b_path}/>
                                                </div>
                                                <div>持证照-反面
                                                    <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_b_path ? "" : _data.info.operator_info.opt_id_b_path)}
                                                       href="javescript:void(0)">查看原图</a>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className="dividing-line"></div>
                                <div className="block mb30">
                                    <div className="block-title"><h4>审核状态</h4></div>
                                    <div className="dividing-line"></div>
                                    <Row className="mt30">
                                        <Col className="text-right" span={2}>审核状态</Col>
                                        <Col span={18} offset={1}>
                                            <Select
                                                value={checkQuery.checkStatus}
                                                onChange={(val) => addQuery({"checkStatus": val})}
                                                style={{width: 200}}>
                                                {checkOpt}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row className="mt30"
                                         style={{"display": checkQuery.checkStatus == "2" ? "block" : "none"}}>
                                        <Col className="text-right" span={2}>未通过原因</Col>
                                        <Col span={18} offset={1}>
                                            <Input type="textarea" rows={6}
                                                   value={checkQuery.checkReason}
                                                   onChange={(e) => addQuery({"checkReason": e.target.value})}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-center" span={20}>
                                        <Button
                                            className={checkQuery.checkStatus == "0" ? "btn-disable" : "btn-primary"}
                                            onClick={() => checkQuery.checkStatus == "0" ? "" : this.checkSubmit()}
                                        >确认</Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        :
                        _query.applyType == "1" ?
                            <div>
                                <div className="block">
                                    <div className="block-title"><h4>实名认证申请</h4></div>
                                    <div className="dividing-line"></div>
                                    <Row>
                                        <Col className="text-right" span={2}>申请类型</Col>
                                        <Col span={18} offset={1}>
                                            {!APPLAYTYPE[_query.applyType] ? _query.applyType : APPLAYTYPE[_query.applyType]}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>申请时间 </Col>
                                        <Col span={18} offset={1}>
                                            {!_data.apply || !parseInt(_data.apply.apply_time) ? "" : formatDataTime(_data.apply.apply_time)}
                                        </Col>
                                    </Row>
                                </div>
                                <div className="block">
                                    <div className="block-title"><h4>实名认证信息</h4></div>
                                    <div className="dividing-line"></div>
                                    <Row>
                                        <Col className="text-right" span={2}>真实姓名</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.info || !_data.info.real_name ? "" : _data.info.real_name}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>所在地</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.info || !_data.info.location ? "" : _data.info.location}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>身份证号码</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.info || !_data.info.id_num ? "" : _data.info.id_num}

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>网站信息</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.info || !_data.info.web_site ? "" : _data.info.web_site}

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center" span={4}>
                                            <div className="grzz-img">
                                                <img src={!_data.info || !_data.info.id_p_path ? "" : _data.info.id_p_path}/>
                                            </div>
                                            <div>持证照-正面
                                                <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.id_p_path ? "" : _data.info.id_p_path)}
                                                   href="javescript:void(0)">查看原图</a></div>
                                        </Col>
                                        <Col span={10} offset={1}>
                                            <div className="grzz-img">
                                                <img
                                                    src={!_data.info || !_data.info.id_b_path ? "" : _data.info.id_b_path}/>
                                            </div>
                                            <div>持证照-反面
                                                <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.id_b_path ? "" : _data.info.id_b_path)}
                                                   href="javescript:void(0)">查看原图</a></div>
                                        </Col>
                                    </Row>
                                    <div className="dividing-line"></div>
                                    <div className="block mb30">
                                        <div className="block-title"><h4>审核状态</h4></div>
                                        <div className="dividing-line"></div>
                                        <Row className="mt30">
                                            <Col className="text-right" span={2}>审核状态</Col>
                                            <Col span={18} offset={1}>
                                                <Select
                                                    value={checkQuery.checkStatus}
                                                    onChange={(val) => addQuery({"checkStatus": val})}
                                                    style={{width: 200}}>
                                                    {checkOpt}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row className="mt30"
                                             style={{"display": checkQuery.checkStatus == "2" ? "block" : "none"}}>
                                            <Col className="text-right" span={2}>未通过原因</Col>
                                            <Col span={18} offset={1}>
                                                <Input type="textarea" rows={6}
                                                       value={checkQuery.checkReason}
                                                       onChange={(e) => addQuery({"checkReason": e.target.value})}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="dividing-line"></div>
                                    <Row>
                                        <Col className="text-center" span={20}>
                                            <Button
                                                className={checkQuery.checkStatus == "0"||(checkQuery.checkStatus == "2"&&!checkQuery.checkReason) ? "btn-disable" : "btn-primary"}
                                                onClick={() => checkQuery.checkStatus == "0" ? "" : this.checkSubmit()}
                                            >确认</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            :
                            <div>
                                <Row>
                                    <Col style={{"textAlign": "center", "marginTop": "120px"}}
                                         span={18}>当前此客户没有待审核信息！</Col>
                                </Row>
                            </div>
                }

            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {
        "checkQuery": state.client.clientData.query,
        "clientData": state.client.clientData,
        "data": state.client.clientData.data,
        "configData": state.configData.data
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addData: (...args) => dispatch(addClientData(...args)),
        addQuery: (...args) => dispatch(addClientQuery(...args)),
        getAjaxData: (...args) => dispatch(getAjaxData(...args)),
        ajax: (...args) => dispatch(ajax(...args)),
        addModalData: (...args) => dispatch(addModalData(...args))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientCheckInfo)
