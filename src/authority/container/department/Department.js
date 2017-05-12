/**
 * Created by Liang on 2017/4/24.
 */
import React from 'react';
import { Row , Col  , Input , Table , Button , Modal , Icon , message  , Select , Form} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
let departForm;
class departmentForm extends React.Component{
    render(){
        departForm=this;
        const { getFieldDecorator  } = this.props.form;
        return(
            <Form className="rmt15">
                <FormItem
                    labelCol={{ span : 6 }}
                    wrapperCol={{ span : 14 }}
                    label="部门名称:"
                    hasFeedback
                >
                    {getFieldDecorator('department', {
                        rules: [{ required: true, message: '请输入部门名称'}]
                    })(
                        <Input type="text" placeholder="请输入部门名称" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span : 6 }}
                    wrapperCol={{ span : 14 }}
                    label="部门角色:"
                >
                   部门主管，普通员工
                </FormItem>
                <FormItem
                    labelCol={{ span : 6 }}
                    wrapperCol={{ span : 14 }}
                    label="备注:"
                >
                    {getFieldDecorator('remark', {initialValue:''})(
                        <Input type="textarea" rows={5} placeholder="请输入备注" />
                    )}
                </FormItem>
            </Form>
        )
    }
}
const _departmentForm = Form.create()(departmentForm);
export default class authority_Department extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                disabled:{
                    btn:'disabled'
                },
                selects:[0],
                user:[],
                role:[{id:'1',name:'部门主管'},{id:'2',name:'普通员工'}]
            },
            tableData:{
                total:0,
                pagination:{},
                data:[],
                columns:[],
                rowSelection:{},
                selectedRowkeys:[],
                userConfig:{0:{}}
            },
            modalData:{
                key:0,
                type:'delete',
                title:'确认操作',
                confirmText: '',
                visable: false,
                multiSelectedRowkeys:[]
            }
        }
    }
    //创建部门
    createDepartmentClick(){
        const { modalData } = this.state;
        modalData.title="创建部门";
        modalData.key=Math.random();
        modalData.visable=true;
        modalData.type='department';
        this.setState({
            modalData:modalData
        })
    }
    //添加用户
    addUserClick(){
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
    //详情点击
    someoneInfoClick(e){
        this.context.router.push({
            pathname: '/authority_department/info',
            query: {
                name: $(e.target).text(),
                id:$(e.target).attr('data-id')
            }
        });
    }
    //删除点击
    deleteClick(e){
        const { modalData } = this.state;
        modalData.confirmText='确认删除 '+$(e.target).attr('data-name')+' ?'
        modalData.title="删除部门";
        modalData.key=Math.random();
        modalData.visable=true;
        modalData.type='delete';
        this.setState({
            modalData:modalData
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
        tableData.userConfig[index]['role']=value;
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
    //弹窗点击
    confirmOKClick(){
        const {tableData, modalData}=this.state;
        switch(modalData.type){
            case 'delete':
                message.success('delete submit');
                break;
            case 'department':
                departForm.props.form.validateFields((err, values) => {
                    if (!err) {
                        message.success(values.department+';'+values.remark)
                    }
                });
                break;
            case 'user':
                let flag=true;
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
            title: '部门名称',
            dataIndex: 'name',
            render: (text) => <a data-id={i}  onClick={this.someoneInfoClick.bind(this)}>{text}</a>
        }, {
            title:'备注',
            dataIndex:'remark'
        }, {
            title:'创建时间',
            dataIndex:'time'
        },{
            title: '操作',
            dataIndex: 'operate',
            render: (data) => <div><a data-name={data.name} onClick={this.addUserClick.bind(this)}>添加用户</a><a className="rml10" data-name={data.name} onClick={this.deleteClick.bind(this)}>删除</a></div>,
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
                    remark:'123123213',
                    time:'2017-04-27 11:20:02',
                    operate:{id:'dafsadf',name:`部门${i}`}
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
    }
    render(){
        const that = this;
        const {renderData , tableData , modalData } = this.state;
        return(
            <div className="tableContent analysisBox">
                <Row className="rmb20">
                    <Col span={24}>
                        <h3>用户管理</h3>
                    </Col>
                </Row>
                <Row className="rmb30">
                    <Col span={12}>
                        <Button size="large" onClick={this.createDepartmentClick.bind(this)}  className="blueBtn" type="primary"><Icon type="plus"/>新建部门</Button>
                        <Button size="large" onClick={this.addUserClick.bind(this,false)} disabled={this.state.renderData.disabled.btn} className="rml15 grayBtn "><Icon type="plus"/>添加用户</Button>
                    </Col>
                    <Col span={12}>
                        <Search
                            placeholder="请输入部门名称进行搜索"
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
                <Table rowSelection={tableData.rowSelection} pagination={tableData.pagination}  columns={tableData.columns} dataSource={tableData.data} />
                <div className="showTotal">
                    <span>已选 {tableData.selectedRowkeys.length} 项，共 {tableData.total} 项</span>
                </div>
                <Modal
                    title={modalData.title}
                    visible={modalData.visable}
                    key={modalData.key}
                    onCancel={this.confirmCancel.bind(this)}
                    className="analysisBox"
                    footer={<div className="text-center"><Button onClick={this.confirmOKClick.bind(this)} type="primary" className="blueBtn">确认</Button><Button onClick={this.confirmCancel.bind(this)} className="rml15 grayBtn">取消</Button></div>}
                >
                    {
                        modalData.type=='delete'?
                                <p>{modalData.confirmText}</p>
                            :
                            modalData.type=='department'?
                                <_departmentForm that={this}/>
                                :
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
                                    ''
                    }
                </Modal>
            </div>
        )
    }
}
authority_Department.contextTypes = {
    router: React.PropTypes.object
}