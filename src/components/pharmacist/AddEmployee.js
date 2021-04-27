import React from "react";
import { connect, useSelector } from "react-redux";
import { createUser } from "../../redux/actions";
import { Form, Input, Button } from "antd";
import { BACKEND_URL } from "../../constants";
import { withRouter } from 'react-router-dom'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "${label} je nužno upisati!",
  types: {
    email: "${label} nije ispravna email adresa!",
    number: "${label} nije ispravan broj mobitela!",
  },
};
    //var idEmployee = "";
    // var idPharmacy = "";

class CreateEmployeeComponent extends React.Component {


  onFinish = (values) => {
    const fromData = values.user;
    const { props } = this;

    const requestBody = {
      username: fromData.username,
      firstName: fromData.firstName,
      lastName: fromData.lastName,
      OIB: fromData.OIB,
      email: fromData.email,
      password: fromData.password,
      address: fromData.address,
      city: fromData.city,
      postalCode: fromData.postalCode,
      phone: fromData.phone,
    };

    fetch(`${BACKEND_URL}/signup/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    }, props)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.message);
        } else {
          //const token = useSelector(state => state.user.token);
          const idEmployee = data.userId;
          //this.props.history.push('/home');          
          console.log(props)
          return fetch(`${BACKEND_URL}/employee/worker`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
                userId: idEmployee,
              }),
          }) .then((response) => response.json())
        .then((data) => {

          console.log(data);
          if (data.error) {
            alert(data.message);
          } else {
            //idEmployee = data.idEmployee;
          }
        })
        .catch((err) => {
          console.log(err);
        });

        }
      })
      .catch((err) => {
        console.log(err);
      });
      this.props.history.push('/employees/all');
      };

  render() {
    console.log(this.props)
    return (
      <div className="login_section" style={{marginTop:"2%"}}>

        <h1>👤Novi zaposlenik ljekarne </h1>
        <Form
          {...layout}
          className="login_form"
          name="nest-messages"
          onFinish={this.onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={["user", "username"]}
            label="Korisničko ime"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["user", "firstName"]}
            label="Ime"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["user", "lastName"]}
            label="Prezime"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["user", "OIB"]}
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
            name={["user", "email"]}
            label="E-mail"
            rules={[
              {
                required: true,
                type: 'email'
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["user", "password"]}
            label="Lozinka"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name={["user", "address"]}
            label="Adresa"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["user", "postalCode"]}
            label="Poštanski broj"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["user", "city"]}
            label="Grad"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["user", "phone"]}
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

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
          </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (user) => dispatch(createUser(user))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEmployeeComponent));
