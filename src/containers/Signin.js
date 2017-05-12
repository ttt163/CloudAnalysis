/**
 * Created by Liang on 2017/2/6/0006.
 */
import React from 'react';
import { render } from 'react-dom';
import { Layout , Row , Col , Form, Icon, Input, Button, Checkbox } from 'antd';
const {  Content } = Layout;
const FormItem = Form.Item;

const signForm=React.createClass({
    handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
            this.props.that.context.router.push('/');
        }
    });
    },
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button  htmlType="submit" className="login-form-button signBtn">
                        登录
                    </Button>
                </FormItem>
            </Form>
        )
    }
})
const _signForm = Form.create()(signForm);

export default  class Signin extends React.Component{
    constructor(state) {
        super(state);
    }
    render() {
        return(
            <Layout className="layout">
                <Content style={{ padding: '0 50px' }} className="signBg">
                    <Row type="flex" justify="center">
                        <Col span={6} className="signFormBox">
                            <p className="sign-logo"></p>
                            <_signForm that={this}/>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }
}
Signin.contextTypes = {
    router: React.PropTypes.object
}