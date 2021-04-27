import './Search.css';
import React, { useEffect } from 'react'
import { BACKEND_URL } from "../../constants";


import { Spin} from 'antd';

import SearchForm from './SearchForm'
import { connect } from 'react-redux';
import OffersComponent from '../offers/OffersComponent';

const SearchComponent = (props) => {

  const [medsResponseData, setMedsResponseData] = React.useState();
  const [gotResponse, setGotResponse] = React.useState();

  useEffect(() => {
    onFinish({})
  }, [])

  let medsList = [];
  if (gotResponse) {
    console.log("meds gotten ========")
    console.log(medsResponseData)
    medsList =
      <>
        <OffersComponent modelData={medsResponseData} />
      </>
  }

  const onFinish = (values) => {
    const formData = values.search !== undefined ? values.search : {};

    formData.lowestPrice = formData.price_range ? formData.price_range[0] : undefined;
    formData.highestPrice = formData.price_range ? formData.price_range[1] : undefined;
    formData.dateOfExpiry = formData.dateOfExpiry ? formData.dateOfExpiry.unix() : undefined;

    const {
      name,
      lowestPrice,
      highestPrice,
      atkId,
      substanceId,
      formId,
      manufacturerId,
      cityId,
      dateOfExpiry
    } = formData

    fetch(BACKEND_URL + '/meds/search/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token ? props.token : null}`,
        Accept: "application/json",
      },
      body: JSON.stringify(
        {
          name,
          lowestPrice,
          highestPrice,
          atkId,
          substanceId,
          formId,
          manufacturerId,
          cityId,
          dateOfExpiry
        }

      ),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {

          alert(data.message)
        } else {

          setMedsResponseData(data.meds)

          setGotResponse(true)


        }
      })
      .catch((err) => {
        console.log(err);
      });


  }


  return (
    <>
      <div className="search_container">
        <div className="search_wrapper">
          <h2>🔍 Pretraga ponuda</h2>
          <br/>
          <SearchForm onFinish={onFinish} />
        </div>

        <div className="offers_container">
          <h2 className="offers_title">💊 Aktivne ponude lijekova</h2>
          {gotResponse ? medsList : (
            <>
              <br/>
              <br/>
              <Spin size="large" />
            </>
          )}
        </div>

      </div>


    </>
  )
}


const mapStateToProps = (state) => {
  return {
    data: state.data,
    token: state.user.token
  }
}
export default connect(mapStateToProps)(SearchComponent);