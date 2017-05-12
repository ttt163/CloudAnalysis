import React ,{ Component }from 'react';
import { render } from 'react-dom';
import {  Menu  } from 'antd';
export default class Left extends  Component{
    constructor(props) {
        super(props);
        this.state={
            current: '1',
            openKeys: [],
            style:{
                isShow:true,
                collapseBtnIcon:"iconfont icon-left",
                collapseBtn:'collapseBtn',
            },
            renderData:{
                showLeft:false,
                //配置左侧导航数据JSON
                '/analysis':{
                    name:'云解析',
                    items:[{key:'/analysis_ns',name:'NS服务器管理'},{key:'/analysis_domain',name:'域名管理'},{key:'/analysis_user',name:'用户管理'},{key:'/analysis_alert',name:'告警记录'}]
                },
                '/client':{
                    name:'客户管理',
                    items:[{key:'/client_management/all',name:'客户信息'},{key:'/client_message/all',name:'消息中心'}]
                },
                '/authority':{
                    name:'用户与权限',
                    items:[{key:'/authority_user',name:'用户管理'},{key:'/authority_department',name:'部门管理'},{key:'/authority_strategy',name:'策略管理'}]
                },
                '/account':{
                    name:'账户管理',
                    items:[{key:'/account_config',name:'安全设置'},{key:'/account_info',name:'基本资料'}]
                }
            }
        }
    }
    componentDidMount(){
        //左侧选中变化，根据地址的变化而变化
        var that=this.props.that,_index='0';
        if(that.props.location.pathname!='/') {
            var route=that.props.location.pathname.substring(0,).split('_')[0];
            this.state.renderData[route]['items'].map(function(value,index){
                if(value.key.indexOf("/",1)==-1){
                    if(that.props.location.pathname.indexOf(value.key)>-1){
                        _index=index.toString();
                    }
                }else{
                    var _path=value.key.substring(0,value.key.indexOf("/",1));
                    if(that.props.location.pathname.indexOf(_path)!=-1){
                        _index=index.toString();
                    }
                }
                //console.log(that.props.location.pathname);

            });
            if(this.state.current!=_index){
                this.setState({
                    current:_index
                })
            }
        }
    }
    componentDidUpdate(){
        var that=this.props.that,_index='0';
        if(that.props.location.pathname!='/') {
            //左侧选中变化，根据地址的变化而变化
            var route=that.props.location.pathname.split('_')[0];
            this.state.renderData[route]['items'].map(function(value,index){
                if(value.key.indexOf("/",1)==-1){
                    if(that.props.location.pathname.indexOf(value.key)>-1){
                        _index=index.toString();
                    }
                }else{
                    var _path=value.key.substring(0,value.key.indexOf("/",1));
                    if(that.props.location.pathname.indexOf(_path)!=-1){
                        _index=index.toString();
                    }
                }

            });
            if(this.state.current!=_index){
                this.setState({
                    current:_index
                })
            }
        }
    }
    //左侧点击时间
    handleClick = (e) => {
        this.setState({ current: e.key });
        this.context.router.push(e.item.props.className);
    }
    //展开收起
    collpaseClick(){
        var that = this;
       if(this.state.style.isShow){
           that.setState({
               style:{
                   isShow:false,
                   collapseBtnIcon:"iconfont icon-right",
                   collapseBtn:'collapseBtnInverse',
               }
           })
           $('.Lefter').animate({'margin-left':'-240px'},'fast' ,'swing');
           $('.content').animate({'margin-left':'0'},'fast','swing');
       }else{
           that.setState({
               style:{
                   isShow:true,
                   collapseBtnIcon:"iconfont icon-left",
                   collapseBtn:'collapseBtn',
               }
           })
           $('.Lefter').animate({'margin-left':'0'},'fast','swing');
           $('.content').animate({'margin-left':'240px'},'fast','swing');
       }
    }

    componentWillUnmount() {
        $('.content').css({'margin-left':'240px'});
    }
    render(){
        var that=this.props.that;
        var route=that.props.location.pathname.split('_')[0];
        //如果不是根目录，显示左侧导航（可以追加，如果不想要左导航，把地址放入条件中即可）
        if(that.props.location.pathname!='/') {
            this.state.renderData.showLeft = true;
        }else{
            this.state.renderData.showLeft = false;
        }
        return(
            <div className={this.state.renderData.showLeft==true ? 'Lefter' : 'Lefter hide'}>
                <span className={this.state.style.collapseBtn} onClick={this.collpaseClick.bind(this)}><i className={this.state.style.collapseBtnIcon}></i></span>
                <h2 className="moudleTitle">
                    {
                        this.state.renderData.showLeft==true ?
                            this.state.renderData[route]['name']:''
                    }
                </h2>
                {
                    this.state.renderData.showLeft==true?
                        <Menu
                            mode="vertical"
                            defaultSelectedKeys={['0']}
                            selectedKeys={[this.state.current]}
                            onClick={this.handleClick}
                            className="leftBar"
                        >
                            {
                                    this.state.renderData[route]['items'].map(function(value,index){
                                        return(
                                            <Menu.Item className={value.key}  key={index} >{value.name}</Menu.Item>
                                        )
                                    })
                            }
                        </Menu>:''
                }
            </div>
        )
    }
}
Left.contextTypes = {
    router: React.PropTypes.object
}