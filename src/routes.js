import 'babel-polyfill'
import React from 'react';
import { render } from 'react-dom'
import { Router, Route, hashHistory,IndexRoute } from 'react-router';
import { Provider } from 'react-redux'
import App from './containers/App';
import Signin from './containers/Signin';
import index from './containers/index';
import analysis_NS from  './analysis/containers/NSServer'
import analysis_User from  './analysis/containers/User'
import analysis_Alert from  './analysis/containers/Alert'
import analysis_Domain from  './analysis/containers/Domain'
import Client from "./client/containers/client.js"
import ClientIndex from "./client/containers/client.index.js";
import ClientMangAll from "./client/containers/client.management.all.js"
import ClientMangPer from "./client/containers/client.management.personal.js"
import ClientMangPri from "./client/containers/client.management.enterprise.js"
import ClientManageInfo from "./client/containers/client.management.info.js"
import ClientMessage from "./client/containers/client.message.js"
import ClientMsgAll from "./client/containers/client.message.all.js"
import ClientMsgSend from "./client/containers/client.message.send.js"
import OperateLog  from "./client/containers/operate.log"
import AccountInfo from "./client/containers/account.info"
import AccountConfig from "./client/containers/account.config"
import {store} from './store.js'
import authority_User from './authority/container/user/User'
import authority_Strategy from './authority/container/strategy/Strategy'
import authority_Department from './authority/container/department/Department'
import authority_departmentInfo from './authority/container/department/departmentInfo'
import authority_UserInfo from './authority/container/user/userInfo'
import authority_addUser from'./authority/container/user/addUser'
import authority_perStrategyInfo from './authority/container/strategy/preStrategyInfo';
import authority_cusStrategyInfo from './authority/container/strategy/cusStrategyInfo';
import authority_addCusStrategy  from './authority/container/strategy/addCusStrategy';

let rootElement = document.getElementById('app');

render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={index}/>
                <Route path="/client" component={Client}>
                    <Route path="/client_management" component={ClientIndex}>
                        <IndexRoute component={ClientMangAll}/>
                        <Route path="/client_management/all" component={ClientMangAll}/>
                        <Route path="/client_management/personal" component={ClientMangPer}/>
                        <Route path="/client_management/enterprise" component={ClientMangPri}/>
                    </Route>
                    <Route path="/client_management/info" component={ClientManageInfo}/>
                    <Route path="/client_message" component={ClientMessage}>
                        <IndexRoute component={ClientMsgAll}/>
                        <Route path="/client_message/all" component={ClientMsgAll}/>
                        <Route path="/client_message/send" component={ClientMsgSend}/>
                    </Route>
                </Route>
                <Route path="/log" component={OperateLog}/>
                <Route path="/account_config" component={AccountConfig}/>
                <Route path="/account_info" component={AccountInfo}/>
                <Route path="/analysis_ns" component={analysis_NS}></Route>
                <Route path="/analysis_user" component={analysis_User}></Route>
                <Route path="/analysis_alert" component={analysis_Alert}></Route>
                <Route path="/analysis_domain" component={analysis_Domain}></Route>
                <Route path="/authority_user" component={authority_User}></Route>
                <Route path="/authority_user/info" component={authority_UserInfo}></Route>
                <Route path="/authority_user/add" component={authority_addUser}></Route>
                <Route path="/authority_department" component={authority_Department}></Route>
                <Route path="/authority_department/info" component={authority_departmentInfo} />
                <Route path="/authority_strategy" component={authority_Strategy}></Route>
                <Route path="/authority_strategyPre/info" component={authority_perStrategyInfo}></Route>
                <Route path="/authority_strategyCus/info" component={authority_cusStrategyInfo}></Route>
                <Route path="/authority_strategyCus/add" component={authority_addCusStrategy}></Route>
            </Route>
            <Route path="/signin" component={Signin}/>
        </Router>
    </Provider>,
    rootElement
);
