import React from 'react';
import {connect, useSelector} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Layout } from 'antd';

const { Footer } = Layout;


function Home(props) {
  if(useSelector(state => state.user) === {}) {
    props.history.push('/login');
  }

  return (
    <Footer>
      Projekt R 2020/2021 🦠
    </Footer>
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