import React from "react";
import { BACKEND_URL } from "../../constants";
import { withRouter } from 'react-router-dom';
import MedForm from "./MedForm";
import {connect} from "react-redux";

class MedEditComponent extends React.Component {
  state = {
    loaded: false
  }

  initialValues = {}
  dropdownData = {}

  componentDidMount() {
    console.log("props", this.props)
    fetch(`${BACKEND_URL}/meds/edit/${this.props.match.params.id}`, {
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

          this.initialValues = {
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

  onFinish = (values) => {
    console.log("onFinish")
    const formData = {};
    for(let data of values) {
      if(values[data] !== '') formData[data] = values[data]
    }

    fetch(`${BACKEND_URL}/meds/edit/${this.props.match.params.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("data", data);
          alert(data.message)
        } else {
          this.props.history.push('admin/meds');
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
        <MedForm path={`/meds/edit/${this.props.match.params.id}`} initialValues={this.initialValues} {...this.dropdownData} onFinish={this.onFinish} />
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

export default connect(mapStateToProps)(withRouter(MedEditComponent));