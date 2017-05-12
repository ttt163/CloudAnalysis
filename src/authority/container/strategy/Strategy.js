/**
 * Created by Liang on 2017/4/24.
 */
import React from 'react';
import { Row , Col ,Input  , Alert , Table , Tabs , Button , Icon , Modal , Checkbox , message} from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
export default class authority_Strategy extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                disabled:{
                    btn:'disabled'
                },
                tabsActive:'1',
                selects:[0],
                user:[],
                role:[{id:'1',name:'部门主管'},{id:'2',name:'普通员工'}]
            },
            tableData:{
                preSetting:{
                    total:0,
                    pagination:{},
                    data:[],
                    columns:[],
                },
                cusSetting:{
                    total:0,
                    pagination:{},
                    data:[],
                    columns:[],
                    rowSelection:{},
                    selectedRowkeys:[],
                    selected:[]
                }
            },
            modalData:{
                key:0,
                type:'single',
                title:'删除操作',
                confirmText: '',
                visable: false,
                multiSelectedRowkeys:[]
            }
        }
    }
    //预设策略详情点击
    preInfoClick(e){
        this.context.router.push({
            pathname:'/authority_strategyPre/info',
            query:{
                name:$(e.target).text(),
                id:$(e.target).attr('data-id')
            }
        })
    }
    //自定义策略详情点击
    cusInfoClick(e){
        this.context.router.push({
            pathname:'/authority_strategyCus/info',
            query:{
                name:$(e.target).text(),
                id:$(e.target).attr('data-id')
            }
        })
    }
    //tab变化
    tabChange(key) {
        var { renderData }=this.state;
        renderData.tabsActive=key;
        this.setState({ renderData })
        if(key=='1'){
            this.preFetch(200);
        }else{
            this.cusFetch(200);
        }
    }
    //删除自定义策略
    deleteCusStrategy(single,e){
        console.log(single);
        const { renderData , tableData , modalData } = this.state;
        if(single){
            modalData.type='single';
        }else{
            modalData.type='multi';
        }
        modalData.visable=true;
        modalData.key=Math.random();
        this.setState({
            modalData
        })
    }
    //新建自定义策略
    createCusStrategyClick(){
        this.context.router.push('/authority_strategyCus/add');
    }
    //modal点击
    confirmOKClick(){
        message.success('Modal Submit Click');
    }
    confirmCancel(){
        var modalData=this.state.modalData;
        modalData.visable=false;
        this.setState({
            modalData:modalData
        })
    }
    //取消多条删除里面的item
    multiModalCheck(key,e){
        var { renderData , tableData , modalData }=this.state;
        if(!e.target.checked){
            var selecteds=modalData.multiSelectedRowkeys;
            selecteds=selecteds.concat();
            var index=selecteds.indexOf(key);
            selecteds.splice(index,1);
            modalData.multiSelectedRowkeys=selecteds;
        }else{
            modalData.multiSelectedRowkeys.push(key);
        }
        this.setState({
            renderData:renderData,
            tableData:tableData,
            modalData:modalData
        });
        console.log('multi:'+modalData.multiSelectedRowkeys);
        console.log('table:'+tableData.cusSetting.selectedRowkeys);
    }
    //数据渲染
    preFetch(i){
        const columns = [{
            title: '策略名称',
            dataIndex: 'name',
            render: (text) => <a data-id={i}  onClick={this.preInfoClick.bind(this)}>{text}</a>
        }, {
            title: '备注',
            dataIndex: 'remark'
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
                    name:`部门${i}`,
                    remark:'123123213'
                }
            )
        }
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30','50','100']
        }
        const { tableData } = this.state;
        tableData.preSetting.total=data.length;
        tableData.preSetting.columns=columns;
        tableData.preSetting.data=data;
        tableData.preSetting.pagination=pagination;
        this.setState({
            tableData:tableData
        });
    }
    cusFetch(i){
        const columns = [{
            title: '策略名称',
            dataIndex: 'name',
            render: (data) => <a data-id={data.id}  onClick={this.cusInfoClick.bind(this)}>{data.name}</a>
        }, {
            title: '备注',
            dataIndex: 'remark'
        },{
            title: '创建时间',
            dataIndex: 'time'
        },{
            title: '操作',
            dataIndex: 'operate',
            render: (data) => <a data-id={data.id} data-name={data.name}  onClick={this.deleteCusStrategy.bind(this,true)}>删除</a>
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
                    name:{name:`自定义策略${i}`,id:"123"},
                    remark:'123123213',
                    time:"2017-01-01 21:01:01",
                    operate:{name:`自定义策略${i}`,id:"123"}
                }
            )
        }
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30','50','100']
        }
        const rowSelection = {
            onChange: (selectedRowKeys,selectedRows) => {
                var {renderData , tableData , modalData }=this.state;
                if(selectedRowKeys.length>0){
                    renderData.disabled.btn="";
                }else{
                    renderData.disabled.btn="disabled";
                }
                tableData.cusSetting.selected=selectedRows;
                tableData.cusSetting.selectedRowkeys=selectedRowKeys;
                modalData.multiSelectedRowkeys=selectedRowKeys;
                this.setState({
                    renderData:renderData,
                    tableData:tableData,
                    modalData:modalData
                });
                console.log(this.state.modalData.multiSelectedRowkeys);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
            }),
        };
        const { tableData } = this.state;
        tableData.cusSetting.total=data.length;
        tableData.cusSetting.columns=columns;
        tableData.cusSetting.data=data;
        tableData.cusSetting.rowSelection=rowSelection;
        tableData.cusSetting.pagination=pagination;
        this.setState({
            tableData:tableData
        });
    }
    componentDidMount(){
        console.log(this.props.location.query.key)
        if(this.props.location.query.key!=undefined){
            var { renderData }=this.state;
            renderData.tabsActive=this.props.location.query.key;
            this.setState({ renderData })
        }
        if(this.state.renderData.tabsActive=='1'){
            this.preFetch(200);
        }else{
            this.cusFetch(200);
        }
    }
    render(){
        const { tableData , renderData , modalData  } = this.state;
        const that = this;
        return(
            <div className="tableContent analysisBox">
                <Row className="rmb20">
                    <Col span={24}>
                        <h3>策略管理</h3>
                    </Col>
                </Row>
                <Alert message="用户或者用户组与策略关联后，即可获得策略所描述的操作权限。" type="info" />
                <Tabs className="rmt30" activeKey={renderData.tabsActive} animated={false} onChange={this.tabChange.bind(this)} type="card">
                    <TabPane tab="预设策略" key="1">
                        <Row className="rmb15 rmt30">
                            <Col span={24}>
                                <Search
                                    placeholder="请输入策略名称进行搜索"
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
                        <Table  pagination={tableData.preSetting.pagination}  columns={tableData.preSetting.columns} dataSource={tableData.preSetting.data} />
                    </TabPane>
                    <TabPane tab="自定义策略" key="2">
                        <Row className="rmb15 rmt30">
                            <Col span={12}>
                                <Button size="large" onClick={this.createCusStrategyClick.bind(this)}  className="blueBtn" type="primary"><Icon type="plus"/>新建自定义策略</Button>
                                <Button size="large" onClick={this.deleteCusStrategy.bind(this,false)} disabled={this.state.renderData.disabled.btn} className="rml15 grayBtn "><Icon type="delete"/>删除</Button>
                            </Col>
                            <Col span={12}>
                                <Search
                                    placeholder="请输入策略名称进行搜索"
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
                        <Table rowSelection={tableData.cusSetting.rowSelection}  pagination={tableData.cusSetting.pagination}  columns={tableData.cusSetting.columns} dataSource={tableData.cusSetting.data} />
                        <div className="showTotal">
                            <span>已选 {tableData.cusSetting.selectedRowkeys.length} 项，共 {tableData.cusSetting.total} 项</span>
                        </div>
                    </TabPane>
                </Tabs>
                <Modal
                    title={modalData.title}
                    visible={modalData.visable}
                    key={modalData.key}
                    onCancel={this.confirmCancel.bind(this)}
                    className="analysisBox"
                    footer={<div className="text-center"><Button onClick={this.confirmOKClick.bind(this)} type="primary" className="blueBtn">确认</Button><Button onClick={this.confirmCancel.bind(this)} className="rml15 grayBtn">取消</Button></div>}
                >
                    <div className="ant-modal-body">
                        {
                            modalData.type=='single'?
                                <Row>
                                    <p>确定删除此策略？</p>
                                </Row>:
                                <Row>
                                    <h3 className="rmb30 rml10" style={{textAlign:'left'}}>{'已选择' + modalData.multiSelectedRowkeys.length + '个自定义策略，详情如下:'}</h3>
                                    {
                                        tableData.cusSetting.selected.map(function(value,index){
                                            return (
                                                <Col className="rmb15" key={index} span={8}>
                                                    <Checkbox  defaultChecked={true}  onChange={that.multiModalCheck.bind(that,value.key)}>{value.name.name}</Checkbox>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}
authority_Strategy.contextTypes = {
    router: React.PropTypes.object
}