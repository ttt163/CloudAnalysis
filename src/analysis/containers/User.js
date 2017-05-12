import React from 'react';
import { Row , Col  , Input , Table } from 'antd';
const Search = Input.Search;
export default class analysis_User extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                tableData:{
                    total:0,
                    pagination:{},
                    data:[],
                    columns:[]
                }
            }
        }
    }
    goToConsole(){
        console.log('click go to console ');
    }
    //数据渲染
    fetch(i){
        const columns = [{
            title: '客户账户',
            dataIndex: 'account'
        }, {
            title:'公司名称',
            dataIndex:'company'
        },{
            title: '操作',
            dataIndex: 'operate',
            render: () => <div><a onClick={this.goToConsole.bind(this)}>进入管理控制台</a></div>,
        }];
        const data = [];
        var datas=100
        if(i!=undefined){
            datas=i
        }
        for(var i=0;i<datas;i++){
            data.push(
                {
                    key:i,
                    account:`asdfas${i}df@163.com`,
                    company:`Gosun${i}`,
                    operate:true
                }
            )
        }
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30','50','100']
        }
        let renderData=this.state.renderData;
        renderData.tableData.columns=columns;
        renderData.tableData.total=data.length;
        renderData.tableData.data=data;
        renderData.tableData.pagination=pagination;
        this.setState({
            renderData:renderData
        });
    }
    componentDidMount(){
        this.fetch(100)
    }
    render(){
        return(
            <div className="tableContent analysisBox">
                <Row className="rmb20">
                    <Col span={24}>
                        <h3>用户管理</h3>
                    </Col>
                </Row>
                <Row className="rmb30">
                    <Col span={12}>

                    </Col>
                    <Col span={12}>
                        <Search
                            placeholder="请输入客户账号或公司名称进行搜索"
                            style={{width:300,float:'right'}}
                            className="fetchInput"
                            onSearch={
                                function(value){
                                    console.log(value);
                                }.bind(this)
                            }
                        />
                    </Col>
                </Row>
                <Table pagination={this.state.renderData.tableData.pagination}  columns={this.state.renderData.tableData.columns} dataSource={this.state.renderData.tableData.data} />
            </div>
        )
    }
}
