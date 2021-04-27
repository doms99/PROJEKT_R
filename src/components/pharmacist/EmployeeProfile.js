import { Button } from 'antd';
import React, { useEffect } from 'react'
import {List} from 'antd';

import { BACKEND_URL } from "../../constants";
import { connect, useSelector } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import CartHistoryList from '../cart/CartHistory';
import './Profile.css'

import { useHistory } from "react-router-dom";

function AdminEmployeePanel(props) {
  let history = useHistory();

    const isAdmin = useSelector(state => state.user.userType == "admin_ljekarne")
    const isEmployee =  useSelector(state => state.user.userType == "zaposlenik")
    if(!isEmployee) history.push('/home');
    
    const data = [
      {
        path: '/admin/meds',
        title: 'Uređivanje lijekova'
      },
      {
        //path: `/pharmacy/edit/${this.pharmacyId}`,
        title: 'Uređivanje ljekarne'
      },
      {
        path: '/employee/worker',
        title: 'Dodavanje zaposlenika ljekarne'
      },
      {
        path: '/admin/meds/add/',
        title: 'Dodavanje lijekova'
      },
      {
        path: '/admin/create-offer',
        title: 'Dodavanje ponuda'
      },
    ]
    return (
      <div style={{width: '100%'}}>
        <h1></h1>
        <List
          style={{minWidth: '200px', width: '30%', margin: '0 auto'}}
          bordered
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <div style={{width: '100%', height: '100%'}}><Link to={item.path}>{item.title}</Link></div>
            </List.Item>
          )}
        />
      </div>
    );
  }

function UserProfileComponent(props) {
    let history = useHistory();

    if (useSelector(state => state.user) == {}) {
        history.push('/login');
    }

    const [gotResponse, setGotResponse] = React.useState();
    const [activeCartData, setActiveCartData] = React.useState();
    useEffect(() => {
        setGotResponse(false)
        //getActiveItems()
    }, [])


    let getPharmacyInfo = () => {

        fetch(`${BACKEND_URL}/employee/admin`, {
            headers: {
                Authorization: `Bearer ${props.token}`,
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.message)
                } else {
                    console.log(data.reservations);

                    setActiveCartData(data.reservations);
                    setGotResponse(true)

                }
            })
            .catch((err) => {
                console.log(err);
            });

    }
    let activeItems = <></>
    if(gotResponse){
        console.log(activeCartData)
        activeItems = <CartHistoryList items={activeCartData}  />;
    }

    return (
        console.log(props),
        <div>
            <br></br>
            <img className="avatar_image_circle" src="https://m.media-amazon.com/images/M/MV5BMjQyNzM2MjM1Ml5BMl5BanBnXkFtZTcwMDE5NjI3Mg@@._V1_UY317_CR7,0,214,317_AL_.jpg" />
            <h2>{props.firstName + ' ' + props.lastName}</h2>
            <h3>{props.userType}</h3>
            <h3>{props.pharmacy}</h3>
            {console.log(props)}
            {AdminEmployeePanel()}


            <h3>
                <strong>Aktivne rezervacije (za preuzimanje)</strong>
            </h3>
            <hr />

            
            {activeItems}

            <br></br>
            <br />

            <Button type="primary" onClick={() => history.push("/cart-history")}>
                ⏪ Pogledaj prosle transakcije
            </Button>

            <br></br>
            <br />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        userType: state.user.userType,

        token: state.user.token
    }
}




export default withRouter(connect(mapStateToProps)(UserProfileComponent));