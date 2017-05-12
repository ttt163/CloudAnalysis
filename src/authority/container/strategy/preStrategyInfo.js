/**
 * Created by Liang on 2017/5/2.
 */
import React from 'react';
import { Link } from 'react-router'
import { Row , Col   , Button  , Icon , message  , Tabs   , Table , Modal , Alert , Transfer} from 'antd';
const TabPane = Tabs.TabPane;
//UserInfo本体
export default class authority_preStrategyInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                disabled:{
                    btn:'disabled'
                },
                transferShow:'hide',
                transferData: [],
                targetKeys: []
            },
            modalData:{
                ModalClass:'',
                title:'',
                visable:false,
                key:'1',
                type:'',
                text:''
            },
            tableData:{
                pagination:{},
                columns:[],
                data:[],
                rowSelection:{},
                selectedRowkeys:[],
                strategyInfo:{
                    name:'部门1',
                    remark:'该策略允许您管理后台管理平台所有用户及其权限、业务相关的信息。',
                    type:'预设策略'
                }
            }
        }
    }
    componentDidMount(){
        console.log(this.props.location.query)
    }
    deleteClick() {
        const {modalData , renderData } = this.state;
        modalData.visable = true;
        modalData.title = '解除关联';
        modalData.ModalClass='analysisBox';
        modalData.key=Math.random()
        renderData.transferShow='hide';
        modalData.type = 'delete';
        modalData.text = "解除关联策略后，此用户将失去该策略描述的所有权限";
        this.setState({
            modalData: modalData,
            renderData:renderData
        })
    }
    linkUserClick(){
        const { modalData ,renderData} = this.state;
        modalData.visable = true;
        modalData.key=Math.random();
        modalData.ModalClass='transferModal';
        modalData.title = '关联用户';
        modalData.type = 'link';
        renderData.transferShow='';
        this.setState({
            modalData: modalData,
            renderData:renderData
        });
        this.getMock();
    }
    unLinkUserClick(){
        const {modalData , renderData } = this.state;
        modalData.visable = true;
        modalData.title = '解除关联';
        modalData.ModalClass='analysisBox';
        modalData.key=Math.random()
        renderData.transferShow='hide';
        modalData.type = 'delete';
        modalData.text = "解除关联策略后，所选用户将失去该策略描述的所有权限";
        this.setState({
            modalData: modalData,
            renderData:renderData
        })
    }
    userInfoClick(e){
        this.context.router.push({
            pathname: '/authority_user/info',
            query: {
                name: $(e.target).text(),
                id:$(e.target).attr('data-id')
            }
        });
    }
    //穿梭Change
    transferHandleChange(targetKeys, direction, moveKeys){
        var renderData = this.state.renderData;
        renderData.targetKeys=targetKeys;
        console.log(targetKeys, direction, moveKeys);
        this.setState({ renderData:renderData });
    }
    //穿梭数据渲染
    getMock(filter){
        var  renderData  = this.state.renderData,data=[];
        for (let i = 0; i < 20; i++) {
            var _data = {
                key: i.toString(),
                name: `用户${i + 1}`
            };
            data.push(_data);
        }
        renderData.transferData=data;
        this.setState({
            renderData:renderData
        });
    }
    componentDidUpdate(){
        var that = this;
        //筛选点击
        $('.filterType').off().on('click',function(){
            if($(this).find('.filterBox').length==0){
                $(this).append('<div class="filterBox"><p>全部</p><p data-type="预设策略">预设策略</p><p data-type="自定义策略">自定义策略</p><div>');
            }
            $('.filterBox').find('p').off().on('click',function () {
                that.getMock($(this).attr('data-type'));
                $('.filterBox').remove();
            });
        });
        //隐藏筛选点击
        $(document).off().on('click',function (e) {
            if(!$(e.target).parent().hasClass('filterType')){
                $('.filterBox').remove();
            }
        });
    }
    //穿梭内item渲染
    renderItem (item){
        let   itemRender=(
            <span className="custom-item"><span>{item.name}</span></span>
        );
        return {
            label: itemRender,  // for displayed item
            value: item.name,   // for title and filter matching
        };
    }
    //数据渲染
    fetch(i){
        const columns = [{
            title: '关联用户',
            dataIndex: 'name',
            width:"80%",
            render:(data)=><div><a data-id={data.id} className="rml10" onClick={this.userInfoClick.bind(this)}>{data.name}</a></div>
        },{
            title: '操作',
            dataIndex: 'operate',
            render: (data) => <div><a className="rml10" data-name={data.name} onClick={this.deleteClick.bind(this,true)}>解除关联</a></div>,
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
                    name:{id:'dafsadf',name:`test${i}`},
                    operate:{id:'dafsadf',name:`test${i}`}
                }
            )
        }
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30']
        }
        const { tableData } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys,selectedRows) => {
                var {renderData , tableData , modalData }=this.state;
                if(selectedRowKeys.length>0){
                    renderData.disabled.btn="";
                }else{
                    renderData.disabled.btn="disabled";
                }
                tableData.selected=selectedRows;
                tableData.selectedRowkeys=selectedRowKeys;
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
        tableData.rowSelection=rowSelection;
        tableData.total=datas;
        tableData.columns=columns;
        tableData.data=data;
        tableData.pagination=pagination;
        this.setState({
            tableData:tableData
        });
    }
    //modalCLick
    confirmOKClick(){
        var { modalData }=this.state;
        switch (modalData.type){
            case 'delete':
                message.success('single delete submit');
                break;
            case "link":

                break;
        }
    }
    confirmCancel(){
        var { modalData }=this.state;
        modalData.visable=false;
        this.setState({
            modalData:modalData
        })
    }
    tabChange(key) {
        if(key=='2'){
            this.fetch(100);
        }
    }
    render(){
        const {renderData ,tableData , modalData}=this.state;
        return(
            <div className="tableContent analysisBox">
                <Row >
                    <Col className="infoTitle">
                        <Link to="/authority_strategy" className="backTopBtn"><Icon type="left"/>策略列表</Link>
                        <h3 className="infoTitleText">{this.props.location.query.name}</h3>
                    </Col>
                </Row>
                <Row className="rmt30 rpt30 rmb15">
                    <Col span={2} className="text-right"><h3>基本信息</h3></Col>
                </Row>
                <Row>
                    <Col span={2} className="text-right rmb30">策略:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.strategyInfo.name}</Col>
                    <Col span={2} className="text-right rmb30">备注:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.strategyInfo.remark}</Col>
                    <Col span={2} className="text-right rmb30">策略类型:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.strategyInfo.type}</Col>
                </Row>
                <Tabs className="rmt30" animated={false} onChange={this.tabChange.bind(this)} type="card">
                    <TabPane tab="策略权限" key="1">
                        <Row className="rmb15 rmt30">
                            <Col span={24}>
                                <Alert message="该策略允许您管理后台管理平台所有用户及其权限、业务相关的信息。" type="info" />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="关联用户" key="2">
                        <Row className="rmb15 rmt30">
                            <Col span={12} >
                                <Button type="primary" onClick={this.linkUserClick.bind(this)} className="blueBtn"><Icon type="link" />关联用户</Button>
                                <Button  onClick={this.unLinkUserClick.bind(this)} disabled={renderData.disabled.btn} className="grayBtn rml15"><Icon type="disconnect" />解除关联</Button>
                            </Col>
                        </Row>
                        <Table
                            rowSelection={tableData.rowSelection}
                            pagination={tableData.pagination}
                            columns={tableData.columns}
                            dataSource={tableData.data}
                        />
                        <div className="showTotal">
                            <span>已选 {tableData.selectedRowkeys.length} 项，共 {tableData.total} 项</span>
                        </div>
                    </TabPane>
                </Tabs>

                <Modal
                    title={modalData.title}
                    visible={modalData.visable}
                    key={modalData.key}
                    className={modalData.ModalClass}
                    onCancel={this.confirmCancel.bind(this)}
                    footer={<div className="text-center"><Button onClick={this.confirmOKClick.bind(this)} type="primary" className="blueBtn">确认</Button><Button onClick={this.confirmCancel.bind(this)} className="rml15 grayBtn">取消</Button></div>}
                >
                    {
                        modalData.type=='delete'?
                            <p>{modalData.text}</p>
                            :''
                    }
                    <div className={renderData.transferShow + " analysisBox rPositionR"}>
                        <Transfer
                            dataSource={renderData.transferData}
                            targetKeys={renderData.targetKeys}
                            titles={['用户列表', '已选择']}
                            showSearch
                            listStyle={{
                                width: 400,
                                height: 400,
                            }}
                            onChange={this.transferHandleChange.bind(this)}
                            render={this.renderItem.bind(this)}
                        />
                        <div className="transferTitle"><span style={{width:'32%'}}>用户</span></div>
                        <div className="transferTitle transferTitleRight"><span  style={{width:'32%'}}>用户</span></div>
                    </div>
                </Modal>
            </div>
        )
    }
}
authority_preStrategyInfo.contextTypes = {
    router: React.PropTypes.object
}