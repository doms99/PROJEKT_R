import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";

import { Button } from 'antd';

import SignupComponent from '../components/Signup';
import LoginComponent from '../components/Login';
import Navigation from '../components/Navigation';
import HomeComponent from '../components/Home'
import MedsComponent from '../components/admin/Meds'
import CreatePharmacyComponent from '../components/admin/CreatePharmacy'
import MedAddComponent from '../components/admin/MedAddComponent'
import MedEditComponent from '../components/admin/MedEditComponent'
import SearchComponent from '../components/search/Search'
import ActiveSubstanceTable from "../components/admin/tables/ActiveSubstanceTable";
import CityTable from "../components/admin/tables/CityTable";
import AtkTable from "../components/admin/tables/AtkTable";
import ManufacturerTable from "../components/admin/tables/ManufacturerTable";
import PharmaformTable from "../components/admin/tables/PharmaformTable";
import Footer from '../components/Footer'
import UserProfileComponent from '../components/user/UserProfileComponent'

import CartComponent from '../components/cart/CartComponent';
import BuyComponent from '../components/cart/BuyComponent';
import CartHistoryComponent from '../components/cart/CartHistoryComponent';

import CreateOffers from '../components/offers/CreateOffers'
import CreateEmployeeComponent from '../components/pharmacist/AddEmployee';
import AllEmployees from '../components/pharmacist/AllEmployees';
import UserProfileEdit from "../components/user/UserProfileEdit";
import AddExistingEmployee from '../components/pharmacist/AddExistingEmployee';
import PharmacyEdit from '../components/pharmacist/PharmacyEdit';

class EMedRouter extends React.Component {
  render() {
    return (
      <Router>
        <Navigation />
        <Switch>
          <Route path="/signup/user" component={SignupComponent} />
          <Route path="/login" component={LoginComponent} />
          <Redirect exact from='/' to="shop" />
          <Route exact path="/admin/meds" component={MedsComponent} />
          <Route exact path="/admin/create-pharmacy/" component={CreatePharmacyComponent} />
          <Route path="/admin/meds/add/" component={MedAddComponent} />
          <Route path="/admin/meds/edit/:id" component={MedEditComponent} />
          <Route path="/search" component={SearchComponent} />
          <Route path="/admin/active_substance" component={ActiveSubstanceTable} />
          <Route path="/admin/city" component={CityTable} />
          <Route path="/admin/atk" component={AtkTable} />
          <Route path="/admin/manufacturer" component={ManufacturerTable} />
          <Route path="/admin/pharmaform" component={PharmaformTable} />
          <Route path="/admin/create-offer" component={CreateOffers} />
          <Route path="/shop" component={SearchComponent} />
          <Route exact path="/profile" component={UserProfileComponent} />
          <Route path="/profile/edit" component={UserProfileEdit} />
          <Route path="/cart" component={CartComponent} />
          <Route path="/buy" component={BuyComponent} />
          <Route path="/cart-history" component={CartHistoryComponent} />
          <Route path="/create-employee" component={CreateEmployeeComponent} />
          <Route path="/employees/all" component={AllEmployees} />
          <Route path="/create-employee-existing" component={AddExistingEmployee} />
          <Route path="/pharmacy/edit/:id" component={PharmacyEdit} />

          <Route path="*">
            <div className="full_height_section">
              <br />
              <h1 className="h1_404">404</h1>
              <h3>💊 You might be high</h3>
              <br />
              <Button>
                <Link to="/">🏠 Home</Link>
              </Button>
              <br />
              <br />
            or
            <br />
              <br />

              <Button>
                <Link to="/signup/user">👤 Sign up</Link>
              </Button>
              <Button>
                <Link to="/login">👤 Log in</Link>
              </Button>
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

            </div>

          </Route>
        </Switch>
        <Footer />

      </Router>
    )
  }
}

export default EMedRouter;