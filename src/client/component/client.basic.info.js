import React,{Component} from 'react';
import {IP,formatDataTime,CLIENTTYPE,AUTHENTICATETYPE} from "../../config"
import { render } from 'react-dom';
import {connect} from 'react-redux';
import { Row, Col,Input,Button,Select  } from 'antd';
import img1 from "../image/img-1.png"
import img2 from "../image/img-2.png"
import img3 from "../image/img-3.png"
import {addModalData} from "../../actions/action.modal";
import {getAjaxData} from "../../actions/action.config"
import {addClientData} from "../../actions/action.client"
class ClientBasicInfo extends Component {
    constructor(props) {
        super(props);
    }
    showImg(e,img){
        const {addModalData1}=this.props;
        var imgObj=new Image();
        imgObj.src=img;
        addModalData1({"left":e.clientX,"top":e.clientY-imgObj.height<70?70:e.clientY-imgObj.height,"imgModal":true,"imgSrc":img});
    }
    getBasicInfo(){
        const {getAjaxData,addData,location}=this.props;
        var _query=location.query;
        getAjaxData({"url":`${IP}/customer/index/baseInfo`,"sendData":{"id":_query.id,"cus_type":_query.type}},false,addData);
    }
    componentDidMount() {
        this.getBasicInfo();
    }

    componentWillUnmount() {
        const {addData}=this.props;
        addData({"data":{}});
    }
    render() {
        const {configData,location,data}=this.props;
        let query=location.query,_data=data.data;
        return (
           <div style={{"display":configData.tabIndex=="0"?"block":"none"}}>
               {!data.code||!_data.length?
                   <div>
                       <div style={{"textAlign": "center","padding": "30px 0px"}}>暂无相关数据！</div>
                       <div className="dividing-line"></div>
                   </div>
                   :
                   <div>
                       <div className="block">
                           <div className="block-title"><h4>账户信息</h4></div>

                           <Row>
                               <Col className="text-right" span={2}>邮箱</Col>
                               <Col span={18} offset={1}>{!_data.account_info||!_data.account_info.email?"":_data.account_info.email}</Col>
                           </Row>
                           <Row>
                               <Col className="text-right" span={2}>手机</Col>
                               <Col span={18} offset={1}>{!_data.account_info||!_data.account_info.phone?"":_data.account_info.phone}</Col>
                           </Row>
                           <Row>
                               <Col className="text-right" span={2}>账户注册时间</Col>
                               <Col span={18} offset={1}>{!_data.account_info||!parseInt(_data.account_info.register_time)?"":formatDataTime(_data.account_info.register_time)}</Col>
                           </Row>
                       </div>
                       <div className="block">
                           <div className="block-title"><h4>个人信息</h4></div>
                           <div className="dividing-line"></div>
                           <Row>
                               <Col className="text-right" span={2}>昵称</Col>
                               <Col span={18} offset={1}>
                                   {!_data.personal_info||!_data.personal_info.nickname?"":_data.personal_info.nickname}
                                   </Col>
                           </Row>
                           <Row>
                               <Col className="text-right" span={2}>联系地址</Col>
                               <Col span={18} offset={1}>
                                   {!_data.personal_info||!_data.personal_info.address?"":_data.personal_info.address}
                               </Col>
                           </Row>
                           <Row>
                               <Col className="text-right" span={2}>QQ</Col>
                               <Col span={18} offset={1}>
                                   {!_data.personal_info||!_data.personal_info.qq?"":_data.personal_info.qq}
                               </Col>
                           </Row>
                           <Row>
                               <Col className="text-right" span={2}>个人网站</Col>
                               <Col span={18} offset={1}>
                                   {!_data.personal_info||!_data.personal_info.site?"":_data.personal_info.site}
                               </Col>
                           </Row>
                       </div>
                       {query.type=="2"?
                           <div className="block">
                               <div className="block-title"><h4>实名认证信息</h4></div>
                               <div className="dividing-line"></div>
                               <Row>
                                   <Col className="text-right" span={2}>客户类型</Col>
                                   <Col span={18} offset={1}>{!CLIENTTYPE[query.type]?query.type:CLIENTTYPE[query.type]}</Col>
                               </Row>
                               <Row>
                                   <Col className="text-right" span={2}>通过实名认证时间 </Col>
                                   <Col span={18} offset={1}>
                                       {!_data.auth_info||!parseInt(_data.auth_info.auth_pass_time)?"": formatDataTime(_data.auth_info.auth_pass_time)}
                                       </Col>
                               </Row>
                               <div className="dividing-line"></div>
                               <Row>
                                   <Col className="text-right" span={2}>认证方式</Col>
                                   <Col span={18} offset={1}>{!_data.auth_info||!_data.auth_info.auth_type?"":!AUTHENTICATETYPE[_data.auth_info.auth_type]?_data.auth_info.auth_type:AUTHENTICATETYPE[_data.auth_info.auth_type]}</Col>
                               </Row>
                               <div className="dividing-line"></div>
                               <Row>
                                   <Col className="text-right" span={2}>主题信息</Col>
                                   <Col span={18} offset={1}>
                                       <Row>
                                           <Col  span={2}>企业名称</Col>
                                           <Col span={18} offset={1}>
                                               {!_data.auth_info||!_data.auth_info.topic_info||!_data.auth_info.topic_info.name?"":_data.auth_info.topic_info.name}
                                               </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={2}>企业信用代码</Col>
                                           <Col span={18} offset={1}>
                                               {!_data.auth_info||!_data.auth_info.topic_info||!_data.auth_info.topic_info.code?"":_data.auth_info.topic_info.code}
                                           </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={2}>企业地址</Col>
                                           <Col span={18} offset={1}>
                                               {!_data.auth_info||!_data.auth_info.topic_info||!_data.auth_info.topic_info.enterprise_address?"":_data.auth_info.topic_info.enterprise_address}
                                           </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={2}>执照扫描件</Col>
                                           <Col span={18} offset={1}><div className="yy-img">
                                               <img src={!_data.auth_info||!_data.auth_info.topic_info||!_data.auth_info.topic_info.license_path?"":_data.auth_info.topic_info.license_path}/>
                                           </div>
                                               <a onClick={(e)=>this.showImg(e,!_data.auth_info||!_data.auth_info.topic_info||!_data.auth_info.topic_info.license_path?"":_data.auth_info.topic_info.license_path)} href="javescript:void(0)">查看原图</a>
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
                                               {!_data.auth_info||!_data.auth_info.business_info||!_data.auth_info.business_info.bus_info?"":_data.auth_info.business_info.bus_info}
                                           </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={2}>所属行业</Col>
                                           <Col span={18} offset={1}>
                                               {!_data.auth_info||!_data.auth_info.business_info||!_data.auth_info.business_info.industry?"":_data.auth_info.business_info.industry}
                                           </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={2}>网站信息</Col>
                                           <Col span={18} offset={1}>
                                               {!_data.auth_info||!_data.auth_info.business_info||!_data.auth_info.business_info.site?"":_data.auth_info.business_info.site}
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
                                               {!_data.auth_info||!_data.auth_info.operator_info||!_data.auth_info.operator_info.opt_name?"":_data.auth_info.operator_info.opt_name}
                                           </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={2}>所在地</Col>
                                           <Col span={18} offset={1}>
                                               {!_data.auth_info||!_data.auth_info.operator_info||!_data.auth_info.operator_info.location?"":_data.auth_info.operator_info.location}
                                           </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={2}>身份证号码</Col>
                                           <Col span={18} offset={1}>
                                               {!_data.auth_info||!_data.auth_info.operator_info||!_data.auth_info.operator_info.id_number?"":_data.auth_info.operator_info.id_number}
                                           </Col>
                                       </Row>
                                       <Row>
                                           <Col  span={4}><div className="grzz-img">
                                               <img src={!_data.auth_info||!_data.auth_info.operator_info||!_data.auth_info.operator_info.identity_positive_path?"":_data.auth_info.operator_info.identity_positive_path}/>
                                           </div><div>持证照-正面
                                               <a onClick={(e)=>this.showImg(e,!_data.auth_info||!_data.auth_info.operator_info||!_data.auth_info.operator_info.identity_positive_path?"":_data.auth_info.operator_info.identity_positive_path)} href="javescript:void(0)">查看原图</a></div></Col>
                                           <Col span={10} offset={1}><div className="grzz-img">
                                               <img src={!_data.auth_info||!_data.auth_info.operator_info||!_data.auth_info.operator_info.identity_back_path?"":_data.auth_info.operator_info.identity_back_path}/>
                                           </div><div>持证照-反面
                                               <a onClick={(e)=>this.showImg(e,!_data.auth_info||!_data.auth_info.operator_info||!_data.auth_info.operator_info.identity_back_path?"":_data.auth_info.operator_info.identity_back_path)} href="javescript:void(0)">查看原图</a></div></Col>
                                       </Row>
                                   </Col>
                               </Row>
                               <div className="dividing-line"></div>
                           </div>
                           :
                           <div>
                               <div className="block">
                                   <div className="block-title"><h4>实名认证信息</h4></div>
                                   <div className="dividing-line"></div>
                                   <Row>
                                       <Col className="text-right" span={2}>客户类型</Col>
                                       <Col span={18} offset={1}>{!CLIENTTYPE[query.type]?query.type:CLIENTTYPE[query.type]}</Col>
                                   </Row>
                                   <Row>
                                       <Col className="text-right" span={2}>通过实名认证时间 </Col>
                                       <Col span={18} offset={1}>
                                           {!_data.auth_info||!parseInt(_data.auth_info.auth_pass_time)?"": formatDataTime(_data.auth_info.auth_pass_time)}
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col className="text-right" span={2}>真实姓名</Col>
                                       <Col span={18} offset={1}>
                                           {!_data.auth_info||!_data.auth_info.real_name?"": _data.auth_info.real_name}

                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col className="text-right"  span={2}>所在地</Col>
                                       <Col span={18} offset={1}>
                                           {!_data.auth_info||!_data.auth_info.location?"": _data.auth_info.location}

                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col className="text-right"  span={2}>身份证号码</Col>
                                       <Col span={18} offset={1}>
                                           {!_data.auth_info||!_data.auth_info.id_number?"": _data.auth_info.id_number}

                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col className="text-right"  span={2}>网站信息</Col>
                                       <Col span={18} offset={1}>
                                           {!_data.auth_info||!_data.auth_info.web_site?"": _data.auth_info.web_site}
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col className="text-center"  span={4}><div className="grzz-img">
                                           <img src={!_data.auth_info||!_data.auth_info.identity_positive_path?"": _data.auth_info.identity_positive_path} /></div><div>持证照-正面
                                           <a href="javescript:void(0)" onClick={(e)=>this.showImg(e,!_data.auth_info||!_data.auth_info.identity_positive_path?"": _data.auth_info.identity_positive_path)}>查看原图</a></div></Col>
                                       <Col span={10} offset={1}><div className="grzz-img">
                                           <img src={!_data.auth_info||!_data.auth_info.identity_back_path?"": _data.auth_info.identity_back_path} /></div><div>持证照-反面
                                           <a href="javescript:void(0)" onClick={(e)=>this.showImg(e,!_data.auth_info||!_data.auth_info.identity_back_path?"": _data.auth_info.identity_back_path)}>查看原图</a></div></Col>
                                   </Row>
                               </div>
                           </div>
                       }
                   </div>
               }


           </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        "data":state.client.clientData.data,
        "configData": state.configData.data}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addModalData1: (...args) => dispatch(addModalData(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        getAjaxData:(...args) => dispatch(getAjaxData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientBasicInfo)
