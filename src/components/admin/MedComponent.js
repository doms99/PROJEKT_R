import React from "react";
import { Form, Input, InputNumber, Button, Select } from "antd";
import { BACKEND_URL } from "../../constants";
import { withRouter } from 'react-router-dom';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};



class MedComponent extends React.Component {
  state = {
    activeSubstance: [],
    atk: [],
    manufacturer: [],
    form: [],
    loaded: false
  }

  formRef = React.createRef();

  componentDidMount() {
    let path;
    if(this.props.edit) {
      path = `/meds/edit/${this.props.match.params.id}`;
    } else {
      path = `/meds/create`;
    }
    this.setState({
      path
    })
    console.log(this.props)
    fetch(BACKEND_URL+path)
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data)
        if (data.error) {
          alert(data.message)
        } else {
          await this.setState({
            activeSubstance: data.actsubstance.sort((a,b) => a.substancename > b.substancename ? 1 : -1),
            atk: data.atk.sort((a,b) => a.atkname > b.atkname ? 1 : -1),
            manufacturer: data.manufacturer.sort((a,b) => a.manufacturername > b.manufacturername ? 1 : -1),
            form: data.form.sort((a,b) => a.formid > b.formname ? 1 : -1),
            loaded: true
          });
          console.log(this.formRef);
          this.formRef.current.setFieldsValue({
            name: data.medicine.name,
            formerName: data.medicine.formername == null ? undefined : data.medicine.formername,
            atkId: data.medicine.atkid,
            formId: data.medicine.formid,
            manufacturerId: data.medicine.manufacturerid,
            measuringUnit: data.medicine.measuringunit,
            packing: data.medicine.packing,
            substanceId: data.medicine.substanceid,
            amount: data.medicine.amount,
            pictureUrl: data.medicine.pictureurl == null ? undefined : data.medicine.pictureurl
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onFinish = (values) => {
    const formData = {};
    for(let data in values) {
      if(values[data] !== '') formData[data] = values[data]
    }

    fetch(BACKEND_URL+this.state.path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data);
          alert(data.message)
        } else {
          this.props.history.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSearchChange(value) {
    console.log(`selected ${value}`);
  }
  
  
  
  onSearch(val) {
    console.log('search:', val);
  }

  deleteHandle = () => {
    const result = window.confirm("Da li želite izbrisati taj zapis?")
    if(result) {
      fetch(BACKEND_URL+this.state.path, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        }
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message)
          if (!data.error) {
            this.props.history.goBack();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }



  render() {

    const { activeSubstance, atk, manufacturer, form, loaded } = this.state;
    if (!loaded) {
      return (
        <>
          Fetching...
        </>
      )
    }
    else {
      const activeSubstanceList = activeSubstance.map(ingredient => {
        return (
          <Option value={ingredient.substanceid} style={{textAlign:"left"}}>{ingredient.substancename}</Option>
        )
      });
      const atkList = atk.map(currAtk => {
        return (
          <Option value={currAtk.atkid} style={{textAlign:"left"}}>{currAtk.atkname + ' - ' + currAtk.atkdescription} </Option>
        )
      });
      const manufacturerList = manufacturer.map(currMan => {
        return (
          <Option value={currMan.manufacturerid} style={{textAlign:"left"}}>{currMan.manufacturername}</Option>
        )
      });
      const formList = form.map(currForm => {
        return (
          <Option value={currForm.formid} style={{textAlign:"left"}}>{currForm.formname}</Option>
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

      return (
        <div>
          <br/>
          <br/>
          <Form
            {...layout}
            ref={this.formRef}
            name="nest-messages"
            onFinish={this.onFinish}
            validateMessages={validateMessages}
          >
            <Form.Item
              name="name"
              label="Naziv"
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
                onChange={this.onSearchChange}
                onSearch={this.onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {[<Option value={'mg'}>mg</Option>, <Option value={'komad'}>komad</Option>]}
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
                onChange={this.onSearchChange}
                onSearch={this.onSearch}
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
                onChange={this.onSearchChange}
                onSearch={this.onSearch}
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
                onChange={this.onSearchChange}
                onSearch={this.onSearch}
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
                onChange={this.onSearchChange}
                onSearch={this.onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {manufacturerList}
              </Select>
            </Form.Item>



            {this.props.edit ? (
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button type="deafult" onClick={this.deleteHandle}>
                  Delete
                </Button>
              </Form.Item>)
              :
              (
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              )}
          </Form>
        </div>
      );
    }
  }
}

export default withRouter(MedComponent);