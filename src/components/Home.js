import { Button } from 'antd';
import React from 'react';
import { connect, useSelector } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import OffersComponent from './offers/OffersComponent';

function Home(props) {
  if (useSelector(state => state.user) === {}) {
    props.history.push('/login');
  }

  return (
    <div>
      <br/>
      <h1>E-lijekovi</h1>
      <h3>Najbolje iz ponude.</h3>
      <div className="home_featured_offers_container">
        <OffersComponent modelData={[
          {
            active: true,
            addedtimestamp: "2020-12-13T14-10-54.148Z",
            amount: 6,
            atkid: 1,
            cityid: 1,
            dateofexpiry: "2020-12-18T23-00-00.000Z",
            discount: "5.00",
            farmacyid: 1,
            farmacyname: "Zagreb",
            formername: null,
            formid: 23,
            manufacturerid: 1,
            measuringunit: "komad",
            medid: 1,
            medname: "lupocet",
            offerid: 1,
            oib: "12345678909",
            packing: "kockasta kocka",
            phonenumber: "0912345678",
            pictureurl: null,
            price: "43.20",
            streetandnumber: "zagreb 1",
            substanceid: 913,
          },
          {
            active: true,
            addedtimestamp: "2020-12-13T14-10-54.148Z",
            amount: 20,
            atkid: 8,
            cityid: 1,
            dateofexpiry: "2020-12-18T23-00-00.000Z",
            discount: "14.00",
            farmacyid: 1,
            farmacyname: "Zagreb",
            formername: null,
            formid: 1,
            manufacturerid: 1,
            measuringunit: "komad",
            medid: 2,
            medname: "lekadol",
            offerid: 2,
            oib: "12345678909",
            packing: "kutija",
            phonenumber: "0912345678",
            pictureurl: "https://www.centarzdravlja.hr/site/assets/files/23359/lekadol_500.480x256.jpg",
            price: "55.00",
            streetandnumber: "zagreb 1",
            substanceid: 735,
          }
        ]} />
      </div>
      <Link to="/shop/" >
        <Button type="primary">
          Pretrazi sve ponude
        </Button>
      </Link>
      <br/>
      <br/>
      <br/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    userType: state.user.userType
  }
}


export default withRouter(connect(mapStateToProps)(Home));