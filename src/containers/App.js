import React ,{ Component } from 'react'
import  'antd/dist/antd.css';
import '../public/css/R.css';
import '../public/font/iconfont.css';
import '../public/css/Liang.css';
import Top from '../components/layout/topNav';
import Left from '../components/layout/leftNav';
import ImgModal from "../client/component/img.modal"
import $ from 'jquery';
import { BackTop } from 'antd';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            current:"mail"
        }
    }
    componentDidMount(){
        if(this.props.location.pathname!='/') {
            $('body').css('background-color','#ffffff');
            $('.content').css('background-color','#ffffff');
        }else{
            $('body').css('background-color','#edf4f5');
            $('.content').css('background-color','#edf4f5');
        }
    }
    componentDidUpdate(){
        if(this.props.location.pathname!='/') {
            $('body').css('background-color','#ffffff');
            $('.content').css('background-color','#ffffff');
        }else{
            $('.content').css('background-color','#edf4f5');
            $('body').css('background-color','#edf4f5');
        }
    }
    render() {
        const {location}=this.props;
        return (
            <div>
                <Top/>
                {location.pathname=="/log"||location.pathname=="/"?
                    "":
                    <Left that={this}/>
                }
                <div  className={location.pathname=="/log"||location.pathname=="/"?"content noLeft":"content"} style={{'backgroundColor':'#edf4f5'}}>
                    { this.props.children }
                </div>
                <BackTop />
                <ImgModal />
            </div>

        )
    }
}