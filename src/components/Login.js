import React from 'react';
import { connect } from "react-redux";
import { loginUser } from "../redux/actions";
import { Form, Input, Button, Checkbox } from 'antd';
import { BACKEND_URL } from "../constants";
import { withRouter } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const validateMessages = {
  required: "${label} je nužno upisati!",
  types: {
    email: "${label} nije ispravna email adresa!",
  },
};

class LoginComponent extends React.Component {
  // constructor(props) {
  //   super(props);
  //   if(this.props.logged) {
  //     this.props.history.push('/home')
  //   }
  // }
  onFinish = (values) => {
    const fromData = values.user;

    const requestBody = {
      email: fromData.email,
      password: fromData.password,
    };

    fetch(`${BACKEND_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.message)
        } else {
          console.log(data);
          this.props.dispatch({
            ...data
          });
          this.props.history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="login_section">
        <h1>👤 Log in</h1>
        <Form
          {...layout}
          name="nest-messages"
          className="login_form"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            label="E-mail"
            name={["user", "email"]}
            rules={[{
              required: true,
              type: 'email'
            }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lozinka"
            name={["user", "password"]}
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (user) => dispatch(loginUser(user))
  }
}

const mapStateToProps = (state) => {
  return {
    logged: !(state.user === {})
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginComponent));