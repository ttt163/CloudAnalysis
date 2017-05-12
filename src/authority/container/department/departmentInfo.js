/**
 * Created by Liang on 2017/4/27.
 */
import React from 'react';
import { Link } from 'react-router'
import { Row , Col , Input  , Button  , Icon , message  , Select , Form  , Table , Modal , Transfer} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
class infoForm extends React.Component{
    constructor(props){
        super(props);
    }
    submitClick(){
        let that = this.props.that;
        var { tableData , renderData }=that.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                message.success('info save submit');
                tableData.departmentInfo.name=values.name;
                tableData.departmentInfo.remark=values.remark;
                renderData.editFlag=false;
                that.setState({
                    renderData:renderData,
                    tableData:tableData
                })
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
                    label="部门名称:"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入部门名称'}],
                        initialValue:tableData.departmentInfo.name
                    })(
                        <Input type="text"  placeholder="请输入部门名称" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 2 }}
                    wrapperCol={{ span : 8 }}
                    label="角色:"
                >
                    {
                        tableData.departmentInfo.role
                    }
                </FormItem>
                <FormItem
                    labelCol={{ span : 2 }}
                    wrapperCol={{ span : 8 }}
                    label="备注:"
                >
                    {getFieldDecorator('remark', {
                        initialValue:tableData.departmentInfo.remark
                    })(
                        <Input  type="textarea"   placeholder="请输入备注信息" />
                    )}
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
export default class  authority_departmentInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                editFlag:false,
                tableData:{
                    pagination:{},
                    columns:[],
                    data:[]
                },
                disabled:{
                    btn:'disabled'
                },
                transferShow:'hide',
                transferData: [],
                targetKeys: [],
                selects:[0],
                user:[],
                department:[],
                role:[{id:'1',name:'部门主管'},{id:'2',name:'普通员工'}]
            },
            modalData:{
                key:0,
                type:'delete',
                title:'确认操作',
                confirmText: '',
                ModalClass:'analysisBox',
                visable: false,
                multiSelectedRowkeys:[]
            },
            tableData:{
                userConfig:{0:{}},
                departmentConfig:{department:'',role:''},
                departmentInfo:{
                    name:'liang',
                    role:'部门主管,普通员工',
                    remark:'-',
                    time:'2017-01-03 08:22:21'
                },
                total:0,
                pagination:{},
                data:[],
                columns:[],
                rowSelection:{},
                selectedRowkeys:[],
            }
        }
    }
    //编辑点击
    editClick(){
        var { renderData , tableData } = this.state;
        renderData.editFlag=true;
        renderData.selects=[0];
        renderData.department=[{id:'1',name:'客服组'},{id:'2',name:'系统组'},{id:'3',name:'点播运维组'},{id:'4',name:'点播开发组'}];
        tableData.departmentConfig=[{department:'1',role:'1'}]
        this.setState({
            renderData:renderData
        });
    }
    //关联用户点击
    linkUserClick(){
        const { modalData , renderData , tableData } = this.state;
        modalData.title="添加用户";
        modalData.key=Math.random();
        modalData.visable=true;
        modalData.type='user';
        renderData.selects=[0];
        renderData.user=[{id:'1',name:'liangmeng'},{id:'2',name:'liang'},{id:'3',name:'meng'}];
        tableData.userConfig=[{}]
        this.setState({
            modalData:modalData,
            renderData:renderData,
            tableData:tableData
        })
    }
    //切换部门点击
    triggerDepartmentClick(){
        const { modalData , renderData , tableData } = this.state;
        modalData.title="切换部门";
        modalData.key=Math.random();
        modalData.visable=true;
        modalData.type='trigger';
        renderData.selects=[0];
        renderData.department=[{id:'1',name:'客服部'},{id:'2',name:'开发部'},{id:'3',name:'运营部'}];
        tableData.departmentConfig={}
        this.setState({
            modalData:modalData,
            renderData:renderData,
            tableData:tableData
        })
    }
    //用户Change
    userChange(index,value){
        var { tableData } =this.state;
        tableData.userConfig[index]['user']=value;
        this.setState({
            tableData:tableData
        })
        console.log(this.state.tableData)
    }
    //角色Change
    roleChange(index,value){
        var { tableData } =this.state;
        if(index){
            tableData.departmentConfig.role=value;
        }else{
            tableData.userConfig[index]['role']=value;
        }
        this.setState({
            tableData:tableData
        })
        console.log(this.state.tableData)
    }
    departmentChange(value){
        var { tableData } =this.state;
        tableData.departmentConfig.department=value;
        this.setState({
            tableData:tableData
        })
        console.log(this.state.tableData)
    }
    //增加部门配置
    addUserConfigClick(){
        var {renderData , tableData}=this.state;
        if(renderData.selects.length<30){
            renderData.selects.push(renderData.selects[renderData.selects.length-1]+1);
            tableData.userConfig[renderData.selects[renderData.selects.length-1]]={};
            this.setState({
                renderData:renderData,
                tableData:tableData
            })
        }else{
            message.error('最多只能添加30个分组')
        }
        console.log(this.state);
    }
    //移除配置
    removeUserConfigClick(masterIndex){
        var {renderData , tableData}=this.state;
        delete tableData.userConfig[renderData.selects[masterIndex]];
        renderData.selects.splice(masterIndex,1);
        this.setState({
            renderData:renderData,
            tableData:tableData
        })
        console.log(this.state);
    }
    //modalCLick
    confirmOKClick(){
        const {tableData, modalData}=this.state;
        switch(modalData.type){
            case 'delete':
                message.success('delete submit');
                break;
            case 'trigger':
                var flag=true;
                let n=0;
                for(var x in tableData.departmentConfig){
                    n++;
                }
                if(n<2){
                    message.error('您还有选项没有配置');
                    flag=false;
                    return ;
                }
                if(flag){
                    message.success('trigger submit')
                }
                break;
            case 'user':
                var flag=true;
                for( var x in tableData.userConfig){
                    let n=0;
                    for(var y in tableData.userConfig[x] ){
                        n++;
                    }
                    if(n<2){
                        message.error('您还有选项没有配置');
                        flag=false;
                        return ;
                    }
                }
                if(flag){
                    message.success('addUser submit')
                }
                break;
        }
    }
    confirmCancel(){
        var {modalData}=this.state;
        modalData.visable=false;
        this.setState({
            modalData:modalData
        })
    }
    //数据渲染
    fetch(i){
        const columns = [{
            title: '用户名',
            dataIndex: 'name'
        }, {
            title:'备注',
            dataIndex:'remark'
        },{
            title: '操作',
            dataIndex: 'operate',
            render: (data) => <div><a className="rml10" data-id={data.id} onClick={this.triggerDepartmentClick.bind(this,true)}>切换部门</a></div>,
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
                    name:`用户${i}`,
                    remark:'-',
                    operate:{id:'dafsadf',name:`开发${i}`}
                }
            )
        }
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
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30','50','100']
        }
        const { tableData } = this.state;
        tableData.total=data.length;
        tableData.columns=columns;
        tableData.data=data;
        tableData.pagination=pagination;
        tableData.rowSelection=rowSelection;
        this.setState({
            tableData:tableData
        });
    }
    componentDidMount(){
        this.fetch(100);
        console.log(this.props.location.query)
    }
    render(){
        const {renderData,tableData , modalData}=this.state;
        const that = this ;
        return(
            <div className="tableContent analysisBox">
                <Row >
                    <Col className="infoTitle">
                        <Link to="/authority_department" className="backTopBtn"><Icon type="left"/>部门列表</Link>
                        <h3 className="infoTitleText">{this.props.location.query.name}</h3>
                    </Col>
                </Row>
                <Row className="rmt30 rpt30 rmb15">
                    <Col span={2} className="text-right"><h3>部门信息</h3></Col><Col span={21}><a style={{lineHeight:'24px',textIndent:'30px'}} onClick={this.editClick.bind(this)}><Icon type="edit"/>编辑</a></Col>
                </Row>
                {
                    renderData.editFlag == true ?
                        <_infoForm that={this}/>
                        :
                        <Row>
                            <Col span={2} className="text-right rmb30">部门名称:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.departmentInfo.name}</Col>
                            <Col span={2} className="text-right rmb30">角色:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.departmentInfo.role}</Col>
                            <Col span={2} className="text-right rmb30">备注:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.departmentInfo.remark}</Col>
                            <Col span={2} className="text-right rmb30">创建时间:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.departmentInfo.time}</Col>
                        </Row>
                }
                <Row className="rmt30 rpt30 rmb15">
                    <Col span={2} ><h3 className="blue" style={{borderLeft:'4px solid #399bcf',color:'#399bcf',textIndent:'14px'}}>已关联用户</h3></Col>
                </Row>
                <Row className="rmb15">
                    <Col span={10} >
                        <Button type="primary" onClick={this.linkUserClick.bind(this)} className="blueBtn"><Icon type="link" />关联用户</Button>
                        <Button  disabled={renderData.disabled.btn} onClick={this.triggerDepartmentClick.bind(this)} className="grayBtn rml15"><Icon type="link" />切换部门</Button>
                    </Col>
                    <Col span={14}>
                        <Search
                            placeholder="请输入用户名进行搜索"
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
                <Table
                    rowSelection={tableData.rowSelection}
                    pagination={tableData.pagination}
                    columns={tableData.columns}
                    dataSource={tableData.data}
                />
                <div className="showTotal">
                    <span>已选 {tableData.selectedRowkeys.length} 项，共 {tableData.total} 项</span>
                </div>
                <Modal
                    title={modalData.title}
                    visible={modalData.visable}
                    key={modalData.key}
                    onCancel={this.confirmCancel.bind(this)}
                    className={modalData.ModalClass}
                    footer={<div className="text-center"><Button onClick={this.confirmOKClick.bind(this)} type="primary" className="blueBtn">确认</Button><Button onClick={this.confirmCancel.bind(this)} className="rml15 grayBtn">取消</Button></div>}
                >
                    {
                        modalData.type=='user'?
                            renderData.selects.map(function (value, masterIndex) {
                                return (
                                    <Row type="flex" className="rmt15" justify="center" key={masterIndex}>
                                        <Col span={10} className="text-center">
                                            <Select
                                                value={tableData.userConfig[renderData.selects[masterIndex]]['user']}
                                                onChange={that.userChange.bind(that, renderData.selects[masterIndex])}
                                                className="department" style={{width: 150}}>
                                                {
                                                    renderData.user.map(function (value, slaveIndex) {
                                                        return (
                                                            <Option key={slaveIndex}
                                                                    value={value.id}>{value.name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Col>
                                        <Col span={10} className="text-center">
                                            <Select
                                                value={tableData.userConfig[renderData.selects[masterIndex]]['role']}
                                                onChange={that.roleChange.bind(that, renderData.selects[masterIndex])}
                                                className="role" style={{width: 150}}>
                                                {
                                                    renderData.role.map(function (value, slaveIndex) {
                                                        return (
                                                            <Option key={slaveIndex}
                                                                    value={value.id}>{value.name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                            {
                                                masterIndex == 0 ?
                                                    <a onClick={that.addUserConfigClick.bind(that)}><Icon
                                                        style={{marginLeft: '34px'}} type="plus"/></a> :
                                                    <span className="rml10">
                                                                    <a onClick={that.removeUserConfigClick.bind(that, masterIndex)}><Icon
                                                                        className="red" type="delete"/></a>
                                                                    <a onClick={that.addUserConfigClick.bind(that)}><Icon
                                                                        className="rml10" type="plus"/></a>
                                                                </span>
                                            }
                                        </Col>
                                    </Row>
                                )
                            }) :
                            <Row type="flex" className="rmt15" justify="center">
                                <Col span={10} className="text-center">
                                    <Select
                                        onChange={that.departmentChange.bind(that)}
                                        className="department" style={{width: 150}}>
                                        {
                                            renderData.department.map(function (value, slaveIndex) {
                                                return (
                                                    <Option key={slaveIndex}
                                                            value={value.id}>{value.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Col>
                                <Col span={10} className="text-center">
                                    <Select
                                        onChange={that.roleChange.bind(that,true)}
                                        className="role" style={{width: 150}}>
                                        {
                                            renderData.role.map(function (value, slaveIndex) {
                                                return (
                                                    <Option key={slaveIndex}
                                                            value={value.id}>{value.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                    }
                </Modal>
            </div>
        )
    }
}