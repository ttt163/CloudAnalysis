import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import { Pagination,Row, Col } from 'antd';
import { pageSizeOptions } from '../../config';
import {addPageData,clearCheckData} from "../../actions/action.config";
class Footer extends Component{
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.dispatch(addPageData({"currPage":1,"pageSize":10,"total":0}));
    }
    changePage(current, pageSize){
        const {search,dispatch}=this.props;
        dispatch(clearCheckData());
        dispatch(addPageData({"currPage":current}));
        search({"page":current});
    }
    //页大小
    changeSize(current, pageSize){
        const {search,dispatch}=this.props;
        dispatch(clearCheckData());
        dispatch(addPageData({"pageSize":pageSize,"currPage":1}));
        search({"perpage":pageSize,"page":1});
    }
    render() {
        const {checkData,pageData}=this.props;
        return (
            <div className="cont-footer" style={{"display":!pageData.total?"none":"block"}}>
                <Row>
                    <Col span={6}>已选{!checkData||!checkData.length?0:checkData.length}项，共{pageData.total<pageData.pageSize?pageData.total:pageData.pageSize}项</Col>
                    <Col span={18}>
                        {!pageData.total?"":
                            <Pagination pageSizeOptions={pageSizeOptions}
                                        onChange={(current, pageSize)=>this.changePage(current, pageSize)}
                                        showSizeChanger
                                        onShowSizeChange={(current, pageSize)=>this.changeSize(current, pageSize)}
                                        current={pageData.currPage}
                                        size={pageData.pageSize}
                                        total={pageData.total} />
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        "configData":state.configData.data,
        "pageData":state.configData.pageData
    }
}
export default connect(mapStateToProps)(Footer)