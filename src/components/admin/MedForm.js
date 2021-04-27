import React from 'react';
import {Button, Form, Input, InputNumber, Select} from "antd";
import {BACKEND_URL} from "../../constants";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
const { Option } = Select;

function MedForm(props) {
  console.log("props", props)

  const { activeSubstance, atk, manufacturer, form } = props;

  const activeSubstanceList = activeSubstance.map(ingredient => {
    return (
      <Option key={ingredient.substanceid} value={ingredient.substanceid}>{ingredient.substancename}</Option>
    )
  });
  const atkList = atk.map(currAtk => {
    return (
      <Option key={currAtk.atkid} value={currAtk.atkid}>{currAtk.atkname + ' - ' + currAtk.atkdescription}</Option>
    )
  });
  const manufacturerList = manufacturer.map(currMan => {
    return (
      <Option key={currMan.manufacturerid} value={currMan.manufacturerid}>{currMan.manufacturername}</Option>
    )
  });
  const formList = form.map(currForm => {
    return (
      <Option key={currForm.formid} value={currForm.formid}>{currForm.formname}</Option>
    )
  });

  const validateMessages = {
    required: '${label} je nužno upisati!',
    types: {
      number: 'Neispravan broj'
    },
    number: {
      min: '${label} mora biti veća od 0!'
    }
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const onFinish = (values) => {
    const formData = {};
    for(let data in values) {
      if(values[data] !== '') formData[data] = values[data]
    }
    console.log("form data", formData)

    fetch(BACKEND_URL+props.path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("data", data);
          alert(data.message)
        } else {
          props.history.push('/shop');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <br/>
      <br/>
      <Form
        {...layout}
        className="login_form"
        initialValues={props.initialValues}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name="name"
          label="Ime lijeka"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="formerName"
          label="Stariji naziv"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="packing"
          label="Pakiranje"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="pictureUrl"
          label="Poveznica na sliku"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Količina"
          rules={[{
            required: true,
            type: 'number',
            min: 0
          }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="measuringUnit"
          label="Mjerna jedinica"
          hasFeedback
          rules={[{ required: true, message: 'odaberite mjernu jedinicu' }]}
        >
          <Select
            showSearch
            placeholder="Odaberite mjernu jedinicu"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {[<Option key={'mg'} value={'mg'}>mg</Option>, <Option key={'komad'} value={'komad'}>komad</Option>]}
          </Select>
        </Form.Item>

        <Form.Item
          name="atkId"
          label="ATK"
          hasFeedback
          rules={[{ required: true, message: 'odaberite ATK' }]}
        >
          <Select
            showSearch
            placeholder="Odaberite ATK"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {atkList}
          </Select>
        </Form.Item>

        <Form.Item
          name="substanceId"
          label="Aktivna substanca"
          hasFeedback
          rules={[{ required: true, message: 'odaberite aktivnu substancu' }]}
        >
          <Select
            showSearch
            placeholder="Odaberite aktivnu substancu"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {activeSubstanceList}
          </Select>
        </Form.Item>

        <Form.Item
          name="formId"
          label="Farmaceutski oblik"
          hasFeedback
          rules={[{ required: true, message: 'odaberite farmaceutski oblik' }]}
        >
          <Select
            showSearch
            placeholder="Odaberite farmaceutski oblik"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {formList}
          </Select>
        </Form.Item>

        <Form.Item
          name="manufacturerId"

          label="Proizvođač"
          hasFeedback
          rules={[{ required: true, message: 'odaberite proizvođača' }]}
        >
          <Select
            showSearch
            placeholder="Odaberite proizvođača"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {manufacturerList}
          </Select>
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

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

export default connect(mapStateToProps)(withRouter(MedForm));