import React from 'react';
import { Link } from "react-router-dom"
import { Table, Button, Popconfirm, Pagination } from 'antd';
import {BACKEND_URL} from "../../constants";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {connect} from "react-redux";

class Meds extends React.Component {

  state = {
    isModalVisible: false,
    modelData: [],
    atks: [],
    activeingredients: [],
    pharmaforms: [],
    manufacturers: [],
    min: 0,
    max: 3,
    offset: 3,
    total: 0,
  };

  handleChange = value => {
      this.setState({
      min: (value-1)*this.state.offset,
      max: value*this.state.offset,
    });    
  };


  componentDidMount() {
    fetch(`${BACKEND_URL}/meds/all`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('res', data)
        if (data.error) {
          alert(data.message)
        } else {
          const activeingredients = {}
          for(let ingredient of data.actsubstance) {
            activeingredients[ingredient.substanceid] = ingredient.substancename
          }
          const atks = {}
          for(let atk of data.atk) {
            atks[atk.atkid] = atk.atkname
          }
          const forms = {}
          for(let form of data.form) {
            forms[form.formid] = form.formname
          }
          const manufacturers = {}
          for(let manufacturer of data.manufacturer) {
            manufacturers[manufacturer.manufacturerid] = manufacturer.manufacturername
          }
          this.setState({
            modelData: data.meds.map(item => {
              return {
                ...item,
                atk: atks[item.atkid],
                activeingredient: activeingredients[item.substanceid],
                pharmaform: forms[item.pharmaformid],
                manufacturer: manufacturers[item.manufacturerid]
              }
            }),
            isModalVisible: true,
            total: data.meds.length,
            activeingredients: data.actsubstance,
            atks: data.atk,
            pharmaforms: data.form,
            manufacturers: data.manufacturer
          }, () => console.log(this.state));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFormData = () => {
    return this.state.modelData;
  }

  hideModal = () => {
    this.setState({
      isModalVisible: false,
      stuff: "aaaa"
    });
  };

  deleteHandler = (row) => {
    console.log("state", this.state)
    console.log("delete")
    console.log("data: ", row)
    console.log("token", this.props.token)
    fetch(`${BACKEND_URL}/meds/edit/${row.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        Accept: "application/json"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.message);
        } else {
          this.setState({
            modelData: this.state.modelData.filter(e => e.id !== row.id),
          })
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }

  render() {
    const columns = [

      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id,

      },
      {
        title: 'Naziv',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name.length),

      },
      {
        title: 'Stariji naziv',
        dataIndex: 'formername',
        key: 'formername',
      },
      {
        title: 'Pakiranje',
        dataIndex: 'packing',
        key: 'packing',

      },
      {
        title: 'Poveznica na sliku',
        dataIndex: 'pictureurl',
        key: 'pictureurl',

      },
      {
        title: 'Količina',
        dataIndex: 'amount',
        key: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: 'Mjerna jedinica',
        dataIndex: 'measuringunit',
        key: 'measuringunit',
        filters: [
          {
            text: 'mg',
            value: 'mg',
          },
          {
            text: 'komad',
            value: 'komad',
          },
        ],
        onFilter: (value, record) => record.measuringunit.indexOf(value) === 0,

      },
      {
        title: 'ATK',
        dataIndex: 'atk',
        key: 'atk',
        filters: this.state.atks.map(item => {
          return {
            text: item.atkname,
            value: item.atkname
          }
        }),
        onFilter: (value, record) => record.atk === value,
      },
      {
        title: 'Aktivna substanca',
        dataIndex: 'activeingredient',
        key: 'activeingredient',
        filters: this.state.activeingredients.map(item => {
          return {
            text: item.substancename,
            value: item.substancename
          }
        }),
        onFilter: (value, record) => record.activeingredient === value,
        sorter: (a, b) => a.activeingredient.localeCompare(b.activeingredient.length),


      },
      {
        title: 'Farmaceutski oblik',
        dataIndex: 'pharmaform',
        key: 'pharmaform',
        filters: this.state.pharmaforms.map(item => {
          return {
            text: item.formname,
            value: item.formname
          }
        }),
        onFilter: (value, record) => record.pharmaform === value,
      },
      {
        title: 'Proizvođač',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        filters: this.state.manufacturers.map(item => {
          return {
            text: item.manufacturername,
            value: item.manufacturername
          }
        }),
        onFilter: (value, record) => record.manufacturer === value,
      },
      {
        title: 'Akcija',
        key: 'operation',
        width: 100,
        render: (data) =>
          <div style={{display: 'flex'}}>
            <Button >
              <Link to={"/admin/meds/edit/" + data.id}><EditOutlined/></Link>
            </Button>
            <Popconfirm
              placement="topRight"
              title={'Jeste li sigurni da želite obrisati ovaj zapis?'}
              onConfirm={(e) => this.deleteHandler(data, e)}
              okText="Da"
              cancelText="Ne"
            >
              <Button type={"primary"} danger>
                <DeleteOutlined/>
              </Button>
            </Popconfirm>
          </div>

      }
    ]



    return (
      <>
        <br/> 
        <div style={{float: 'right', padding: '16px'}} >
        <Button>
          <Link to={"/admin/meds/add"} >Dodaj</Link>
        </Button>       
        </div>
        <Table columns={columns} 
              dataSource={this.state.modelData && this.state.modelData.length > 0 && this.state.modelData.slice(this.state.min, this.state.max)}
              pagination={false}/>
     
            <Pagination defaultCurrent={1}
                        defaultPageSize={this.state.offset}
                        onChange={this.handleChange}
                        total={this.state.total}/>        
       
      </>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

export default connect(mapStateToProps)(Meds);