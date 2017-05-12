//import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import {IP,formatDataTime,KEYSTATUS} from "../../config"
import {addConfigData,getAjaxData} from "../../actions/action.config"
import {addClientData} from "../../actions/action.client"
import { Row, Col,Input,Button,Select  } from 'antd';
class ClientKeyInfo extends Component {
    constructor(props) {
        super(props);
    }
    getKeyInfo(){
        const {getAjaxData,addData,location}=this.props;
       // console.log(this.props);
        var _query=location.query;
        getAjaxData({"url":`${IP}/customer/index/keyIndex`,"sendData":{"id":_query.id}},false,addData);
    }
    upDateKeyInfo(){
        const {getAjaxData,addData,location}=this.props;
        var _query=location.query;
        getAjaxData({"url":`${IP}/customer/index/keyReset`,"sendData":{"id":_query.id,"username":_query.name}},true,addData);
    }
    componentDidMount() {
        this.getKeyInfo();
    }

    componentWillUnmount() {
        const {addData,addConfigData}=this.props;
        addData({"data":{}});
        addConfigData({"showKeyPwd":false});
    }
    render() {
        const {configData,data,addConfigData}=this.props;
        let _data=data.data;
        return (
            <div style={{"display":configData.tabIndex=="1"?"block":"none"}}>
                <div className="block-title"><h4>密钥管理</h4></div>
                <p style={{"width": "615px", "margin": "25px 10px","lineHeight": "28px"}}>
                    一个账户最多拥有俩对密钥（Access/Secret Key);更换密钥时，请创建第二个密钥；删除密钥前须停
                    用；出于安全考虑，建议您周期性地更换密钥。您可以查看更多<a href="javascript:void(0)">安全使用密钥建议。</a>
                </p>
                <div className="ant-table-body">
                    <table className="table">
                        <thead className="ant-table-thead">
                        <tr>
                            <th>创建时间</th>
                            <th><span>AccessKey/SecretKey</span></th>
                            <th><span>状态</span></th>
                            <th><span>操作</span></th>
                        </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                        {
                            !data.code||!_data?
                                <tr className="ant-table-row  ant-table-row-level-0">
                                    <td className="text-center" colSpan={4}>暂无相关数据！</td>
                                </tr>
                                    :
                                <tr className="ant-table-row  ant-table-row-level-0">
                                    <td>{!_data.created_at?"":formatDataTime(_data.created_at)}</td>
                                    <td>
                                        <Row className="mb15">
                                            <Col  span={2} className="lh32">AK:</Col>
                                            <Col span={18}>
                                                <Input className="h32" disabled
                                                       value={!_data.accesskey?"":_data.accesskey} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  span={2} className="lh32">SK:</Col>
                                            <Col span={18}>
                                                <Input type={!configData.showKeyPwd?"password":"text"} className="h32"
                                                       value={!_data.secertkey?"":_data.secertkey} disabled
                                                       suffix={<span className="showpsw" onClick={()=>addConfigData({"showKeyPwd":true})}>显示</span>}
                                                />
                                            </Col>
                                        </Row>
                                    </td>
                                    <td style={{"color":"#5fc13b"}}>{!_data.status?"":!KEYSTATUS[_data.status]?_data.status:KEYSTATUS[_data.status]}</td>
                                    <td><Button  className="btn-orange" onClick={()=>this.upDateKeyInfo()}>更新</Button></td>
                                </tr>
                        }

                        </tbody>
                    </table>
                </div>

            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {
        "data":state.client.clientData.data,
        "configData": state.configData.data,}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addData: (...args) => dispatch(addClientData(...args)),
        addConfigData: (...args) => dispatch(addConfigData(...args)),
        getAjaxData:(...args) => dispatch(getAjaxData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ClientKeyInfo)
