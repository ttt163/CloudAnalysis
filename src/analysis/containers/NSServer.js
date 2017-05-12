
import React from 'react';
import { Row   , Col , Button , Icon , Input , Table , Switch , Modal , message , Checkbox } from 'antd';
const Search = Input.Search;
export default class analysis_NS extends React.Component{
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
    //添加事件
    addNSClick(){
        var that = this;
        if($('tbody').find('.addons').length==0){
            $('tbody').append('<tr id="addNSBox"  class="addons"><td></td><td><input class="ant-input" style="width:60%" type="text"/><button type="button" class="addonsBtn blueBtn ant-btn ant-btn-primary rml10">保存</button><button type="button" class="addonsCancelBtn grayBtn ant-btn  rml10">取消</button></td><td></td><td></td></tr>');
            var h = $(document).height()-$(window).height();
            $(document).scrollTop(h);
            $('#addNSBox').find('input').focus();
            $('.addonsBtn').on('click',function(){
               if($(this).prev().val().trim()!=''){
                   message.success('添加成功');
                   that.fetch(101);
                   $(this).closest('.addons').remove();
               }else{
                   message.error('服务器名称不能为空!');
               }
            });
            $('.addonsCancelBtn').on('click',function(){
                $(this).closest('.addons').remove();
            });
        }else{
            message.warn('您有新添加的NS服务器未保存，请先保存');
        }
    }

    //单条删除
    deleteClick(e){
        var renderData=this.state.renderData;
        renderData.modalData.type='single';
        renderData.modalData.title='确认操作';
        renderData.modalData.visable=true;
        renderData.modalData.confirmText="确定删除 "+$(e.target).attr('data-name')+' 吗？';
        this.setState({
            renderData:renderData
        })
    }

    //多条删除
    multiDeleteClick(e){
        var renderData=this.state.renderData;
        renderData.modalData.type="multi";
        renderData.modalData.title='确认操作';
        renderData.modalData.multiSelectedRowkeys=renderData.tableData.selectedRowkeys;
        renderData.modalData.key=Math.random();
        if(renderData.tableData.selectedRowkeys.length>0){
            renderData.modalData.visable=true;
            this.setState({
                renderData:renderData
            })
        }else{
            message.error('请选择要删除的NS服务器');
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

   //备注点击
    remarkClick(e){
        var renderData=this.state.renderData;
        renderData.modalData.key=Math.random();
        renderData.modalData.type="remark";
        renderData.modalData.title=$(e.target).attr('data-name');
        renderData.modalData.visable=true;
        this.setState({
            renderData:renderData
        })
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
        });
    }

    fetch(i){
        const columns = [{
            title: 'NS服务器名称',
            dataIndex: 'ns'
        }, {
            title: '禁用/启用',
            dataIndex: 'control',
            render: (flag) => <div><Switch  defaultChecked={flag}/></div>,
        }, {
            title: '操作',
            dataIndex: 'operate',
            render: (data) => <div><a onClick={this.deleteClick.bind(this)} data-name={data.name} data-id={data.id} >删除</a><a data-id={data.id} data-name={data.name} onClick={this.remarkClick.bind(this)} className="rml15">备注</a></div>,
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
                    ns:`NS服务器${i}`,
                    control:true,
                    operate:{id:'123',name:`NS服务器${i}`}
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
        this.fetch();
    }
    render(){
        let that = this;
        return(
           <div className="tableContent analysisBox">
               <Row className="rmb20">
                   <Col span={24}>
                       <h3>NS服务器</h3>
                   </Col>
               </Row>
               <Row className="rmb30">
                   <Col span={12}>
                       <Button size="large" onClick={this.addNSClick.bind(this)}  className="blueBtn" type="primary">
                           <Icon type="plus"/>
                           添加
                       </Button>
                       <Button size="large" onClick={this.multiDeleteClick.bind(this)} disabled={this.state.renderData.disabled.btn} className="rml15 grayBtn "><Icon type="delete"/>删除</Button>
                   </Col>
                   <Col span={12}>
                       <Search
                           placeholder="请输入NS服务器名称进行搜索"
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
                       this.state.renderData.modalData.type=='single' ?
                           <p>{that.state.renderData.modalData.confirmText}</p>
                           :
                           that.state.renderData.modalData.type=='multi' ?
                               <Row>
                                   <h3 className="rmb30 rml10" style={{textAlign:'left'}}>确定删除如下已选NS服务器？</h3>
                                   {
                                       that.state.renderData.tableData.selected.map(function(value,index){
                                           return (
                                               <Col className="rmb15" key={index} span={8}>
                                                   <Checkbox  defaultChecked={true}  onChange={that.multiModalCheck.bind(that,value.key)}>{value.ns}</Checkbox>
                                               </Col>
                                           )
                                       })
                                   }
                               </Row>
                               :
                                <Row>
                                    <Col  span={2}>
                                        备注
                                    </Col>
                                    <Col span={22}>
                                        <Input type="textarea"  rows={6} />
                                    </Col>
                                </Row>

                   }
               </Modal>
           </div>

        )
    }
}