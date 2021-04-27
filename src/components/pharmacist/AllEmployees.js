import React from 'react';
import { Link } from "react-router-dom"
import { Table, Button, Popconfirm, Pagination } from 'antd';
import {BACKEND_URL} from "../../constants";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {connect} from "react-redux";
import '../Tables.css'

class AllEmployees extends React.Component {

  state = {
    isModalVisible: false,
    modelData: [],
    min: 0,
    max: 5,
    offset: 5,
    total: 0,
  };

  handleChange = value => {
      this.setState({
      min: (value-1)*this.state.offset,
      max: value*this.state.offset,
    });    
  };

  componentDidMount() {
    console.log(this.props)
    fetch(`${BACKEND_URL}/employee/employees`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.message)
        } else {
          console.log(data);


          this.setState({
            modelData: data.employees,
            isModalVisible: true,
            total: data.employees.length,
          });
          console.log(this.state);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFormData = () => {
    return this.state.modelData;
  }

  deleteHandler = (row, e) => {
    console.log("state", this.state)
    console.log("delete")
    console.log("data: ", row)
    console.log("token", this.props.token)
    /**
    fetch(`${BACKEND_URL}`, {
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
      */
  }

  render() {
    const columns = [

      {
        title: 'Ime',
        dataIndex: 'firstname',
        key: 'firstname',
        sorter: (a, b) => a.name.localeCompare(b.name.length),
      },
      {
        title: 'Prezime',
        dataIndex: 'lastname',
        key: 'lastname',
        sorter: (a, b) => a.name.localeCompare(b.name.length),

      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        key: 'email',

      },
      {
        title: 'OIB',
        dataIndex: 'oib',
        key: 'oib',

      },
     
    ]

    return (
      <>
        <br/> 
        <div style={{float: 'right', padding: '16px'}} >
        <Button>
          <Link to={"/create-employee"} >Dodaj novog zaposlenika</Link>
        </Button>       
        </div>
        <div className='medium'>
          <Table columns={columns}
                 dataSource={this.state.modelData && this.state.modelData.length > 0 && this.state.modelData.slice(this.state.min, this.state.max)}
                 pagination={false}/>

          <Pagination defaultCurrent={1}
                      defaultPageSize={this.state.offset}
                      onChange={this.handleChange}
                      total={this.state.total}/>
        </div>
        </>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

export default connect(mapStateToProps)(AllEmployees);