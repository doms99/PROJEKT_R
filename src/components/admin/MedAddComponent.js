import React from "react";
import { BACKEND_URL } from "../../constants";
import { withRouter } from 'react-router-dom';
import MedForm from "./MedForm";
import {connect} from "react-redux";

class MedAddComponent extends React.Component {
  state = {
    loaded: false
  }
  dropdownData = {}

  componentDidMount() {
    console.log("props", this.props)
    fetch(`${BACKEND_URL}/meds/create`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data)
        if (data.error) {
          alert(data.message)
        } else {
          this.dropdownData = {
            activeSubstance: data.actsubstance.sort((a,b) => a.substancename > b.substancename ? 1 : -1),
            atk: data.atk.sort((a,b) => a.atkname > b.atkname ? 1 : -1),
            manufacturer: data.manufacturer.sort((a,b) => a.manufacturername > b.manufacturername ? 1 : -1),
            form: data.form.sort((a,b) => a.formid > b.formname ? 1 : -1),
          }
          this.setState({
            loaded: true
          })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // onSearchChange(value) {
  //   console.log(`selected ${value}`);
  // }
  //
  // onSearch(val) {
  //   console.log('search:', val);
  // }
  //
  // deleteHandle = (e) => {
  //   const result = window.confirm("Da li želite izbrisati taj zapis?")
  //   if(result) {
  //     fetch(BACKEND_URL+this.state.path, {
  //       method: "DELETE",
  //       headers: {
  //         Accept: "application/json",
  //       }
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         alert(data.message)
  //         if (!data.error) {
  //           this.props.history.push('/admin/meds');
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }

  render() {
    if (!this.state.loaded) {
      return (
        <>
          Fetching...
        </>
      )
    } else {
      return (
        <MedForm path={'/meds/create'} {...this.dropdownData} onFinish={this.onFinish} />
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

export default connect(mapStateToProps)(withRouter(MedAddComponent));