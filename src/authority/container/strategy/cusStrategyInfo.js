/**
 * Created by Liang on 2017/5/2.
 */
import React from 'react';
import { Row , Col , Input  , Button  , Icon , message  , Alert , Form  , Table , Modal ,Tabs , Transfer , Popover , Switch } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class infoForm extends React.Component{
    constructor(props){
        super(props);
    }
    submitClick(){
        let that = this.props.that;
        var { tableData }=that.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                tableData.strategyInfo.name=values.name;
                tableData.strategyInfo.remark=values.remark;
                that.setState({tableData});
                message.success('form submit click');
                console.log(that.state.tableData);
            }
        });
    }
    cancelClick(){
        let that = this.props.that;
        let renderData = that.state.renderData;
        renderData.editFlag=false;
        that.setState({
            renderData:renderData
        })
    }
    render(){
        const { getFieldDecorator} = this.props.form;
        const that = this.props.that;
        const { tableData } = that.state;
        return(
            <Form onSubmit={this.submitClick.bind(this)} className="login-form">
                <FormItem
                    labelCol={{ span : 2 }}
                    wrapperCol={{ span : 8 }}
                    label="策略名称:"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入策略名'}],
                        initialValue:tableData.strategyInfo.name
                    })(
                        <Input type="text"  placeholder="请输入策略名" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 2 }}
                    wrapperCol={{ span : 8 }}
                    label="备注:"
                >
                    {getFieldDecorator('remark', {
                        initialValue:tableData.strategyInfo.remark
                    })(
                        <Input  type="textarea"   placeholder="请输入备注信息" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 2 }}
                    wrapperCol={{ span : 8 }}
                    label="策略类型:"
                >
                    {tableData.strategyInfo.type}
                </FormItem>
                <FormItem
                    labelCol={{ span : 2 }}
                    wrapperCol={{ span : 8 }}
                    label="创建时间:"
                    hasFeedback
                >
                    {tableData.strategyInfo.time}
                </FormItem>
                <FormItem>
                    <Col span={2}></Col>
                    <Col span={8}>
                        <Button  type="primary" className="blueBtn" htmlType="submit" >确认</Button>
                        <Button className="grayBtn rml15" onClick={this.cancelClick.bind(this)}>取消</Button>
                    </Col>
                </FormItem>
            </Form>
        )
    }
}
const _infoForm = Form.create()(infoForm);
//UserInfo本体
export default class authority_cusStrategyInfo extends React.Component{
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [
            { title: '用户与权限',  key: '0' , popVisable:false , tableData:{ pagination:{showSizeChanger:true,pageSizeOptions:['10','20','30']},columns:[],data:[]}},
            { title: '云解析',  key: '1' , popVisable:false , tableData:{ pagination:{ showSizeChanger:true,pageSizeOptions:['10','20','30']},columns:[],data:[]}}
        ];
        this.state={
            renderData:{
                editFlag:false,
                disabled:{
                    btn:'disabled'
                },
                selects:[0],
                activeKey: panes[0].key,
                panes
            },
            modalData:{
                ModalClass:'',
                title:'',
                style:{},
                visable:false,
                key:'1',
                type:'',
                text:'',
                targetKey:''
            },
            tableData:{
                pagination:{
                    showSizeChanger:true,
                    pageSizeOptions:['10','20','30']
                },
                rowSelection:{},
                columns:[],
                data:[],
                selectedRowkeys:[],
                strategyInfo:{
                    name:'策略1',
                    remark:'-',
                    type:'预设策略',
                    time:'2017-01-01 12:12:12'
                }
            }
        }
    }
    componentDidMount(){
        this.fetch(100);
        this.verticalTabChange('0');
        console.log(this.props.location.query)
    }
    //编辑策略信息
    editClick(){
        var { renderData } = this.state;
        renderData.editFlag=true;
        this.setState({
            renderData:renderData
        });
    }
    //单个解绑用户
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
    //横向Tab事件
    tabChange(key) {
        if(key=='2'){
            this.fetch(100);
        }
    }
    //关联用户
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
    //解绑用户
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
    //穿梭Change
    transferHandleChange(targetKeys, direction, moveKeys){
        var renderData = this.state.renderData;
        renderData.targetKeys=targetKeys;
        console.log(targetKeys, direction, moveKeys);
        this.setState({ renderData:renderData });
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
    //用户信息点击事件
    userInfoClick(e){
        this.context.router.push({
            pathname: '/authority_user/info',
            query: {
                name: $(e.target).text(),
                id:$(e.target).attr('data-id')
            }
        });
    }
    //垂直tab事件
    verticalTabChange(activeKey){
        const { renderData }= this.state;
        renderData.activeKey=activeKey;
        renderData.panes.map((pane)=>{
            if (pane.key==activeKey){
                const columns = [{
                    title: '功能',
                    dataIndex: 'function',
                    width:'80%'
                },{
                    title: '操作',
                    dataIndex: 'operate',
                    render: (flag) => <Switch defaultChecked={flag}/>
                }];
                const pagination={
                    showSizeChanger:true,
                    pageSizeOptions:['10','20','30','50','100']
                }
                let data=[];
                switch (pane.title){
                    case '云解析':
                        data=[
                            {
                                key:1,
                                function:'只读访问云解析相关的所有策略',
                                operate:false
                            },
                            {
                                key:2,
                                function:'NS服务器管理：增/删/改/查NS服务器',
                                operate:false
                            }, {
                                key:3,
                                function:'域名管理：启用/禁用域名',
                                operate:false
                            }, {
                                key:4,
                                function:'消息管理：增/删/该/查消息模块；增/删/该/查消息发送方式',
                                operate:false
                            }
                            ]
                        break;
                    case '用户与权限':
                        data=[
                            {
                                key:1,
                                function:'只读访问所有策略',
                                operate:false
                            },
                            {
                                key:2,
                                function:'新增策略',
                                operate:false
                            }, {
                                key:3,
                                function:'删除策略',
                                operate:false
                            }, {
                                key:4,
                                function:'修改策略',
                                operate:false
                            }, {
                                key:5,
                                function:'关联/移除',
                                operate:false
                            }
                        ]
                        break;
                }
                pane.tableData.columns=columns;
                pane.tableData.pagination=pagination;
                pane.tableData.data=data;
            }
        })

        this.setState({ renderData });
    }
    verticalTabAdd () {
        const { renderData } = this.state
        const panes = renderData.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({ title: 'New Tab', key: activeKey ,popVisable:false , tableData:{ pagination:{ showSizeChanger:true,pageSizeOptions:['10','20','30']},columns:[],data:[]}});
        renderData.activeKey=activeKey;
        this.setState({ renderData });
    }
    verticalTabRemove(targetKey)  {
            const { renderData } = this.state
            let activeKey = renderData.activeKey;
            let lastIndex;
            renderData.panes.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    lastIndex = i==0 ? i : i-1;
                }
            });
            const panes = renderData.panes.filter(pane => pane.key !== targetKey);
            if (lastIndex >= 0 && activeKey === targetKey) {
                activeKey = panes[lastIndex].key;
            }
            renderData.activeKey=activeKey;
            renderData.panes=panes;
            this.setState({ renderData });
    }
    render(){
        const {renderData,tableData , modalData}=this.state;
        const that = this;
        return(
            <div className="tableContent analysisBox">
                <Row >
                    <Col className="infoTitle">
                        <a  onClick={()=>{
                            this.context.router.push({
                                pathname:"/authority_strategy",
                                query: {key:'2'}
                            })
                        }} className="backTopBtn"><Icon type="left"/>策略列表</a>
                        <h3 className="infoTitleText">{this.props.location.query.name}</h3>
                    </Col>
                </Row>
                <Row className="rmt30 rpt30 rmb15">
                    <Col span={2} className="text-right"><h3>基本信息</h3></Col>
                    <Col span={21}><a style={{lineHeight:'24px',textIndent:'30px'}} onClick={this.editClick.bind(this)}><Icon type="edit"/>编辑</a></Col>
                </Row>
                {
                    renderData.editFlag == true ?
                        <_infoForm that={this}/>
                        :
                <Row>
                    <Col span={2} className="text-right rmb30">策略:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.strategyInfo.name}</Col>
                    <Col span={2} className="text-right rmb30">备注:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.strategyInfo.remark}</Col>
                    <Col span={2} className="text-right rmb30">策略类型:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.strategyInfo.type}</Col>
                    <Col span={2} className="text-right rmb30">创建时间:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.strategyInfo.time}</Col>
                </Row>
                }
                <Tabs className="rmt30" animated={false} onChange={this.tabChange.bind(this)} type="card">
                    <TabPane tab="策略权限" key="1">
                        <Row className="rmb15 rmt30">
                            <Col span={24}>
                                <Alert message=" 策略被关联后，即可获得该策略所描述的操作权限。" type="info" />
                                <Tabs
                                    onChange={this.verticalTabChange.bind(this)}
                                    activeKey={renderData.activeKey}
                                    type="card"
                                    tabPosition="left"
                                    className="rmt30"
                                    hideAdd={true}
                                >
                                    {renderData.panes.map(function(pane,index){
                                            return(
                                                <TabPane tab={ <span>
                                                    {
                                                        index==renderData.panes.length-1 ?
                                                            <a onClick={()=>{that.verticalTabAdd()}}><Icon type="plus"/></a>
                                                            :
                                                            ''
                                                    }
                                                    {pane.title}
                                                    <Popover
                                                        content={
                                                            <Row>
                                                                <Col span={24} className="rmt30 rmb30">
                                                                    <h3 className="text-center">删除后关联用户将失去相关权限</h3>
                                                                </Col>
                                                                <Col span={24} className="text-center" style={{background:'#edf4f5',padding:'15px 0',margin:'0'}}>
                                                                    <Button type="primary" onClick={that.verticalTabRemove.bind(that,pane.key)} className="blueBtn rmr15" >确认删除</Button>
                                                                    <Button className="grayBtn" onClick={()=>{
                                                                        renderData.panes[pane.key].popVisable=false;
                                                                        that.setState({ renderData });
                                                                    }}>取消</Button>
                                                                </Col>
                                                            </Row>
                                                        }
                                                        trigger="click"
                                                        placement="bottom"
                                                        overlayClassName="analysisBox"
                                                        key={Math.random()}
                                                        visible={pane.popVisable}
                                                        onVisibleChange={(visible)=>{
                                                            if(renderData.panes.length>1){
                                                                renderData.panes[index].popVisable=visible;
                                                                that.setState({ renderData });
                                                            }else{
                                                                message.error('至少要有一个策略权限配置')
                                                            }
                                                        }}
                                                    >
                                                        <a className="rml15 authorityDel" style={{visibility:'hidden'}}><Icon type="delete"/></a>
                                                    </Popover>
                                                    </span> } key={pane.key}>
                                                    <Table
                                                        className="addCusStrategy"
                                                        columns={pane.tableData.columns}
                                                        dataSource={pane.tableData.data}
                                                        pagination={pane.tableData.pagination}
                                                    />
                                                </TabPane>
                                            )
                                    })}
                                </Tabs>
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
authority_cusStrategyInfo.contextTypes = {
    router: React.PropTypes.object
}