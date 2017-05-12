/**
 * Created by Liang on 2017/5/2.
 */
import React from  'react';
import { Row , Col , Icon , Button , Steps , message , Transfer , Alert , Anchor , Switch , Table , Input} from 'antd';
import { Link } from 'react-router';
const Step = Steps.Step;
const Linker  = Anchor.Link;
export default class authority_addCusStrategy extends React.Component{
    constructor(props){
        super(props);
        this.state={
            renderData:{
                current:0,
                transferShow:'hide',
                transferData: [],
                targetKeys: [],
                transTitle:['配置服务类型','开启权限'],
                authorityData:{
                    user:{
                        on:3,
                        total:5
                    },
                    analysis:{
                        on:1,
                        total:3
                    }
                }
            },
            tableData:{
                user:{
                    dataSource:[],
                    columns:[]
                },
                analysis:{
                    dataSource:[],
                    columns:[]
                }
            },
            submitData:{
                name:'',
                authority:[]
            }
        }
    }
    next() {
        const { renderData , submitData } = this.state;
        if(renderData.current==0&&submitData.name==''){
            message.error('策略名称不能为空');
        }else if(renderData.current==0&&submitData.authority.length==0){
            message.error('请选择业务权限');
        }else{
            renderData.current++;
            this.setState({ renderData });
        }
    }
    prev() {
        const { renderData } = this.state;
        renderData.current--;
        this.setState({ renderData });
    }
    //穿梭Change
    transferHandleChange(targetKeys, direction, moveKeys){
        var { renderData , submitData } = this.state;
        renderData.targetKeys=targetKeys;
        submitData.authority=targetKeys;
        console.log(targetKeys, direction, moveKeys);
        this.setState({ renderData:renderData , submitData:submitData });
    }
    //穿梭数据渲染
    getMock(){
        var  renderData  = this.state.renderData,data=[];
        for (let i = 0; i < 20; i++) {
            var _data = {
                key: i.toString(),
                name: `用户权限${i + 1}`
            }
            data.push(_data);
        }
        renderData.transferData=data;
        this.setState({
            renderData:renderData
        });
    }
    componentDidMount(){
        this.getMock();
        const { renderData , tableData } = this.state;
        tableData.user.dataSource=[
            {key:'1',name:{name:'只读访问所有策略',switch:false}},
            {key:'2',name:{name:'新增策略',switch:false}},
            {key:'3',name:{name:'删除策略',switch:false}},
            {key:'4',name:{name:'修改策略',switch:false}},
            {key:'5',name:{name:'关联/移除策略',switch:false}}
            ];
        tableData.user.columns= [
                {
                    title: '用户与权限功能( 已开启 '+ renderData.authorityData.user.on+ ' 项，共 '+ renderData.authorityData.user.total+' 项)',
                    dataIndex:'name',
                    render:data=><div><span className="floatL">{data.name}</span><Switch className="floatR rmr15" defaultChecked={data.switch}/></div>
                }
            ];
        tableData.analysis.dataSource=[
            {key:'1',name:{name:'NS服务器管理',switch:false}},
            {key:'2',name:{name:'域名管理',switch:false}},
            {key:'3',name:{name:'消息中心模块管理',switch:false}}
        ];
        tableData.analysis.columns= [
            {
                title: '云解析功能( 已开启 '+ renderData.authorityData.analysis.on+ ' 项，共 '+ renderData.authorityData.analysis.total+' 项)',
                dataIndex:'name',
                render:data=><div><span className="floatL">{data.name}</span><Switch className="floatR rmr15" defaultChecked={data.switch}/></div>
            }
        ];

        $(document).on('keydown', function(e){
            if(e.keyCode == 116){
            window.location.href="#/authority_strategyCus/add";
            }
        })
    }
    componentWillUnmount(){
        $(document).off('keydown');
    }
    render(){
        const { renderData , tableData } = this.state;
        const current = renderData.current;
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
                        <h3 className="infoTitleText">新建自定义策略</h3>
                    </Col>
                </Row>
                <Row className="rmt70">
                    <Steps style={{width:'70%',margin:'0 auto'}} current={current}>
                        {renderData.transTitle.map(item => <Step key={item} title={item}/>)}
                    </Steps>
                    <div className="infoContent addCusStrategy">
                        {
                            current == 0 ?
                                <div>
                                    <Alert  type="info" message="选择需要细化权限控制的业务，下一步可编辑该业务所允许执行的操作权限。"/>
                                    <Row  type="flex" justify="center"  className="rmt50">
                                        <Col   style={{lineHeight:'30px',width:845}}>
                                            策略名称:<Input onChange={(e)=>{
                                                const { submitData }= this.state;
                                                submitData.name=e.target.value;
                                                this.setState({ submitData:submitData });
                                        }} className="rml15" style={{width:200}}/>
                                        </Col>
                                    </Row>
                                    <Transfer
                                        dataSource={renderData.transferData}
                                        targetKeys={renderData.targetKeys}
                                        titles={['服务类型', '已选择']}
                                        showSearch
                                        className="rmt30"
                                        listStyle={{
                                            width: 400,
                                            height: 400,
                                        }}
                                        onChange={this.transferHandleChange.bind(this)}
                                        render={item => item.name}
                                    />
                                </div>
                               :
                                <div>
                                    <Alert className="rmb30"  type="info" message="可关闭/开启功能权限。"/>
                                    <Anchor bounds="0" style={{zIndex:2}} showInkInFixed={true} className="rPositionA" affix={false}>
                                        <Linker href="#user" title="用户与权限" />
                                        <Linker href="#analysis" title="云解析功能" />
                                    </Anchor>
                                    <Row  id="user" className="rmb30">
                                        <Col span={4} >

                                        </Col>
                                        <Col  span={20}>
                                            <Table
                                                pagination={false}
                                                dataSource={tableData.user.dataSource}
                                                columns={tableData.user.columns}
                                            />
                                        </Col>
                                    </Row>
                                    <Row id="analysis">
                                        <Col span={4} >

                                        </Col>
                                        <Col  span={20}>
                                            <Table
                                                pagination={false}
                                                dataSource={tableData.analysis.dataSource}
                                                columns={tableData.analysis.columns}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                        }

                    </div>
                    <div className="steps-action">
                        {
                            current< renderData.transTitle.length - 1
                            &&
                            <Button type="primary" className="blueBtn" onClick={this.next.bind(this)}>下一步</Button>
                        }
                        {
                            current > 0
                            &&
                            <Button  onClick={this.prev.bind(this)}>
                                上一步
                            </Button>
                        }
                        {
                            current === renderData.transTitle.length - 1
                            &&
                            <Button type="primary" style={{ marginLeft: 8 }} className="blueBtn" onClick={ () => message.success('Processing complete!')}>完成</Button>
                        }
                    </div>
                </Row>
            </div>
        )
    }
}
authority_addCusStrategy.contextTypes = {
    router: React.PropTypes.object
}