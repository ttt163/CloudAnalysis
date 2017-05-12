import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import { Row, Col,Input,Button,Select,DatePicker  } from 'antd';
import Footer from "../component/footer.pagination"
import {addConfigData} from "../../actions/action.config";
import moment from 'moment';
moment.locale('zh-cn');
const Option=Select.Option;
const {RangePicker } = DatePicker;
class OperateLog extends Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        const {addFilterData}=this.props;
        addFilterData({"filterShow":false});
    }
    render() {
        const {configData,addFilterData}=this.props;
        //console.log(this.props);
        return (
            <div>
                <h3 className="mb30">操作日志</h3>
                <div className="mb30" style={{"position":"relative"}}>
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"  />
                    <a className={!configData.filterShow?"log-filter":"log-filter active"} href="javascript:void(0)" onClick={()=>addFilterData({"filterShow":!configData.filterShow})}>筛选<i className={!configData.filterShow?"iconfont icon-down":"iconfont icon-up"}></i></a>
                    <div className="log-filter-cont" style={{"display":!configData.filterShow?"none":"block","top":"30px"}}>
                        <Row>
                            <Col className="text-right" span={2}>服务类型</Col>
                            <Col span={5}>
                                <Select style={{ width: "100%" }}>
                                <Option value="">不限</Option>
                                </Select>
                            </Col>
                            <Col className="text-right" span={2}>操作发起人</Col>
                            <Col span={5}>
                                <Select style={{ width: "100%" }}>
                                    <Option value="">不限</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={1} span={20}><div className="dividing-line"></div></Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={2}><Button className="btn-primary">查询</Button></Col>
                        </Row>
                    </div>
                </div>
                <div className="ant-table-body" style={{"minHeight":"560px"}}>
                    <table className="table">
                        <thead className="ant-table-thead">
                        <tr>
                            <th>操作内容</th>
                            <th><span>操作时间</span></th>
                            <th><span>操作发起人</span></th>
                        </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                        <tr className="ant-table-row  ant-table-row-level-0">
                            <td className="text-center" colSpan={3}>当前过滤条件下没有相应的操作日志记录</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <Footer />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {"configData": state.configData.data}
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addFilterData: (...args) => dispatch(addConfigData(...args))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(OperateLog)
