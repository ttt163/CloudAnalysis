//import "../client.css"
import {IP, formatDataTime, logDefDay, SERVICETYPE, IPREG} from "../../config"
import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {Row, Col, Input, Button, Select, DatePicker} from 'antd';
import Footer from "./footer.pagination"
import {addConfigData, ajaxSearch} from "../../actions/action.config";
import {addClientQuery, clearClientQuery, addClientData} from "../../actions/action.client"
import {setFormFields, validateField, validateFormFields, delForm} from "../../validate/validateForm"
import ValidateItem from "../../validate/validate.item"
import moment from 'moment';
moment.locale('zh-cn');
const Option = Select.Option;
const {RangePicker} = DatePicker;
var serviceTypeOpt = [];
for (let [key, value] of Object.entries(SERVICETYPE)) {
    serviceTypeOpt.push(<Option key={key}>{value}</Option>);
}
class ClientLogInfo extends Component {
    constructor(props) {
        super(props);
    }

    changeDateTime(date, str) {
        const {addQuery} = this.props;
        addQuery({"start": str[0], "end": str[1]});
        //this.search({"start":str[0],"end":str[1]});
    }

    changeQueryData(data) {
        const {addQuery} = this.props;
        addQuery({...data});
    }

    search(queryObj, pageObj) {
        const {query, ajaxSearch, addData, pageData} = this.props;
        var pageObj = !pageObj ? {} : pageObj, queryObj = !queryObj ? {} : queryObj;
        var sendQuery = {};
        for (let [key, value] of Object.entries({...query, ...queryObj})) {
            if (value != "") {
                sendQuery = {...sendQuery, [key]: value};
            }
        }
        var _data = {
            "url": `${IP}/customer/index/cuslogs`, "sendData": {
                "page": pageData.currPage,
                "perpage": pageData.pageSize,
                "query": {...sendQuery},
                ...pageObj
            }
        };
        ajaxSearch(_data, addData);
        /* "query":{
         "cus_type":!query.cus_type?"":query.cus_type,
         "name":!query.name?"":query.name,
         "account":!query.account?"":query.account,
         "acc_status":!query.acc_status?"":query.acc_status,
         "product":!query.product?"":query.product
         }*/
    }

    subSearch() {
        const {addFilterData, query} = this.props;
        var isValidate = validateField("logForm", "ip", query.ip);
        console.log(isValidate);
        if (!isValidate) {
            return;
        }
        this.search();
        addFilterData({"filterShow": false})
    }

    componentDidMount() {
        const {addQuery} = this.props;
        let endTime = parseInt(new Date().getTime() / 1000), startTime = endTime - logDefDay * 24 * 60 * 60;
        addQuery({"type": "0", "start": formatDataTime(startTime), "end": formatDataTime(endTime)});
        this.search({"type": "0", "start": formatDataTime(startTime), "end": formatDataTime(endTime)});
        setFormFields("logForm", {
            "ip": {
                "rule": {"regexp": IPREG},
                "msg": {"regexp": "IP格式错误！"}
            }
        });
    }

    componentWillUnmount() {
        const {addFilterData, clearQuery, addData} = this.props;
        addFilterData({"filterShow": false});
        clearQuery();
        addData({"list": []});
        delForm("logForm");
    }

    render() {
        const {configData, addFilterData, list, query, checkData,validatorForm} = this.props;
        let dateFormat = "YYYY-MM-DD HH:mm:ss";
        return (
            <div style={{"display": configData.tabIndex == "3" ? "block" : "none"}}>
                <div className="mb30" style={{"position": "relative"}}>
                    <RangePicker
                        allowClear={false}
                        value={!query.start || !query.end ? "" : [moment(query.start, dateFormat), moment(query.end, dateFormat)]}
                        onChange={(date, str) => this.changeDateTime(date, str)}
                        onOk={() => this.search()}
                        showTime format="YYYY-MM-DD HH:mm:ss"/>
                    {/* <DatePicker
                     showTime
                     format="YYYY-MM-DD HH:mm:ss"
                     placeholder="Start"
                     />至
                     <DatePicker
                     showTime
                     format="YYYY-MM-DD HH:mm:ss"
                     placeholder="End"
                     />*/}
                    <a className={!configData.filterShow ? "log-filter" : "log-filter active"} href="javascript:void(0)"
                       onClick={() => addFilterData({"filterShow": !configData.filterShow})}>筛选<i
                        className={!configData.filterShow ? "iconfont icon-down" : "iconfont icon-up"}></i></a>
                    <div className="log-filter-cont"
                         style={{"display": !configData.filterShow ? "none" : "block", "top": "30px"}}>
                        <Row>
                            <Col className="text-right lh32" span={2}>服务类型</Col>
                            <Col span={5}>
                                <Select style={{width: "100%"}}
                                        value={!query.type ? "0" : query.type}
                                        onChange={(val) => this.changeQueryData({"type": val})}
                                >
                                    <Option value="0">不限</Option>
                                    {serviceTypeOpt}
                                </Select>
                            </Col>
                            <Col className="text-right lh32" span={2}>IP</Col>
                            <Col span={5}>
                                <ValidateItem validatorForm={validatorForm} thisForm="logForm" field="ip">
                                    <Input value={!query.ip ? "" : query.ip}
                                           onChange={(e) => {
                                               validateField("logForm", "ip", e.target.value, this.changeQueryData({"ip": e.target.value}))
                                           }}/>
                                </ValidateItem>
                            </Col>
                            <Col className="text-right lh32" span={2}>操作记录</Col>
                            <Col span={5}><Input
                                value={!query.operation ? "" : query.operation}
                                onChange={(e) => this.changeQueryData({"operation": e.target.value})}
                            /></Col>
                        </Row>
                        <Row>
                            <Col offset={1} span={20}>
                                <div className="dividing-line"></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" span={2}>
                                <Button onClick={() => this.subSearch()} className="btn-primary">查询</Button></Col>
                        </Row>
                    </div>
                </div>
                <div className="ant-table-body" style={{"minHeight": "450px"}}>
                    <table className="table">
                        <thead className="ant-table-thead">
                        <tr>
                            <th>IP</th>
                            <th><span>操作记录</span></th>
                            <th><span>服务类型</span></th>
                            <th><span>操作时间</span></th>
                        </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                        {!list.length ?
                            <tr className="ant-table-row  ant-table-row-level-0">
                                <td className="text-center" colSpan={4}>当前过滤条件下没有相应的操作日志记录</td>
                            </tr>
                            :
                            list.map((item, index) =>
                                <tr key={index} className="ant-table-row  ant-table-row-level-0">
                                    <td>{!item.ip ? "" : item.ip}</td>
                                    <td style={{"width": "60%"}}>{!item.operation ? "" : item.operation}</td>
                                    <td>{!item.type ? "" : !SERVICETYPE[item.type] ? item.type : SERVICETYPE[item.type]}</td>
                                    <td>{!parseInt(item.created_at) ? "" : formatDataTime(item.created_at)}</td>
                                </tr>
                            )
                        }

                        </tbody>
                    </table>
                </div>
                <Footer search={(obj) => this.search(obj)} checkData={checkData}/>
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {
        "query": state.client.clientData.query,
        "list": state.client.clientData.list,
        "configData": state.configData.data,
        "pageData": state.configData.pageData,
        "checkData": state.configData.data.chkData,
        "validatorForm": state.validatorForm
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        clearQuery: (...args) => dispatch(clearClientQuery(...args)),
        addQuery: (...args) => dispatch(addClientQuery(...args)),
        addData: (...args) => dispatch(addClientData(...args)),
        addFilterData: (...args) => dispatch(addConfigData(...args)),
        ajaxSearch: (...args) => dispatch(ajaxSearch(...args)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientLogInfo)
