import React, {Component} from 'react'
import {BACKEND_URL} from "../../constants";
import {connect, useSelector} from "react-redux";
import {Form, Button, Input, Divider, Avatar} from 'antd';
import { withRouter } from "react-router-dom";
import {updateUser} from '../../redux/actions'
import {UserOutlined} from "@ant-design/icons";

class UserProfileEdit extends Component {
  state = {}

  form = React.createRef();

  componentDidMount() {
    fetch(`${BACKEND_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${this.props.user.token}`,
        }
      }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        if(data.error) {
          alert(data.message)
        } else {
          const values = {
            firstName: data.user.firstname,
            lastName: data.user.lastname,
            username: data.user.username,
            email: data.user.email,
            password: data.user.password
          }

          this.form.current.setFieldsValue(values)
        }
      }).catch(err => console.log(err))
  }

  onFinish = () => {
    if(this.state === {}) {
      this.cancel();
      return;
    }
    
    fetch(`${BACKEND_URL}/profile/edit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.props.user.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(this.state)
      }).then(res => res.json())
      .then(data => {
        if(data.error) {
          alert(data.message)
        } else {
          this.props.updateUser(this.state)
          this.cancel();
        }
      }).catch(err => console.log(err));
  }

  cancel = () => {
    this.props.history.push('/profile');
  }

  onValuesChange = (changed, all) => {
    this.setState(changed, () => console.log(this.state))
  }

  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };

    const tailLayout = {
      wrapperCol: { offset: 8, span: 8 },
    };

    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not a valid email!'
      }
    };

    console.log('render', this.state)

    return (
      <>
        <br/>
        <Avatar size={128} icon={<UserOutlined />} />
        <h3>{this.props.user.userType}</h3>
        <Divider />
        <Form
          {...layout}
          ref={this.form}
          validateMessages={validateMessages}
          onFinish={this.onFinish}
          onValuesChange={this.onValuesChange}
        >
          <Form.Item
            label="Korisničko ime"
            name="username"
            rules={[{ required: true, message: 'Unesite korisničko ime!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ime"
            name="firstName"
            rules={[{ required: true, message: 'Unesite ime!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Prezime"
            name="lastName"
            rules={[{ required: true, message: 'Unesite prezime!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Unesite email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lozinka"
            name="password"
            rules={[{ required: true, message: 'Unesite lozinku!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Divider type='vertical'/>
            <Button type="default" onClick={() => this.props.history.push('/profile')}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (data) => dispatch(updateUser(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserProfileEdit));