/**
 * Created by Liang on 2017/4/24.
 */
import React from 'react';
import { Row , Col  , Input , Table , Button , Modal , Icon , message , Checkbox , Select , Form} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
let resetForm;
const resetPwd=React.createClass({
    render(){
        resetForm=this;
        const { getFieldDecorator , getFieldValue  } = this.props.form;
        return (
            <Form className="login-form">
                <FormItem
                    labelCol={{ span : 6 }}
                    wrapperCol={{ span : 14 }}
                    label="新密码:"
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
                                        callback('密码格式不正确!');
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
                    labelCol={{ span : 6 }}
                    wrapperCol={{ span : 14 }}
                    label="重新输入密码:"
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
                                        callback('密码格式不正确!');
                                    }
                                    callback();
                                }
                                // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                            }}],
                    })(
                        <Input  type="password"  placeholder="请重新输入密码" />
                    )}
                </FormItem>
            </Form>
        )
    }
})
const _resetPwd = Form.create()(resetPwd);

export default class authority_User extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                disabled:{
                    btn:'disabled'
                },
                tableData:{
                    total:0,
                    pagination:{},
                    data:[],
                    columns:[],
                    rowSelection:{},
                    selectedRowkeys:[]
                },
                modalData:{
                    key:0,
                    type:'single',
                    title:'确认操作',
                    confirmText: '',
                    confirmNotice:'',
                    visable: false,
                    multiSelectedRowkeys:[],
                    userList:[]
                }
            }
        }
    }
    //新建用户
    createClick(){
        this.context.router.push('/authority_user/add')
    }
    //删除
    deleteClick(single,e){
        var renderData=this.state.renderData;
        if(single){
            renderData.modalData.type='single';
            renderData.modalData.title='确认操作';
            renderData.modalData.visable=true;
            renderData.modalData.confirmText="确定删除 "+$(e.target).attr('data-name')+' 吗？';
            renderData.modalData.confirmNotice="删除后该用户将不能登录后台管理平台及无法接收邮件通知";
            this.setState({
                renderData:renderData
            })
        }else{
            renderData.modalData.type="multi";
            renderData.modalData.title='确认操作';
            renderData.modalData.multiSelectedRowkeys=renderData.tableData.selectedRowkeys;
            renderData.modalData.confirmNotice="删除后以上用户将不能登录后台管理平台及无法接收邮件通知";
            renderData.modalData.key=Math.random();
            if(renderData.tableData.selectedRowkeys.length>0){
                renderData.modalData.visable=true;
                this.setState({
                    renderData:renderData
                })
            }else{
                message.error('请选择要删除的用户');
            }
        }
    }
    //替换用户
    replaceUserClick(e){
        var renderData=this.state.renderData;
        renderData.modalData.type='replace';
        renderData.modalData.title='替换用户';
        renderData.modalData.visable=true;
        renderData.modalData.confirmText="替换 "+$(e.target).attr('data-name')+' 的用户 :';
        renderData.modalData.confirmNotice='选择的用户将替换 '+$(e.target).attr('data-name')+' ，拥有 '+$(e.target).attr('data-name')+' 的关联策略、归属部门关系等除姓名、密码、邮箱、手机号之外的所有信息'
        renderData.modalData.userList=[{id:'0',name:'Mr.0'},{id:'1',name:'Mr.1'},{id:'2',name:'Mr.2'},{id:'3',name:'Mr.3'}];
        this.setState({
            renderData:renderData
        })
    }
    //重置密码
    resetPwdClick(){
        var renderData=this.state.renderData;
        renderData.modalData.type='reset';
        renderData.modalData.title='重置密码';
        renderData.modalData.visable=true;
        renderData.modalData.key=Math.random();
        renderData.modalData.confirmNotice='提示：密码必须为6-16位字符，且使用大写字母、小写字母、数字及标点符号四种字符中至少三种组合，且与登录名无相关性。'
        this.setState({
            renderData:renderData
        })
    }
    //跳转至用户详情
    someoneInfoClick(e){
        this.context.router.push({
            pathname: '/authority_user/info',
            query: {
                name: $(e.target).text(),
                id:$(e.target).attr('data-id')
            }
        });
    }
    //取消多条删除里面的item
    multiModalCheck(key,e){
        var renderData=this.state.renderData;
        if(!e.target.checked){
            var selecteds=renderData.modalData.multiSelectedRowkeys;
            selecteds=selecteds.concat();
            var index=selecteds.indexOf(key);
            selecteds.splice(index,1);
            renderData.modalData.multiSelectedRowkeys=selecteds;
        }else{
            renderData.modalData.multiSelectedRowkeys.push(key);
        }
        this.setState({
            renderData:renderData
        });
        console.log('multi:'+this.state.renderData.modalData.multiSelectedRowkeys);
        console.log('table:'+this.state.renderData.tableData.selectedRowkeys);
    }
    //modalCLick
    confirmOKClick(){
        var renderData=this.state.renderData;
        switch (renderData.modalData.type){
            case 'single':
                message.success('single delete submit');
                break;
            case "multi":
                if(renderData.modalData.multiSelectedRowkeys.length>0){
                    message.success('multi delete submit');
                }else{
                    message.error('请选择要删除的用户');
                }
                break;
            case "create":
                message.success('create submit');
                break;
            case "replace":
                message.success('replace submit');
                break;
            case "reset":
                resetForm.props.form.validateFields((err, values) => {
                    if (!err) {
                        message.success(values.password+';'+values._password)
                    }
                });
                break;
        }
    }
    confirmCancel(){
        var renderData=this.state.renderData;
        renderData.modalData.visable=false;
        this.setState({
            renderData:renderData
        })
    }
    //数据渲染
    fetch(i){
        const columns = [{
            title: '用户名称',
            dataIndex: 'name',
            render: (text) => <a data-id={i} onClick={this.someoneInfoClick.bind(this)}>{text}</a>
        }, {
            title:'所属部门',
            dataIndex:'department'
        },{
            title:'策略',
            dataIndex:'strategy'
        }, {
            title:'备注',
            dataIndex:'remark'
        }, {
            title:'创建时间',
            dataIndex:'time'
        },{
            title: '操作',
            dataIndex: 'operate',
            render: (data) => <div><a data-name={data.name} onClick={this.replaceUserClick.bind(this)}>替换用户</a><a className="rml10" onClick={this.resetPwdClick.bind(this)}>重置密码</a><a className="rml10" data-name={data.name} onClick={this.deleteClick.bind(this,true)}>删除</a></div>,
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
                    department:`开发${i}`,
                    strategy:'234',
                    remark:'123123213',
                    time:'2017-04-27 11:20:02',
                    operate:{id:'dafsadf',name:`开发${i}`}
                }
            )
        }
        const rowSelection = {
            onChange: (selectedRowKeys,selectedRows) => {
                var renderData=this.state.renderData;
                if(selectedRowKeys.length>0){
                    renderData.disabled.btn="";
                }else{
                    renderData.disabled.btn="disabled";
                }
                renderData.tableData.selected=selectedRows;
                renderData.tableData.selectedRowkeys=selectedRowKeys;
                renderData.modalData.multiSelectedRowkeys=selectedRowKeys;
                this.setState({
                    renderData:renderData
                });
                console.log(this.state.renderData.modalData.multiSelectedRowkeys);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
            }),
        };
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30','50','100']
        }
        let renderData=this.state.renderData;
        renderData.tableData.columns=columns;
        renderData.tableData.total=data.length;
        renderData.tableData.data=data;
        renderData.tableData.pagination=pagination;
        renderData.tableData.rowSelection=rowSelection;
        this.setState({
            renderData:renderData
        });
    }
    componentDidMount(){
        this.fetch(100)
    }
    render(){
        var that = this;
        return(
            <div className="tableContent analysisBox">
                <Row className="rmb20">
                    <Col span={24}>
                        <h3>用户管理</h3>
                    </Col>
                </Row>
                <Row className="rmb30">
                    <Col span={12}>
                        <Button size="large" onClick={this.createClick.bind(this)}  className="blueBtn" type="primary"><Icon type="plus"/>新建用户</Button>
                        <Button size="large" onClick={this.deleteClick.bind(this,false)} disabled={this.state.renderData.disabled.btn} className="rml15 grayBtn "><Icon type="delete"/>删除</Button>
                    </Col>
                    <Col span={12}>
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
                <Table rowSelection={this.state.renderData.tableData.rowSelection} pagination={this.state.renderData.tableData.pagination}  columns={this.state.renderData.tableData.columns} dataSource={this.state.renderData.tableData.data} />
                <div className="showTotal">
                    <span>已选 {this.state.renderData.tableData.selectedRowkeys.length} 项，共 {this.state.renderData.tableData.total} 项</span>
                </div>
                <Modal
                    title={this.state.renderData.modalData.title}
                    visible={this.state.renderData.modalData.visable}
                    key={this.state.renderData.modalData.key}
                    onCancel={this.confirmCancel.bind(this)}
                    className="analysisBox"
                    footer={<div className="text-center"><Button onClick={this.confirmOKClick.bind(this)} type="primary" className="blueBtn">确认</Button><Button onClick={this.confirmCancel.bind(this)} className="rml15 grayBtn">取消</Button></div>}
                >
                    {
                        this.state.renderData.modalData.type=='single' ?
                            <div>
                                <p>{that.state.renderData.modalData.confirmText}</p>
                                <p className="noticeText rml10"><Icon type="info-circle" className="rmr5"/>{that.state.renderData.modalData.confirmNotice}</p>
                            </div>
                            :
                            that.state.renderData.modalData.type=='multi' ?
                                <div className="ant-modal-body">
                                    <Row>
                                        <h3 className="rmb30 rml10" style={{textAlign:'left'}}>确定删除如下已选用户？</h3>
                                        {
                                            that.state.renderData.tableData.selected.map(function(value,index){
                                                return (
                                                    <Col className="rmb15" key={index} span={8}>
                                                        <Checkbox  defaultChecked={true}  onChange={that.multiModalCheck.bind(that,value.key)}>{value.name}</Checkbox>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    <p className="noticeText rml10 text-left"><Icon type="info-circle" className="rmr5"/>{that.state.renderData.modalData.confirmNotice}</p>
                                </div>
                                :
                                that.state.renderData.modalData.type=='replace'?
                                <Row className="rpt30">
                                    <Col style={{ lineHeight : '30px' }}  span={10} className="text-right">
                                        {that.state.renderData.modalData.confirmText}
                                    </Col>
                                    <Col span={14} className="text-left">
                                        <Select size="large" style={{ width: 200 }} onChange={function(value){
                                            console.log(`selected ${value}`);
                                        }.bind(that)}>
                                            {
                                                that.state.renderData.modalData.userList.map(function(value){
                                                    return(
                                                            <Option value={value.id}>{value.name}</Option>
                                                        )
                                                })
                                            }
                                        </Select>
                                    </Col>
                                    <p className="noticeText rml10 rmt70"><Icon type="info-circle" className="rmr5"/>{that.state.renderData.modalData.confirmNotice}</p>
                                </Row>:
                                    that.state.renderData.modalData.type=='reset'?
                                        <Row className="rpt30">
                                            <_resetPwd onSubmit={that.confirmOKClick.bind(this)} that={that}/>
                                            <p className="noticeText rml10 rmt30"><Icon type="info-circle" className="rmr5"/>{that.state.renderData.modalData.confirmNotice}</p>
                                        </Row>:
                                        ""
                    }
                </Modal>
            </div>
        )
    }
}
authority_User.contextTypes = {
    router: React.PropTypes.object
}