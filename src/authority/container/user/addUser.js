/**
 * Created by Liang on 2017/4/24.
 */
import React from 'react';
import { Link } from 'react-router'
import { Row , Col  , Steps  , Input  , Button  , Icon , message  , Select , Form , Transfer} from 'antd';
const Option = Select.Option;
const Step = Steps.Step;
const FormItem = Form.Item;
let resetForm;
//第一步表单
const userInfoForm=React.createClass({
    render(){
        resetForm=this;
        const { getFieldDecorator , getFieldValue  } = this.props.form;
        return (
            <Form className="login-form">
                <FormItem
                    labelCol={{ span : 8 }}
                    wrapperCol={{ span : 8 }}
                    label="姓名:"
                    hasFeedback
                >
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入姓名'},{ pattern:/^[\u4e00-\u9fa5a-zA-Z]+$/i,message:'姓名只能为中文或英文'}],
                    })(
                        <Input type="text" placeholder="请输入姓名" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 8 }}
                    wrapperCol={{ span : 8 }}
                    label="备注:"
                >
                    <Input  type="textarea"  placeholder="请输入备注信息" />
                </FormItem>
                <FormItem
                    labelCol={{ span : 8 }}
                    wrapperCol={{ span : 8 }}
                    label="联系邮箱:"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{ type:'email', message:'请输入正确的邮箱'},{required: true, message: '请输入邮箱'}],
                    })(
                        <Input  type="text"  placeholder="请输入邮箱" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 8 }}
                    wrapperCol={{ span : 8 }}
                    label="密码:"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码'},
                            { validator:function(rule, value, callback){
                                if(value==''||value==undefined){
                                    callback();
                                }else if(value.length>16||value.length<6){
                                    callback('密码字符数应在6-16位之间');
                                }else{
                                    var arr  = [/[A-Z]+/,/[a-z]+/,/[0-9]+/,/[^\sa-zA-Z0-9]+/];
                                    var n = 0;
                                    for(var i = 0; i < arr.length; i++)
                                    {
                                        if(arr[i].test(value)){
                                            n++;
                                        }
                                    }
                                    if(n >= 3){
                                        callback();
                                    }else{
                                        callback('密码为大写字母、小写字母、数字及标点符号四中字符中至少三种组合!');
                                    }
                                    callback();
                                }
                                // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                            }}],
                    })(
                        <Input type="password" placeholder="请输入密码" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 8 }}
                    wrapperCol={{ span : 8 }}
                    label="确认密码:"
                    hasFeedback
                >
                    {getFieldDecorator('_password', {
                        rules: [{ required: true, message: '请输入密码'},
                            { validator:function(rule, value, callback){
                                if(value==''||value==undefined){
                                    callback();
                                }else if(value !== getFieldValue('password')){
                                    callback('两次输入不一致！')
                                }else if(value.length>16||value.length<6){
                                    callback('密码字符数应在6-16位之间');
                                }else{
                                    var arr  = [/[A-Z]+/,/[a-z]+/,/[0-9]+/,/[^\sa-zA-Z0-9]+/];
                                    var n = 0;
                                    for(var i = 0; i < arr.length; i++)
                                    {
                                        if(arr[i].test(value)){
                                            n++;
                                        }
                                    }
                                    if(n >= 3){
                                        callback();
                                    }else{
                                        callback('密码为大写字母、小写字母、数字及标点符号四中字符中至少三种组合!');
                                    }
                                    callback();
                                }
                                // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                            }}],
                    })(
                        <Input  type="password"  placeholder="请重新输入密码" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 8 }}
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
                    })(
                        <Input  type="text"  placeholder="请输入手机号" />
                    )}
                </FormItem>
            </Form>
        )
    }
})
const _userInfoForm = Form.create()(userInfoForm);
//UserInfo本体
export default class authority_addUser extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                step:0,
                selects:[0],
                department:[],
                role:[],
                transferShow:'hide',
                transferData: [],
                targetKeys: []
            },
            tableData:{
                departmentConfig:{0:{}}
            }
        }
    }
    //下一步
    next() {
        switch (this.state.renderData.step){
            case 0:
                resetForm.props.form.validateFields((err, values) => {
                    if (!err) {
                        const renderData = this.state.renderData;
                        renderData.step++;
                        renderData.department=[{id:'1',name:'客服组'},{id:'2',name:'系统组'},{id:'3',name:'点播运维组'},{id:'4',name:'点播开发组'}];
                        renderData.role=[{id:'1',name:'部门主管'},{id:'2',name:'普通员工'}];
                        this.setState({
                            renderData:renderData
                        });
                    }
                });
                break;
            case 1:
                const { renderData ,tableData }  = this.state;
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
                    renderData.step++;
                    renderData.transferShow='';
                    this.setState({
                        renderData:renderData
                    });
                }
                break;
        }
    }
    //上一步
    prev() {
        const renderData = this.state.renderData;
        renderData.step--;
        if(renderData.step!=2){
            renderData.transferShow='hide';
        }
        this.setState({
            renderData:renderData
        });
    }
    //部门Change
    departmentChange(index,value){
        var { tableData } =this.state;
        tableData.departmentConfig[index]['department']=value;
        this.setState({
            tableData:tableData
        })
        console.log(this.state.tableData)
    }
    //角色Change
    roleChange(index,value){
        var { tableData } =this.state;
        tableData.departmentConfig[index]['role']=value;
        this.setState({
            tableData:tableData
        })
        console.log(this.state.tableData)
    }
    //增加部门配置
    addDepartmentClick(){
        var {renderData , tableData}=this.state;
        if(renderData.selects.length<30){
            renderData.selects.push(renderData.selects[renderData.selects.length-1]+1);
            tableData.departmentConfig[renderData.selects[renderData.selects.length-1]]={};
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
    removeDepartmentClick(masterIndex){
        var {renderData , tableData}=this.state;
        delete tableData.departmentConfig[renderData.selects[masterIndex]];
        renderData.selects.splice(masterIndex,1);
        this.setState({
            renderData:renderData,
            tableData:tableData
        })
        console.log(this.state);
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
        var that=this;
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
        //增加title
        if($('.ant-transfer-list-body-search-wrapper').parent().find('.transferTitle').length==0){
            $($('.ant-transfer-list-body-search-wrapper')[0]).after('<div class="transferTitle"><span >策略名</span><span style="width: 27%;">备注</span><span class="filterType"><a>策略类型 <i class="anticon anticon-filter"></i></a></span></div>')
            $($('.ant-transfer-list-body-search-wrapper')[1]).after('<div class="transferTitle"><span >策略名</span><span style="width: 27%;">备注</span><span class="filterType">策略类型 </span></div>')
        }
        //去挑右边的搜索框
        $($('.ant-transfer-list-body-search-wrapper')[1]).remove();
        //去掉右边搜索样式
        $($('.ant-transfer-list-body')[1]).removeClass('ant-transfer-list-body-with-search');
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
        this.setState({
            renderData:renderData
        });
    }
    //穿梭内item渲染
    renderItem (item){
        let   itemRender=(
            <span className="custom-item"><span>{item.name}</span><span>{item.remark}</span><span>{item.type} <a onClick={this.deleteItemClick.bind(this)} data-key={item.key} className="floatR deleteTransferItemBtn rmr30 hide"><Icon data-key={item.key} type="delete"></Icon></a></span></span>
        );
        return {
            label: itemRender,  // for displayed item
            value: item.name+item.remark+item.type,   // for title and filter matching
        };
    }
    //删除选中(先不用)
    deleteItemClick(e){
        var renderData=this.state.renderData;
        this.state.renderData.targetKeys.map(function(value,index){
            if(value==$(e.target).attr('data-key')){
                renderData.targetKeys.splice(index,1);
            }
        })
        this.setState({
            renderData:renderData
        })
    }
    //提交按钮
    submitClick(){
        if(this.state.renderData.targetKeys.length==0){
            message.error('策略不能为空');
        }else{
            message.success('Processing complete!');
        }
    }
    componentDidMount(){
        /* $($('.ant-transfer-list')[1]).addClass('rightTransfer');*/
        this.getMock();
    }
    render(){
        const that = this;
        const steps = [{
            title: '填写用户信息'
        }, {
            title: '所属部门'

        }, {
            title: '关联策略',
            content:'12321323132'
        }];
        return(
            <div className="tableContent analysisBox">
                <Row >
                    <Col className="infoTitle">
                        <Link to="/authority_user" className="backTopBtn"><Icon type="left"/>用户列表</Link>
                        <h3 className="infoTitleText">新建用户</h3>
                    </Col>
                </Row>
                <Row className="rmt70">
                    <Steps className="infoStep" current={this.state.renderData.step}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <div className="steps-content infoContent">
                        {
                            this.state.renderData.step == 0 ?
                                <_userInfoForm/> :
                                this.state.renderData.step == 1 ?
                                    this.state.renderData.selects.map(function (value, masterIndex) {
                                        return (
                                            <Row type="flex" justify="center" key={masterIndex}>
                                                <Col span={5} className="text-center">
                                                    <Select
                                                        value={that.state.tableData.departmentConfig[that.state.renderData.selects[masterIndex]]['department']}
                                                        onChange={that.departmentChange.bind(that, that.state.renderData.selects[masterIndex])}
                                                        className="department" style={{width: 200}}>
                                                        {
                                                            that.state.renderData.department.map(function (value, slaveIndex) {
                                                                return (
                                                                    <Option key={slaveIndex}
                                                                            value={value.id}>{value.name}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </Col>
                                                <Col span={5} className="text-center">
                                                    <Select
                                                        value={that.state.tableData.departmentConfig[that.state.renderData.selects[masterIndex]]['role']}
                                                        onChange={that.roleChange.bind(that, that.state.renderData.selects[masterIndex])}
                                                        className="role" style={{width: 200}}>
                                                        {
                                                            that.state.renderData.role.map(function (value, slaveIndex) {
                                                                return (
                                                                    <Option key={slaveIndex}
                                                                            value={value.id}>{value.name}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                    {
                                                        masterIndex == 0 ?
                                                            <a onClick={that.addDepartmentClick.bind(that)}><Icon
                                                                style={{marginLeft: '34px'}} type="plus"/></a> :
                                                            <span className="rml10">
                                                                    <a onClick={that.removeDepartmentClick.bind(that, masterIndex)}><Icon
                                                                        className="red" type="delete"/></a>
                                                                    <a onClick={that.addDepartmentClick.bind(that)}><Icon
                                                                        className="rml10" type="plus"/></a>
                                                                </span>
                                                    }
                                                </Col>
                                            </Row>
                                        )
                                    }) : ''

                        }
                        <Transfer
                            dataSource={this.state.renderData.transferData}
                            targetKeys={this.state.renderData.targetKeys}
                            titles={['策略列表', '已选择']}
                            showSearch
                            className={this.state.renderData.transferShow}
                            listStyle={{
                                width: 400,
                                height: 400,
                            }}
                            onChange={this.transferHandleChange.bind(this)}
                            render={this.renderItem.bind(this)}
                        />
                    </div>
                    <div className="steps-action">
                        {
                            this.state.renderData.step > 0
                            &&
                            <Button onClick={this.prev.bind(this)}>
                                上一步
                            </Button>
                        }
                        {
                            this.state.renderData.step < steps.length - 1
                            &&
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={this.next.bind(this)}>下一步</Button>
                        }
                        {
                            this.state.renderData.step === steps.length - 1
                            &&
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={this.submitClick.bind(this)}>完成</Button>
                        }
                    </div>
                </Row>
            </div>
        )
    }
}
