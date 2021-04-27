import React  from 'react'

import { connect } from 'react-redux';
import CartListComponent from './CartListComponent'






const CartHistoryList = (props) => {

    console.log("items")
    console.log(props.items)

    

    let transactins = props.items.map(item => {
        
        return (
            <>
                <h3>Transakcija {item.orderId}</h3>
                <CartListComponent cart={item} disableDelete={true} />
            </>
        )
    })

    return (
        <>
            {transactins}

        </>
    )
}


const mapStateToProps = (state) => {
    return {
        data: state.data,
        token: state.user.token
    }
}
export default connect(mapStateToProps)(CartHistoryList);