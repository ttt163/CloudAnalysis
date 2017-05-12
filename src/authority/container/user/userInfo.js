/**
 * Created by Liang on 2017/4/24.
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
    //部门Change
    departmentChange(index,value){
        let that = this.props.that;
        var { tableData } =that.state;
        tableData.departmentConfig[index]['department']=value;
        that.setState({
            tableData:tableData
        })
        console.log(that.state.tableData)
    }
    //角色Change
    roleChange(index,value){
        let that = this.props.that;
        var { tableData } =that.state;
        tableData.departmentConfig[index]['role']=value;
        that.setState({
            tableData:tableData
        })
        console.log(that.state.tableData)
    }
    //增加部门配置
    addDepartmentClick(){
        let that = this.props.that;
        var {renderData , tableData}=that.state;
        if(renderData.selects.length<30){
            renderData.selects.push(renderData.selects[renderData.selects.length-1]+1);
            tableData.departmentConfig[renderData.selects[renderData.selects.length-1]]={};
            that.setState({
                renderData:renderData,
                tableData:tableData
            })
        }else{
            message.error('最多只能添加30个分组')
        }
        console.log(that.state);
    }
    //移除配置
    removeDepartmentClick(masterIndex){
        let that = this.props.that;
        var {renderData , tableData}=that.state;
        delete tableData.departmentConfig[renderData.selects[masterIndex]];
        renderData.selects.splice(masterIndex,1);
        that.setState({
            renderData:renderData,
            tableData:tableData
        })
        console.log(that.state);
    }
    submitClick(){
        let that = this.props.that;
        var { tableData }=that.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let flag=true;
                for( var x in tableData.departmentConfig){
                    let n=0;
                    for(var y in tableData.departmentConfig[x] ){
                        n++;
                    }
                    if(n<2){
                        message.error('您还有选项没有配置');
                        flag=false;
                        return ;
                    }
                }
                if(flag){
                    console.log(values);
                }
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
        const form = this;
        const { renderData , tableData } = that.state;
        return(
                <Form onSubmit={this.submitClick.bind(this)} className="login-form">
                    <FormItem
                        labelCol={{ span : 2 }}
                        wrapperCol={{ span : 8 }}
                        label="姓名:"
                        hasFeedback
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入姓名'},{ pattern:/^[\u4e00-\u9fa5a-zA-Z]+$/i,message:'姓名只能为中文或英文'}],
                            initialValue:tableData.userInfo.name
                        })(
                            <Input type="text"  placeholder="请输入姓名" />
                        )}
                    </FormItem>
                    <FormItem
                        labelCol={{ span : 2 }}
                        wrapperCol={{ span : 8 }}
                        label="所属部门:"
                    >
                        {
                            renderData.selects.map(function (value, masterIndex) {
                                return (
                                <Row type="flex"key={masterIndex}>
                                    <Col span={12} >
                                        <Select
                                            value={tableData.departmentConfig[renderData.selects[masterIndex]]['department']}
                                            onChange={form.departmentChange.bind(form,renderData.selects[masterIndex])}
                                            className="department" style={{width: 200}}>
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
                                    <Col span={12}>
                                            <Select
                                            value={tableData.departmentConfig[renderData.selects[masterIndex]]['role']}
                                            onChange={form.roleChange.bind(form,renderData.selects[masterIndex])}
                                            className="role" style={{width: 200}}>
                                            {
                                                renderData.role.map(function (value, slaveIndex) {
                                                    return (
                                                        <Option
                                                            key={slaveIndex}
                                                            value={value.id}
                                                        >
                                                            {value.name}
                                                        </Option>
                                                    )
                                                })
                                            }
                                            </Select>
                                                {
                                                    masterIndex == 0 ?
                                                        <a onClick={form.addDepartmentClick.bind(form)}><Icon
                                                            style={{marginLeft: '34px'}} type="plus"/></a> :
                                                            <span className="rml10">
                                                                <a onClick={form.removeDepartmentClick.bind(form,masterIndex)}>
                                                                    <Icon className="red" type="delete"/>
                                                                </a>
                                                                <a onClick={form.addDepartmentClick.bind(form)}>
                                                                    <Icon className="rml10" type="plus"/>
                                                                </a>
                                                            </span>
                                                }
                                        </Col>
                                </Row>
                                )
                            })
                        }
                    </FormItem>
                    <FormItem
                        labelCol={{ span : 2 }}
                        wrapperCol={{ span : 8 }}
                        label="备注:"
                    >
                        {getFieldDecorator('remark', {
                            initialValue:tableData.userInfo.remark
                        })(
                            <Input  type="textarea"   placeholder="请输入备注信息" />
                        )}
                    </FormItem>
                    <FormItem
                        labelCol={{ span : 2 }}
                        wrapperCol={{ span : 8 }}
                        label="联系邮箱:"
                    >
                        {tableData.userInfo.email}
                    </FormItem>
                    <FormItem
                        labelCol={{ span : 2 }}
                        wrapperCol={{ span : 8 }}
                        label="联系手机:"
                        hasFeedback
                    >
                        {getFieldDecorator('mobilePhone', {
                            rules: [{
                                validator:function(rule, value, callback){
                                    if(value==""||value==undefined){
                                        callback();
                                    }else if(value.length!=11){
                                        callback('请输入正确的手机号');
                                    }else if(!(/^(1[3-9]\d{9})$/.test(value))){
                                        callback('请输入正确的手机号!');
                                    }
                                    callback();
                                }}],
                        initialValue:tableData.userInfo.phone})(
                            <Input  type="text"  placeholder="请输入手机号" />
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
//UserInfo本体
export default class authority_UserInfo extends React.Component{
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
                transferShow:'hide',
                transferData: [],
                targetKeys: [],
                selects:[0],
                department:[],
                role:[{id:'1',name:'部门主管'},{id:'2',name:'普通员工'}]
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
                departmentConfig:{0:{}},
                userInfo:{
                    name:'liang',
                    department:'客服组-部门主管',
                    remark:'-',
                    email:'asdf@sda.com',
                    phone:'13810967102'
                }
            }
        }
    }
    componentDidMount(){
        this.getMock();
        this.fetch(100);
        console.log(this.props.location.query)
    }
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
    linkStrateagyClick(){
        const { modalData ,renderData} = this.state;
        modalData.visable = true;
        modalData.key=Math.random();
        modalData.ModalClass='transferModal';
        modalData.title = '关联策略';
        modalData.type = 'link';
        renderData.transferShow='';
        this.setState({
            modalData: modalData,
            renderData:renderData
        });
        this.getMock();
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
                name: `策略${i + 1}`,
                remark: `管理后台${i + 1}`,
                type:Math.random()*2>1?'预设策略':'自定义策略'
            };
            if(filter!=undefined){
                if(_data.type==filter){
                    data.push(_data);
                }
            }else{
                data.push(_data);
            }
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
            <span className="custom-item"><span>{item.name}</span><span>{item.remark}</span><span>{item.type}</span></span>
        );
        return {
            label: itemRender,  // for displayed item
            value: item.name+item.remark+item.type,   // for title and filter matching
        };
    }
    //数据渲染
    fetch(i){
        const columns = [{
            title: '策略名',
            dataIndex: 'name'
        }, {
            title:'关联时间',
            dataIndex:'time'
        },{
            title: '操作',
            dataIndex: 'operate',
            render: (data) => <div><a className="rml10" data-name={data.name} onClick={this.deleteClick.bind(this,true)}>解除</a></div>,
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
                    name:`策略名${i}`,
                    time:'2017-04-27 11:20:02',
                    operate:{id:'dafsadf',name:`开发${i}`}
                }
            )
        }
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30']
        }
        this.state.renderData.tableData.total=datas;
        let renderData=this.state.renderData;
        renderData.tableData.columns=columns;
        renderData.tableData.data=data;
        renderData.tableData.pagination=pagination;
        this.setState({
            renderData:renderData
        });
    }
    //modalCLick
    confirmOKClick(){
        var renderData=this.state.renderData;
        switch (renderData.modalData.type){
            case 'delete':
                message.success('single delete submit');
                break;
            case "link":

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
    render(){
        const {renderData,tableData , modalData}=this.state;
        return(
            <div className="tableContent analysisBox">
                <Row >
                    <Col className="infoTitle">
                        <Link to="/authority_user" className="backTopBtn"><Icon type="left"/>用户列表</Link>
                        <h3 className="infoTitleText">{this.props.location.query.name}</h3>
                    </Col>
                </Row>
                <Row className="rmt30 rpt30 rmb15">
                    <Col span={2} className="text-right"><h3>用户信息</h3></Col><Col span={21}><a style={{lineHeight:'24px',textIndent:'30px'}} onClick={this.editClick.bind(this)}><Icon type="edit"/>编辑</a></Col>
                </Row>
                {
                    renderData.editFlag == true ?
                        <_infoForm that={this}/>
                        :
                        <Row>
                            <Col span={2} className="text-right rmb30">姓名:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.userInfo.name}</Col>
                            <Col span={2} className="text-right rmb30">所属部门:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.userInfo.department}</Col>
                            <Col span={2} className="text-right rmb30">备注:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.userInfo.remark}</Col>
                            <Col span={2} className="text-right rmb30">联系邮箱:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.userInfo.email}</Col>
                            <Col span={2} className="text-right rmb30">联系手机:</Col><Col style={{paddingLeft:'30px'}} className="rmb30" span={21}>{tableData.userInfo.phone}</Col>
                        </Row>
                }
                <Row className="rmt30 rpt30 rmb15">
                    <Col span={2} ><h3 className="blue" style={{borderLeft:'4px solid #399bcf',color:'#399bcf',textIndent:'14px'}}>已关联策略</h3></Col>
                </Row>
                <Row className="rmb15">
                    <Col span={10} >
                        <Button type="primary" onClick={this.linkStrateagyClick.bind(this)} className="blueBtn"><Icon type="link" />关联策略</Button>
                    </Col>
                    <Col span={14}>
                        <Search
                            placeholder="请输入策略名进行搜索"
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
                    pagination={renderData.tableData.pagination}
                    columns={renderData.tableData.columns}
                    dataSource={renderData.tableData.data}
                />
                <Modal
                    title={modalData.title}
                    visible={modalData.visable}
                    key={modalData.key}
                    onCancel={this.confirmCancel.bind(this)}
                    className={modalData.ModalClass}
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
                            titles={['策略列表', '已选择']}
                            showSearch
                            listStyle={{
                                width: 400,
                                height: 400,
                            }}
                            onChange={this.transferHandleChange.bind(this)}
                            render={this.renderItem.bind(this)}
                        />
                        <div className="transferTitle"><span >策略名</span><span style={{width:'27%'}}>备注</span><span className="filterType"><a>策略类型 <Icon type="filter"/></a></span></div>
                        <div className="transferTitle transferTitleRight"><span >策略名</span><span style={{width:'27%'}}>备注</span><span>策略类型</span></div>
                    </div>
                </Modal>
            </div>
        )
}
}
