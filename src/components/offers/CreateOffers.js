import React from "react";
import {
  connect
} from "react-redux";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Select
} from "antd";
import {
  BACKEND_URL
} from "../../constants";
import moment from 'moment';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

const {Option} = Select;

class CreateOfferComponent extends React.Component {
  state = {
    meds: []
  }

  componentDidMount() {
    fetch(`${BACKEND_URL}/offer/create`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(data.error) {
          alert(data.message)
        } else {
          this.setState({meds: data.meds})
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onFinish = (values) => {
    const fromData = values;

    const requestBody = {

      medId: fromData.medId,
      price: fromData.price,
      amount: fromData.amount,
      expirationDate: fromData.expirationDate,
      discount: fromData.discount,

    };

    fetch(`${BACKEND_URL}/offer/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(data.error) {
          alert(data.message);
        } else {
          console.log(requestBody);
        }
      })
      .catch((err) => {
        console.log(err);
      });
      this.props.history.push('/shop');
  };

  render() {
    const validateMessages = {
      required: "${label} je nužno upisati!",
      types: {
        email: "${label} nije ispravna email adresa!",
        number: "${label} nije ispravan broj!",
      },
      number: {
        min: "${label} ne može biti manja od 0!",
        range: "${label} mora bitit izmeđi 0 i 100!"
      },
    };

    console.log(this.props)

    const options = this.state.meds.map(item =>
      <Option key={item.id} value={item.id}>{item.name} - {item.manufacturer} - {item.amount} {item.measuringunit} {item.activeingredient}</Option>
    )
    return (
      <div className="login_section" style={{margin: "2%"}}>


        <h1> 💊 Dodaj ponudu </h1>

        <Form
          {...layout}
          name="nest-messages"
          onFinish={this.onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={"medId"}
            label="Id lijeka"
            rules={[{required: true}]}
          >
            <Select
              showSearch
              placeholder="Odaberite lijek"
              dropdownMatchSelectWidth={false}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {options}
            </Select>
          </Form.Item>

          <Form.Item
            name={"price"}
            label="Cijena lijeka"
            rules={[{required: true, type: 'number', min: 0}]}
          >
            <InputNumber/>
          </Form.Item>

          <Form.Item
            name={"amount"}
            label="Količina po pakiranju"
            rules={[{required: true, type: 'number', min: 0}]}
          >
            <InputNumber/>
          </Form.Item>

          <Form.Item
            name={"expirationDate"}
            label="Rok trajanja"
            rules={[
              {
                required: true
              },
            ]}
          >
            <DatePicker disabledDate={(current) => current.isBefore(moment(), 'day')}/>
          </Form.Item>
          <Form.Item
            name={"discount"}
            label="Popust (%)"
            rules={[{required: true, type: 'number', min: 0, max: 100}]}
          >
            <InputNumber/>
          </Form.Item>

          <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
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

export default connect(mapStateToProps)(CreateOfferComponent);