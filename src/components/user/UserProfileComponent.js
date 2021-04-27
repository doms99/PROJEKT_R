import { Button, Collapse, Avatar, Divider, List } from 'antd';
import { UserOutlined, EditOutlined, FilePdfOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react'
import { BACKEND_URL } from "../../constants";
import { connect, useSelector } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import './Profile.css'
import {useHistory} from "react-router-dom";
import CartListComponent from "../cart/CartListComponent";

const {Panel} = Collapse;

function UserProfileComponent(props) {
  let history = useHistory();

  if(useSelector(state => state.user) === {}) {
    history.push('/login');
  }
  
  const isUser = useSelector(state => state.user.userType == "korisnik")
  const [gotResponse, setGotResponse] = React.useState();
  const [activeCartData, setActiveCartData] = React.useState();
  useEffect(() => {
    setGotResponse(false)
    getActiveItems()
  }, [])

  let getActiveItems = () => {

    fetch(`${BACKEND_URL}/cart/active`, {
      headers: {
        Authorization: `Bearer ${props.token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.error) {
          alert(data.message)
        } else {
          console.log("SVE STO STE POSLALO:");
          console.log(data);

          setActiveCartData(data.reservations);


          setGotResponse(true)

        }
      })
      .catch((err) => {
        console.log(err);
      });

  }
  let activeItems = <></>
  if(gotResponse) {
    console.log(activeCartData)
    activeItems = activeCartData.map(item => {
      const nameArray = [];

      const data = {
        ...item,
        items: item.items.map(it => {
          nameArray.push(it.pharmacyname)
          return  {
            ...it,
            farmacyname: it.pharmacyname,
            streetandnumber: it.adress,
            phonenumber: it.phone
          }
        })
      }

      let name;
      if(nameArray.length === 1) {
        name = nameArray[0];
      } else {
        name = nameArray[0] + ', ' + nameArray[1]
        if(nameArray.length > 2) {
          name += ', ...'
        }
      }

      let links = item.codes.map(code => {
        let link = BACKEND_URL + '/cart/racuni/' + code.code;
        return <div>
          <a href={link} >Ljekarna {code.pharmacyname} <FilePdfOutlined /></a>
          </div>
      })

      return (
        <Panel key={item.orderId} header={<strong>{name}</strong>}>
          <CartListComponent cart={data} disableDelete={true}/>
          <div>
            <strong>Preuzmite račune:</strong><br />
            {links}
          </div>
        </Panel>
      )
    })
  }
 
  return (
    <div>
      <br/>
      <Avatar size={128} icon={<UserOutlined />} />
      <h2>{props.firstName + ' ' + props.lastName} <EditOutlined onClick={() => history.push('/profile/edit')}/></h2>
      <h4>{props.email}</h4>
      <h3>{props.userType}</h3>


        <div>
      <Divider/>
      <h3>
        <strong>Aktivne rezervacije (za preuzimanje)</strong>
      </h3>

      <Collapse style={{width: '80%', margin: '0 auto'}}>
        {activeItems}
      </Collapse>

      <br/>
      <br/>

      <Button type="primary" onClick={() => history.push("/cart-history")}>
        ⏪ Pogledaj prošle transakcije
      </Button>
      </div>

      

      <br></br>
      <br/>
    </div>
  );
}

const mapStateToProps = (state) => { 
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    userType: state.user.userType,
    email: state.user.email,
    token: state.user.token,
  }
}


export default withRouter(connect(mapStateToProps)(UserProfileComponent));
