import React ,{ Component }from 'react';
import { render } from 'react-dom';
import { Menu, Icon , Tooltip} from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Top extends  Component{
    constructor(props) {
        super(props);
        this.state = {
            current: 'index',
        }
    }
    topHandleClick(e){
        this.context.router.push({pathname: e.key });
    }
    render() {
        return (
            <div className="header">
                <div className="logo">
                    后台管理系统
                </div>
                <Menu
                    onClick={this.topHandleClick.bind(this)}
                    selectedKeys={[this.state.current]}
                    theme="dark"
                    mode="horizontal"
                >
                    <Menu.Item key="/">
                        总览
                    </Menu.Item>
                    <SubMenu className="productNav" title={<span>云产品 <Icon type="down"></Icon></span>}>
                        <MenuItemGroup title="对象存储与CDN">
                            <Menu.Divider></Menu.Divider>
                            <Menu.Item key="/storage"><i className="iconfont icon-portal-icon-cunchu"></i>对象存储</Menu.Item>
                            <Menu.Item key="/cdn"><i className="iconfont icon-cdn"></i>CDN</Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="域名服务">
                            <Menu.Divider></Menu.Divider>
                            <Menu.Item key="/analysis_ns"><i className="iconfont icon-fenxi"></i>云解析</Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="开发者工具">
                            <Menu.Divider></Menu.Divider>
                            <Menu.Item key="/log"><i className="iconfont icon-comiisfariji"></i>操作日志</Menu.Item>
                            <Menu.Item key="/authority_user"><i className="iconfont icon-yonghu"></i>用户与权限</Menu.Item>
                            <Menu.Item key="/client_management/all"><i className="iconfont icon-customer-mgr"></i>客户管理</Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                    <Menu.Item  className="floatR" style={{padding:0}} key="/log">
                        <Tooltip placement="bottom"  title={"操作记录"}>
                            <span className="topIconRepair">
                                <Icon className="rMl5" type="file-text" />
                            </span>
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item  className="floatR" style={{padding:0}} key="5">
                        <Tooltip placement="bottom"  title={"待办事项"}>
                            <span  className="topIconRepair">
                                 <Icon className="rMl5" type="mail" />
                            </span>
                        </Tooltip>
                    </Menu.Item>
                    <SubMenu className="userDropdown floatR" title={<span>liangmeng<Icon className="rMl5" style={{position:'relative',top:'2px'}} type="down"></Icon></span>}>
                        <Menu.Item key="/account_config">安全设置</Menu.Item>
                        <Menu.Item key="/account_info">基本资料</Menu.Item>
                        <Menu.Divider></Menu.Divider>
                        <Menu.Item key="/signin"><Icon type="poweroff" />退出当前账户</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}
Top.contextTypes = {
    router: React.PropTypes.object
}