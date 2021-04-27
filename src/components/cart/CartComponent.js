import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'antd';
import { BACKEND_URL } from "../../constants";
import CartListComponent from './CartListComponent'

import './Cart.css'
import '../search/Search.css'

class CartComponent extends React.Component {
  getFormData = () => {
    return this.props.modelData;
  }

  render() {
    const onFinish = () => {

      let cartContent = []
      this.props.cart.items.forEach(item => {
        let offer_id = item.offerid
        let {amount } = item
        cartContent.push({ offer_id, amount })
      })

      console.log(JSON.stringify(
        {
          offers: cartContent
        }

      ))

      
    fetch(BACKEND_URL + '/cart/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(
        {
          offers: cartContent
        }

      ),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {

          alert(data.message)
        } else {

          alert(data)


        }
      })
      .catch((err) => {
        console.log(err);
      });

      
    }


    return (
      <>

        <CartListComponent cart={this.props.cart} />

        <Button onClick={() => {
          onFinish()
          
          this.props.history.push("/buy");
        }} type="primary">
          Stvori rezervaciju

              </Button>
        <br />
        <br />

      </>
    )


  }

}




const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    token: state.user.token
  }
}




export default withRouter(connect(mapStateToProps)(CartComponent));
