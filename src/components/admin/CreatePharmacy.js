import React from "react";
import { connect } from "react-redux";
import {Form, Input, Button, Divider} from "antd";
import { BACKEND_URL } from "../../constants";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

const validateMessages = {
  required: "${label} je nužno upisati!",
  types: {
    email: "${label} nije ispravna email adresa!",
    number: "${label} nije ispravan broj mobitela!",
  },
};

class CreatePharmacyComponent extends React.Component {
  
 onFinish = (values) => {
    console.log(values.pharmacy)
    const fromData = values.pharmacy;
    const adminData = values.admin;
    var idPharmacy = 0;
    const { props } = this;

    const requestBody = {
      pharmacyName: fromData.pharmacyName,
      OIB: fromData.OIB,
      email: fromData.email,
      password: fromData.password,
      address: fromData.address,
      city: fromData.city,
      postalCode: fromData.postalCode,
      phone: fromData.phone
    };

    const adminBody = {
      username: adminData.username,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      OIB: adminData.OIB,
      email: adminData.email,
      password: adminData.password,
      address: adminData.address,
      city: adminData.city,
      postalCode: adminData.postalCode,
      phone: adminData.phone,
    }
    console.log(adminBody);

    Promise.all([
    fetch(`${BACKEND_URL}/create-pharmacy/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    }),
      fetch(`${BACKEND_URL}/signup/user/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.props.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(adminBody),
      })], props )
    .then(([response1, response2]) =>
      ([response1.json().then(
        function(data1) {
           if(data1.error) {
          alert(data1.message);
        } else {
          idPharmacy = data1.pharmacyId;
          console.log(data1.pharmacyId);
          console.log(props);
        }
      }), response2.json().then(
        function(data2){
          if(data2.error) {
            alert(data2.message);
          } else {
            const idAdmin= data2.userId
            console.log(idAdmin);

            return fetch(`${BACKEND_URL}/employee/admin`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${props.token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                pharmacyId: idPharmacy,
                userId: idAdmin,
              }),
            }).then((response3) => response3.json().then(
              console.log({
                pharmacyId: idPharmacy,
                userId: idAdmin,
              }),
              )
              ).catch((err) => {
                console.log(err);
              })
            }  
        }
        
      )])
      ).catch((err) => {
        console.log(err);
      })
      this.props.history.push('/shop');
  }

  render() {
    console.log(this.props)
    return (
      <div className="login_section" style={{marginTop:"2%"}}>
                <h1>⚕️ Nova ljekarna </h1>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={this.onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["pharmacy", "pharmacyName"]}
          label="Naziv ljekarne"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["pharmacy", "OIB"]}
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
          name={["pharmacy", "address"]}
          label="Adresa ljekarne"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["pharmacy", "postalCode"]}
          label="Poštanski broj"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["pharmacy", "city"]}
          label="Grad"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["pharmacy", "phone"]}
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
        <Divider/>

        <Form.Item
          name={["admin", "username"]}
          label="Korisničko ime admina ljekarne"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        

        <Form.Item
          name={["admin", "firstName"]}
          label="Ime admina ljekarne"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["admin", "lastName"]}
          label="Prezime admina ljekarne"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["admin", "OIB"]}
          label="OIB admina"
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
          name={["admin", "email"]}
          label="E-mail admina lijekarne"
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
          name={["admin", "password"]}
          label="Lozinka"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={["admin", "address"]}
          label="Adresa"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["admin", "postalCode"]}
          label="Poštanski broj"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["admin", "city"]}
          label="Grad"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["admin", "phone"]}
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

export default connect(mapStateToProps)(CreatePharmacyComponent);