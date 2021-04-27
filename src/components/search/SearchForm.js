import React, { useEffect } from 'react'
import { BACKEND_URL } from "../../constants";
import { Input, Select, Form, Button, Slider, DatePicker } from 'antd';
import { connect } from 'react-redux';
import { useHistory } from "react-router";

const { Search } = Input;
const { Option } = Select;

const marks = {
  0: '0 HRK',
  1000: {

    label: <>1000 HRK</>,
  },
};

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
}


const SearchForm = (props) => {

  const [form] = Form.useForm();

  const [activeSubstance, setActiveSubstance] = React.useState();
  const [atk, setAtk] = React.useState();
  const [medForm, setMedForm] = React.useState();
  const [manufacturer, setManufacturer] = React.useState();
  const [city, setCity] = React.useState();
  const [fetched, setFetched] = React.useState();

  console.log(props)

  const history = useHistory();



  useEffect(() => {



    setFetched(false) // initialize flag for getting get response
    // if (props.token === undefined) {
    //   history.push('/login');
    // }
    fetch(`${BACKEND_URL}/meds/search`,
      {
        headers: {
          Authorization: `Bearer ${props.token ?? null}`,
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.message)
        } else {


          setActiveSubstance(data.actsubstance);
          setAtk(data.atk);
          setMedForm(data.form);
          setManufacturer(data.manufacturer);
          setCity(data.city);
          setFetched(true)

        }
      })
      .catch((err) => {
        console.log(err);
      });

  }, [])

  let activeSubstanceList = [];
  let atkList = [];
  let medFormList = [];
  let manufacturerList = [];
  let cityList = [];
  if (fetched) {

    activeSubstanceList = activeSubstance.map(ingredient => {
      return (
        <Option key={ingredient.substanceid} value={ingredient.substanceid}>{ingredient.substancename}</Option>
      )
    });

    atkList = atk.map(ingredient => {
      return (
        <Option key={ingredient.atkid} value={ingredient.atkid}>{ingredient.atkname} - {ingredient.atkdescription}</Option>
      )
    });

    medFormList = medForm.map(ingredient => {
      return (
        <Option key={ingredient.formid} value={ingredient.formid}>{ingredient.formname} </Option>
      )
    });

    manufacturerList = manufacturer.map(ingredient => {
      return (
        <Option key={ingredient.manufacturerid} value={ingredient.manufacturerid}>{ingredient.manufacturername} </Option>
      )
    });

    cityList = city.map(ingredient => {

      return (
        <Option key={ingredient.cityid} value={ingredient.cityid}>{ingredient.cityname} </Option>
      )

    });
  }




  return (
    <Form
      className="offer_search_form"
      form={form}
      {...layout}
      validateMessages={validateMessages}
      name="nest-messages"
      onFinish={props.onFinish}

    >
      <Form.Item
        labelCol={{ span: 24 }}
        label="Ime lijeka"
        name={["search", "name"]}
        rules={[{
          required: false,

        }]}
      >
        <Search placeholder="Upisite ime lijeka" onSearch={form.submit} enterButton />

      </Form.Item>


      <Form.Item

        labelCol={{ span: 24 }}
        label="Raspon cijene lijeka"

        name={["search", "price_range"]}
        rules={[{
          required: false,

        }]}
      >
        <Slider range
          min={1}
          max={1000}
          marks={marks}
        />

      </Form.Item>


      <Form.Item
        labelCol={{ span: 24 }}
        label="Aktivna Tvar"

        name={["search", "substanceId"]}
        rules={[{
          required: false,

        }]}
      >
        <Select
          showSearch
          placeholder="Odaberite aktivnu tvar"
          optionFilterProp="children"


        >
          {activeSubstanceList}
        </Select>

      </Form.Item>


      <Form.Item
        labelCol={{ span: 24 }}
        label="AKT"
        name={["search", "atkId"]}
        rules={[{
          required: false,

        }]}
      >
        <Select
          showSearch
          placeholder="Odaberite ATK"
          optionFilterProp="children"


        >
          {atkList}
        </Select>

      </Form.Item>


      <Form.Item
        labelCol={{ span: 24 }}
        label="Forma lijeka"
        name={["search", "formid"]}
        rules={[{
          required: false,

        }]}
      >
        <Select
          showSearch
          placeholder="Odaberite formu lijeka"
          optionFilterProp="children"


        >
          {medFormList}
        </Select>

      </Form.Item>

      <Form.Item
        labelCol={{ span: 24 }}
        label="Proizvođač"
        name={["search", "manufacturerId"]}
        rules={[{
          required: false,

        }]}
      >
        <Select
          showSearch
          placeholder="Odaberite proizvođača"
          optionFilterProp="children"


        >
          {manufacturerList}
        </Select>

      </Form.Item>

      <Form.Item
        labelCol={{ span: 24 }}
        label="Grad"
        name={["search", "cityId"]}
        rules={[{
          required: false,

        }]}
      >
        <Select
          showSearch
          placeholder="Odaberite grad"
          optionFilterProp="children"


        >
          {cityList}
        </Select>

      </Form.Item>

      <Form.Item
        labelCol={{ span: 24 }}
        label="Datum isteka"
        name={["search", "dateOfExpiry"]}
        rules={[{
          required: false,

        }]}


      >
        <DatePicker />

      </Form.Item>

      <Form.Item
        labelCol={{ span: 24 }}
        style={{ width: 100, margin: 'auto' }}

      >
        <Button type="primary" htmlType="submit">
          Search
          </Button>
      </Form.Item>

    </Form>

  )
}


const mapStateToProps = (state) => {
  return {
    data: state.data,
    token: state.user.token
  }
}


export default connect(mapStateToProps)(SearchForm);