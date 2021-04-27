import React, {Component} from 'react'
import {BACKEND_URL} from "../../constants";
import {connect} from "react-redux";
import {Form, Button, Input, Divider} from 'antd';
import { withRouter } from "react-router-dom";

class PharmacyEdit extends Component {
  state = {
      pharmacy:{}
  }

  form = React.createRef();

  componentDidMount() {
      console.log(this.props.match.params.id)
    fetch(`${BACKEND_URL}/pharmacy/${this.props.match.params.id}`,
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
            this.setState({
                pharmacy: {
                    pharmacyName: data.pharmacyname,
                     OIB: data.oib,
                     address: data.address,
                     phone: data.phone,
                     city: data.city,
                     postalCode: data.postalcode,
                }            
            })
          const values = {              
            pharmacyName: data.pharmacyname,
            OIB: data.oib,
            address: data.address,
            phone: data.phone,
            city: data.city,
            postalCode: data.postalcode,
          }
          this.form.current.setFieldsValue(values)
          console.log(this.form.current)
        }
      }).catch(err => console.log(err))
  }

  onFinish = () => {
    if(this.state.pharmacy === {}) {
      this.cancel();
      return;
    }
    
    fetch(`${BACKEND_URL}/pharmacy/edit/${this.props.match.params.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.props.user.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(this.state.pharmacy)
      }).then(res => res.json())
      .then(data => {
          console.log(this.state.pharmacy)
        if(data.error) {
          alert(data.message)
        } else {

          //this.props.updateUser(this.state)
          this.cancel();
        }
      }).catch(err => console.log(err));
  }

  cancel = () => {
    this.props.history.push('/profile');
  }

  onValuesChange = (changed, all) => {
      console.log(changed)
    this.setState({
        pharmacy: {
            ...this.state.pharmacy,
            ...changed,
        }
    }, console.log(this.state.pharmacy))
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
         <div className="login_section" style={{marginTop:"2%"}}>
                <h1>⚕️ Uredi ljekarnu </h1>
      <Form
        {...layout}
          ref={this.form}
          validateMessages={validateMessages}
          onValuesChange={this.onValuesChange}
        name="nest-messages"
        onFinish={this.onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={"pharmacyName"}
          label="Naziv ljekarne"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={ "OIB"}
          label="OIB"
          rules={[
            {
              required: true,
              len: 11,
              message: "OIB mora biti dužine 11"
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={ "address"}
          label="Adresa ljekarne"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"postalCode"}
          label="Poštanski broj"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={ "city"}
          label="Grad"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"phone"}
          label="Telefon"
          rules={[
            {
              required: true,
              pattern: /^\+*[0-9]{6,}$/,
              message: "Upišite ispravan broj!",
            },
          ]}
        >
          <Input />
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
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withRouter(PharmacyEdit));