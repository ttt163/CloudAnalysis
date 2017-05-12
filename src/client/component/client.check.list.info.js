import React,{Component} from 'react';
import { render } from 'react-dom';
import { Row, Col} from 'antd';
import {connect} from 'react-redux';
import {IP,APPLAYTYPE,formatDataTime,AUTHENTICATETYPE} from "../../config"
import {addConfigData,getAjaxData} from "../../actions/action.config";
import {addModalData} from "../../actions/action.modal";
import {addClientData,clearClientQuery} from "../../actions/action.client"
class ClientCheckListInfo extends Component {
    constructor(props) {
        super(props)
    }
    showImg(e,img){
        const {addModalData}=this.props;
        var imgObj=new Image();
        imgObj.src=img;
        addModalData({"left":e.clientX,"top":e.clientY-imgObj.height<70?70:e.clientY-imgObj.height,"imgModal":true,"imgSrc":img});
    }
    getCheckInfo(){
        const {getAjaxData,addData,location,query}=this.props;
        getAjaxData({"url":`${IP}/customer/index/auditlogdetail`,"sendData":{"log_id":query.log_id,"apply_id":query.apply_id}},false,addData);
    }
    componentDidMount() {
        this.getCheckInfo();
    }
    componentWillUnmount() {
        const {addData,clearQuery}=this.props;
        addData({"data":{}});
        clearQuery();
    }
    render() {
        const {configData,location,addTabData,data,query}=this.props;
        var _data=data.data;
        return (
            <div>
                <a style={{"display":"inline-block"}} className="mb30" href="javascript:void(0)" onClick={()=>addTabData({"checkInfo":""})}><i className="iconfont icon-left"></i>返回审核记录列表</a>
                {!data.msg||!_data?
                    <div>
                        <div style={{"textAlign": "center","padding": "30px 0px"}}>暂无相关数据！</div>
                        <div className="dividing-line"></div>
                    </div>
                    :
                    configData.checkInfoType!="2"?
                        <div>
                            <div className="block">
                                <div className="block-title"><h4>实名认证申请</h4></div>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>申请类型</Col>
                                    <Col span={18} offset={1}>{APPLAYTYPE[configData.checkInfoType]}</Col>
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
                                            <Col  span={2}>企业名称</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.topic_info || !_data.info.topic_info.name ? "" : _data.info.topic_info.name}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2}>企业信用代码</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.topic_info || !_data.info.topic_info.code ? "" : _data.info.topic_info.code}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2}>企业地址</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.topic_info || !_data.info.topic_info.enterprise_address ? "" : _data.info.topic_info.enterprise_address}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2}>执照扫描件</Col>
                                            <Col span={18} offset={1}>
                                                <div className="yy-img">
                                                    <img src={!_data.info || !_data.info.topic_info || !_data.info.topic_info.license_path ? "" : _data.info.topic_info.license_path}/>
                                                </div>
                                                <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.topic_info || !_data.info.topic_info.license_path ? "" : _data.info.topic_info.license_path)}
                                                   href="javescript:void(0)">查看原图</a>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>业务信息</Col>
                                    <Col span={18} offset={1}>
                                        <Row>
                                            <Col  span={2}>业务信息</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.business_info || !_data.info.business_info.bus_info ? "" : _data.info.business_info.bus_info}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2}>所属行业</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.business_info || !_data.info.business_info.industry ? "" : _data.info.business_info.industry}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2}>网站信息</Col>
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
                                            <Col  span={2}>运营者姓名</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_name ? "" : _data.info.operator_info.opt_name}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2}>所在地</Col>
                                            <Col span={18} offset={1}>
                                                {!_data.info || !_data.info.operator_info || !_data.info.operator_info.location ? "" : _data.info.operator_info.location}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2}>身份证号码</Col>
                                            <Col span={18} offset={1}></Col>
                                        </Row>
                                        <Row>
                                            <Col  span={4}><div className="grzz-img">
                                                <img src={!_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_p_path ? "" : _data.info.operator_info.opt_id_p_path}/>
                                            </div><div>持证照-正面
                                                <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_p_path ? "" : _data.info.operator_info.opt_id_p_path)}
                                                   href="javescript:void(0)">查看原图</a>
                                            </div></Col>
                                            <Col span={10} offset={1}><div className="grzz-img">
                                                <img src={!_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_b_path ? "" : _data.info.operator_info.opt_id_b_path}/>
                                            </div><div>持证照-反面
                                                <a onClick={(e) => this.showImg(e, !_data.info || !_data.info.operator_info || !_data.info.operator_info.opt_id_b_path ? "" : _data.info.operator_info.opt_id_b_path)}
                                                   href="javescript:void(0)">查看原图</a>
                                            </div></Col>
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
                                            {!_data.auth_status || !_data.auth_status.status ? "" :_data.auth_status.status}
                                        </Col>
                                    </Row>
                                    <Row style={{"display":!_data.auth_status ||_data.auth_status.status!="2"?"none":"block"}}>
                                        <Col className="text-right" span={2}>未通过原因</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.auth_status || !_data.auth_status.reason ? "" :_data.auth_status.reason}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>审核时间</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.auth_status || !parseInt(_data.auth_status.audit_time) ? "" :formatDataTime(data.auth_status.audit_time)}
                                        </Col>
                                    </Row>
                                </div>
                                <div className="dividing-line"></div>
                            </div>
                        </div>
                    :
                        <div>
                            <div className="block">
                                <div className="block-title"><h4>实名认证申请</h4></div>
                                <div className="dividing-line"></div>
                                <Row>
                                    <Col className="text-right" span={2}>申请类型</Col>
                                    <Col span={18} offset={1}>
                                        {!APPLAYTYPE[configData.checkInfoType]?configData.checkInfoType:APPLAYTYPE[configData.checkInfoType]}
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
                                    <Col className="text-right"  span={2}>所在地</Col>
                                    <Col span={18} offset={1}>
                                        {!_data.info || !_data.info.location ? "" : _data.info.location}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-right"  span={2}>身份证号码</Col>
                                    <Col span={18} offset={1}>
                                        {!_data.info || !_data.info.id_num ? "" : _data.info.id_num}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-right"  span={2}>网站信息</Col>
                                    <Col span={18} offset={1}>
                                        {!_data.info || !_data.info.web_site ? "" : _data.info.web_site}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center"  span={4}>
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
                                            {!_data.auth_status || !_data.auth_status.status ? "" :_data.auth_status.status}
                                        </Col>
                                    </Row>
                                    <Row style={{"display":!_data.auth_status ||_data.auth_status.status!="2"?"none":"block"}}>
                                        <Col className="text-right" span={2}>未通过原因</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.auth_status || !_data.auth_status.reason ? "" :_data.auth_status.reason}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-right" span={2}>审核时间</Col>
                                        <Col span={18} offset={1}>
                                            {!_data.auth_status || !parseInt(_data.auth_status.audit_time) ? "" :formatDataTime(data.auth_status.audit_time)}
                                        </Col>
                                    </Row>
                                </div>
                                <div className="dividing-line"></div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {"data":state.client.clientData.data,"query": state.client.clientData.query,"configData": state.configData.data}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        clearQuery: (...args) => dispatch(clearClientQuery(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        getAjaxData:(...args) => dispatch(getAjaxData(...args)),
        addTabData: (...args) => dispatch(addConfigData(...args)),
        addModalData:(...args) => dispatch(addModalData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientCheckListInfo)
