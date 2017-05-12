import React from 'react';
import { render } from 'react-dom';
import { Row , Col } from 'antd';

export default class index extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            renderData:{
                manageProData:[{name:'云解析',id:'1'}],
                wantedProData:[{name:'对象存储',id:'2'},{name:'CDN',id:'3'}],
                proIcons:{
                    '云解析':'iconfont icon-bianji2',
                    '对象存储':'iconfont icon-duixiangcunchu1',
                    'CDN':'iconfont icon-cdn1'
                },
                router:{
                    '云解析':'/analysis_ns',
                    '对象存储':'/storage',
                    'CDN':'/cdn'
                },
                todoSomething:{
                    order:4,
                    check:12
                }
            }

        }
    }

    productHandleClick(route){
        this.context.router.push(route);
    }

    render() {
        let that=this;
        return (
            <div className="index_content">
                <p className='rowEle'>欢迎，liangmeng用户</p>
                <Row className='rowGroup'>
                    <h3>待办事项</h3>
                    <Col className='todoBox'>
                        <span>{this.state.renderData.todoSomething.order}</span><span className="rml10">待处理工单</span>
                    </Col>
                    <Col className='todoBox'>
                        <span>{this.state.renderData.todoSomething.check}</span><span className="rml10">待审核的账户开通功能需求</span>
                    </Col>
                </Row>
                <Row className='rowGroup' gutter={16}>
                    <h3>管理中的云产品</h3>
                    {

                        this.state.renderData.manageProData.map(function(value,index){
                             return (
                                 <Col key={index} span={4}>
                                     <div className="productBox" onClick={that.productHandleClick.bind(that,that.state.renderData.router[value.name])}>
                                         <div className="floatL proLeftBox">
                                             <span><i key={value.id} className={that.state.renderData.proIcons[value.name]}></i></span>
                                         </div>
                                         <div  className="floatL proRightBox">
                                             <span>{value.name}</span>
                                         </div>
                                     </div>
                                 </Col>
                             )
                        })
                    }
                </Row>
                <Row className='rowGroup' gutter={16} >
                    <h3>您可能还需要管理以下产品</h3>
                    {
                        this.state.renderData.wantedProData.map(function(value,index){
                            return (
                                <Col key={index} span={4}>
                                    <div className="productBox"  onClick={that.productHandleClick.bind(that,that.state.renderData.router[value.name])}>
                                        <div className="floatL proLeftBox">
                                            <span><i key={value.id} className={that.state.renderData.proIcons[value.name]}></i></span>
                                        </div>
                                        <div  className="floatL proRightBox">
                                            <span>{value.name}</span>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        )
    }
}
index.contextTypes = {
    router: React.PropTypes.object
}