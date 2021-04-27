import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { BACKEND_URL } from "../../constants";
import CartHistoryList from './CartHistory'

import './Cart.css'
import '../search/Search.css'
import { clearCart } from '../../redux/actions';

let CartHistoryComponent = (props) => {
  const [gotResponse, setGotResponse] = React.useState();
  const [activeCartData, setActiveCartData] = React.useState();
  useEffect(() => {
    setGotResponse(false)
    getActiveItems()
  }, [])

  let getActiveItems = () => {

    fetch(`${BACKEND_URL}/cart/history`, {
      headers: {
        Authorization: `Bearer ${props.token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.message)
        } else {


          setActiveCartData(data.orders);
          setGotResponse(true)

        }
      })
      .catch((err) => {
        console.log(err);
      });

  }
  let activeItems = <></>
  if (gotResponse) {
    console.log(activeCartData)
    activeItems = <CartHistoryList items={activeCartData} />;
  }



  return (
    <>
      <h2>Povijest Vasih transakcija</h2>
      {activeItems}

      
      <br />

    </>
  )


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




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CartHistoryComponent));
