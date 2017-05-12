import React from 'react';
import { Row , Col , Button  , Input , Table , Switch , Modal , message , Checkbox , Tooltip} from 'antd';
const Search = Input.Search;
export default class analysis_Domain extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                disabled:{
                    btn:'disabled'
                },
                tableData:{
                    selectedRowkeys:[],
                    selected:[],
                    total:0,
                    pagination:{},
                    data:[],
                    columns:[],
                    rowSelection:{}
                },
                modalData:{
                    key:0,
                    type:'single',
                    title:'确认操作',
                    confirmText: '',
                    visable: false,
                    multiSelectedRowkeys:[]
                }
            }
        }
    }
    //禁用按钮
    disableClick(){
        var renderData=this.state.renderData;
        if(renderData.tableData.selectedRowkeys.length>0){
            renderData.modalData.type="multi";
            renderData.modalData.title='禁用';
            renderData.modalData.key=Math.random();
            renderData.modalData.multiSelectedRowkeys=renderData.tableData.selectedRowkeys;
            renderData.modalData.visable=true;
            renderData.modalData.confirmText="确定禁用所选域名吗？";
            this.setState({
                renderData:renderData
            })
        }else{
            message.error('请选择要禁用的域名');
        }
    }

    //启用按钮
    enableClick(){
        var renderData=this.state.renderData;
        if(renderData.tableData.selectedRowkeys.length>0){
            renderData.modalData.type="multi";
            renderData.modalData.title='启用';
            renderData.modalData.key=Math.random();
            renderData.modalData.visable=true;
            renderData.modalData.multiSelectedRowkeys=renderData.tableData.selectedRowkeys;
            renderData.modalData.confirmText="确定启用所选域名吗？";
            this.setState({
                renderData:renderData
            })
        }else{
            message.error('请选择要启用的域名');
        }
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
                    message.error('请选择要删除的NS服务器');
                }
                break;
            case "remark":
                message.success('remark submit');
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
            title: '域名',
            dataIndex: 'domain'
        },{
            title: '用户名',
            dataIndex: 'username'
        }, {
            title:'解析情况',
            dataIndex:'state'
        },{
            title: '禁用/启用',
            dataIndex: 'control',
            render: (flag) => <div><Switch  defaultChecked={flag}/></div>,
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
                    domain:`www.googdfgsdfgsdfgdsfgsddfgdsfggle${i}.com`,
                    username:`liangmeng${i}`,
                    state:'正常解析',
                    control:true
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
        renderData.tableData.total=data.length;
        renderData.tableData.columns=columns;
        renderData.tableData.data=data;
        renderData.tableData.rowSelection=rowSelection;
        renderData.tableData.pagination=pagination;
        this.setState({
            renderData:renderData
        });
        if(datas==0){
            $('.showTotal').addClass('hide');
        }else{
            $('.showTotal').removeClass('hide');
        }
    }

    componentDidMount(){
        this.fetch(100)
    }

    render(){
        let that = this;
        return(
            <div className="tableContent analysisBox">
                <Row className="rmb20">
                    <Col span={24}>
                        <h3>域名管理</h3>
                    </Col>
                </Row>
                <Row className="rmb30">
                    <Col span={12}>
                        <Button size="large" onClick={this.enableClick.bind(this)} disabled={this.state.renderData.disabled.btn} className="blueBtn" type="primary"><i className="iconfont icon-qiyong"></i>启用</Button>
                        <Button size="large" onClick={this.disableClick.bind(this)} disabled={this.state.renderData.disabled.btn} className="rml15 grayBtn "><i className="iconfont icon-disable"></i>禁用</Button>
                    </Col>
                    <Col span={12}>
                        <Search
                            placeholder="请输入域名或用户名进行搜索"
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
                <Table pagination={this.state.renderData.tableData.pagination} rowSelection={this.state.renderData.tableData.rowSelection} columns={this.state.renderData.tableData.columns} dataSource={this.state.renderData.tableData.data} />
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
                            that.state.renderData.modalData.type=='multi' ?
                                <Row>
                                    <h3  className="rmb30 rml10" style={{textAlign:'left'}}>{that.state.renderData.modalData.confirmText}</h3>
                                    {
                                        that.state.renderData.tableData.selected.map(function(value,index){
                                            return (
                                                <Col className="rmb15" key={index} span={8}>
                                                    <Tooltip title={value.domain}>
                                                        <Checkbox  defaultChecked={true}  onChange={that.multiModalCheck.bind(that,value.key)}>{value.domain}</Checkbox>
                                                    </Tooltip>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>:''
                    }
                </Modal>
            </div>
        )
    }
}