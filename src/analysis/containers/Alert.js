import React from 'react';
import { Row , Col  ,Button ,  Input , Table , Icon , Modal , message } from 'antd';
const Search = Input.Search;
export default class analysis_Alert extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                tableData:{
                    total:0,
                    pagination:{},
                    data:[],
                    columns:[]
                },
                modalData:{
                    key:0,
                    visable:false,
                    type:'repair',
                    title:'确认操作',
                    text:''
                },
                alertInfoData:{
                    text:'',
                    state:"未处理",
                    title:'',
                    masterClass:"alertInfo  hide",
                    infoClass:"rmb30 text-right hide"
                }
            }
        }
    }
    //list
    repairClick(){
        var renderData=this.state.renderData;
        renderData.modalData.type='repair';
        renderData.modalData.text='解决方案/故障分析：';
        renderData.modalData.title='处理告警';
        renderData.modalData.key=Math.random();
        renderData.modalData.visable=true;
        this.setState({
            renderData:renderData
        })
    }
    ignoreClick(){
        var renderData=this.state.renderData;
        renderData.modalData.type='ignore';
        renderData.modalData.text='原因：';
        renderData.modalData.title='忽略告警';
        renderData.modalData.key=Math.random();
        renderData.modalData.visable=true;
        this.setState({
            renderData:renderData
        })
    }
    infoClick(){
        var renderData=this.state.renderData;
        renderData.alertInfoData.masterClass="alertInfo";
        this.setState({
            renderData:renderData
        })
        $('body').css('overflow-x','hidden');
        $('.content').css('position', 'relative');
    }
    //modalCLick
    confirmOKClick(){
        var renderData=this.state.renderData,that=this;
        if($('.modalTextarea').val().trim()!=''){
            switch (renderData.modalData.type){
                case 'repair':
                    renderData.alertInfoData.title="解决方案/故障分析:";
                    renderData.alertInfoData.state="已处理";
                    message.success('repair submit');
                    break;
                case "ignore":
                    renderData.alertInfoData.title="忽略告警原因:";
                    renderData.alertInfoData.state="已忽略";
                    message.success('ignore submit');
                    break;
            }
            renderData.alertInfoData.text=$('.modalTextarea').val();
            renderData.alertInfoData.infoClass="rmb30 text-right";
            renderData.modalData.visable=false;
            that.setState({
                renderData:renderData
            })
        }else{
            message.error(renderData.modalData.type=='repair'?'解决方案/故障分析不能为空':'忽略告警原因不能为空');
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
            title: '告警时间',
            dataIndex: 'time'
        }, {
            title:'错误描述',
            dataIndex:'description'
        },{
            title:'处理状态',
            dataIndex:'state'
        },{
            title: '操作',
            dataIndex: 'operate',
            render: () => <div><a onClick={this.repairClick.bind(this)}>处理</a><a className="rml15" onClick={this.ignoreClick.bind(this)}>忽略</a><a onClick={this.infoClick.bind(this)} className="rml15">详情</a></div>,
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
                    time:`2017-3-3 12:01:12`,
                    description:'啊收到了饭卡上的了放假啊是',
                    state:`已处理`,
                    operate:{state:'1',key:i}
                }
            )
        }
        const pagination={
            showSizeChanger:true,
            pageSizeOptions:['10','20','30','50','100']
        }
        let renderData=this.state.renderData;
        renderData.tableData.columns=columns;
        renderData.tableData.total=data.length;
        renderData.tableData.data=data;
        renderData.tableData.pagination=pagination;
        this.setState({
            renderData:renderData
        });
    }
    componentDidMount(){
        this.fetch(100)
    }
    //backClick
    backClick(){
        var renderData=this.state.renderData;
        renderData.alertInfoData={
            text:'',
            state:"未处理",
            title:'',
            masterClass:"alertInfo  hide",
            infoClass:"rmb30 text-right hide"
        }
        this.setState({
            renderData:renderData
        });
        $('body').css('overflow-x','auto');
        $('.content').css('position', 'static');
    }
    render(){
        return(
            <div className="tableContent analysisBox">
                <Row className="rmb20">
                    <Col span={24}>
                        <h3>告警记录</h3>
                    </Col>
                </Row>
                <Row className="rmb30">
                    <Col span={12}>

                    </Col>
                    <Col span={12}>
                        <Search
                            placeholder="请输入关键字进行搜索"
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
                <Table pagination={this.state.renderData.tableData.pagination}  columns={this.state.renderData.tableData.columns} dataSource={this.state.renderData.tableData.data} />
                <Modal
                    title={this.state.renderData.modalData.title}
                    visible={this.state.renderData.modalData.visable}
                    key={this.state.renderData.modalData.key}
                    onCancel={this.confirmCancel.bind(this)}
                    className="analysisBox"
                    footer={<div className="text-center"><Button onClick={this.confirmOKClick.bind(this)} type="primary" className="blueBtn">确认</Button><Button onClick={this.confirmCancel.bind(this)} className="rml15 grayBtn">取消</Button></div>}
                >
                    <Row>
                        <Col  span={24} style={{textAlign:'left',marginBottom:'15px'}}>
                            {this.state.renderData.modalData.text}
                        </Col>
                        <Col span={2}/>
                        <Col span={20}>
                            <Input type="textarea" className="modalTextarea" rows={6} />
                        </Col>
                    </Row>
                </Modal>
                <div className={this.state.renderData.alertInfoData.masterClass}>
                    <Row style={{padding:'10x',paddingLeft:'20px'}} className="rml15 alertInfoTitle">
                        <Col  span={24}>
                            <a className="rfl" style={{borderRight:'1px solid #ddd'}} onClick={this.backClick.bind(this)}> <Icon type="left"/>返回</a>
                            <h3 className="rml10 rfl">告警记录详情</h3>
                        </Col>
                    </Row>
                    <Row className="alertInfoContent">
                        <Col className="rmb30 text-right"  span={3}>
                            <span>告警时间: </span>
                        </Col>
                        <Col className="rmb30" span={21}>
                            <span className="rml15"> 2017-7-10 12:01:12</span>
                        </Col>

                        <Col className="rmb30 text-right" span={3}>
                            <span>错误描述: </span>
                        </Col>
                        <Col className="rmb30" style={{marginLeft: '215px',display: 'block',marginTop: '-55px'}} span={22}>
                            <span  > asdf发生的卡上飞机喀什地方囧啊睡觉法律；空间阿里；时刻都将发生；离开的房间阿斯利康的飞机啊了开始减肥撒离开</span>
                        </Col>
                        <Col className="rmb30 text-right" span={3}>
                            <span>处理状态: </span>
                        </Col>
                        <Col className="rmb30" span={21}>
                            <span className="rml15">{this.state.renderData.alertInfoData.state}</span>
                            {
                                this.state.renderData.alertInfoData.state=="未处理"?
                                    <span>
                                        <a className="rml50" style={{borderRight:'1px solid #009ace',paddingRight:'10px'}} onClick={this.repairClick.bind(this)}>处理</a>
                                        <a className="rml10" onClick={this.ignoreClick.bind(this)} >忽略</a>
                                    </span>
                                    :
                                    ""
                            }
                        </Col>
                        <Col className={this.state.renderData.alertInfoData.infoClass} span={3}>
                            <span>{this.state.renderData.alertInfoData.title}</span>
                        </Col>
                        <Col className="rmb30" style={{marginLeft: '215px',display: 'block',marginTop: '-55px'}} span={21}>
                            <span >{this.state.renderData.alertInfoData.text}</span>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}