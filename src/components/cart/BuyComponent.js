import React from 'react';
import { withRouter } from 'react-router-dom'
import { Button } from 'antd';
import { BACKEND_URL } from "../../constants";
import CartListComponent from './CartListComponent'

import './Cart.css'
import '../search/Search.css'
import { clearCart } from '../../redux/actions';
import {connect} from "react-redux";

class BuyComponent extends React.Component {
  render() {
    const onFinish = () => {
    fetch(BACKEND_URL + '/cart/buy', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.props.token}`,
          Accept: "application/json",
        },
       
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {

            alert(data.message)
          } else {

            alert(data)
            this.props.clearUserCart();


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
          
        }} type="primary">
          Dovrši rezervaciju

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

const mapDispatchToProps = (dispatch) => {
    return {
      clearUserCart: () => dispatch(clearCart())
    }
  }




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyComponent));
