import React from "react";
import {connect, useSelector} from "react-redux";
import {createUser} from "../../redux/actions";
import {Form, Input, Button, Select} from "antd";
import {BACKEND_URL} from "../../constants";
import {withRouter} from 'react-router-dom'

const {Option} = Select;

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

class AddExistingEmployeeComponent extends React.Component {

  state = {
    modelData: [],
    id: "",
  };

  onSelect = (idUser) => {
    console.log(idUser)
    this.setState({
      id: idUser,
    })
  }

  componentDidMount() {
    fetch(`${BACKEND_URL}/employee/worker`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(data.error) {
          alert(data.message)
        } else {
          this.setState({
            modelData: data.users,
          });
          console.log(this.state.modelData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onFinish = (values) => {

    fetch(`${BACKEND_URL}/employee/worker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`
      },
      body: JSON.stringify({
        userId: this.state.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.error) {
          console.log("data", data);
          alert(data.message)
        } else {
          this.props.history.push('/employees/all');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    console.log(this.props)
    return (
      <div className="login_section" style={{marginTop: "2%"}}>

        <h1>👤Novi zaposlenik ljekarne </h1>
        <Form
          className="login_form"
          name="nest-messages"
          onFinish={this.onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item>
            <Select
              showSearch
              onSelect={(value) => this.onSelect(value)}
              placeholder="Odaberite korisnika"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.modelData.map(user => {
                return (
                  <Option
                    key={user.userid}
                    value={user.userid}
                  >
                    {user.firstname + ' ' + user.lastname + ' - ' + user.email}
                  </Option>
                )
              })
              }
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{...layout.wrapperCol, offset: 4}}>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddExistingEmployeeComponent));
