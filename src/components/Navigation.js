import React from 'react';
import {Menu} from 'antd';
import { FormOutlined, LoginOutlined, LogoutOutlined, SettingOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined, BankOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { connect, useSelector } from 'react-redux'
import { clearCart, logoutUser } from "../redux/actions";
import {withRouter} from 'react-router-dom'
import {BACKEND_URL} from "../constants";
const handleClick = e => {
  console.log('click ', e);
  //this.setState({ current: e.key });
};

const {SubMenu} = Menu

function Navigation(props) {
  const user = useSelector(state => state.user);
  const [idPharmacy, setidPharmacy] = React.useState();

  let getId = async () => {
    console.log(user.token)

    fetch(`${BACKEND_URL}/employee/pharmacyId`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.message)
        } else {
          console.log(data.pharmacyId);
          setidPharmacy(data.pharmacyId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!user.logged) {
    return (

      <Menu className="site_navigation_menu" onClick={handleClick} mode="horizontal">
        <Menu.Item key="shop" icon={<ShopOutlined />}>
          <Link to="/shop" />
            Ponuda lijekova
          </Menu.Item>
        <Menu.Item key="login" icon={<LoginOutlined />}>
          <Link to="/login" />
              Prijavi se
          </Menu.Item>
        <Menu.Item key="signup" icon={<FormOutlined />}>
          <Link to="/signup/user" />
              Registriraj se
          </Menu.Item>
      </Menu>

    );
  } else {
    if(user.userType === "admin_ljekarne") getId();
    return (
      <Menu className="site_navigation_menu" onClick={handleClick} mode="horizontal" selectedKeys={props.location.pathname.split('/')}>
        <Menu.Item key="shop" icon={<ShopOutlined />}>
          <Link to="/shop" />
            Ponuda lijekova
        </Menu.Item>

        <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
          <Link to="/cart" />
            Košarica ({props.cart.nrOfItems})
        </Menu.Item>

        <Menu.Item key="profile" icon={<SettingOutlined />}>
          <Link to="/profile" >
            Moj profil
          </Link>
        </Menu.Item>

        {/*<SubMenu*/}
        {/*  key="profil"*/}
        {/*  icon={<SettingOutlined />}*/}
        {/*  title="Moj profil"*/}
        {/*>*/}
        {/*  <Menu.Item key="setting:1">*/}
        {/*    <Link to="/profile" >*/}
        {/*      Detalji profila*/}
        {/*    </Link>*/}
        {/*  </Menu.Item>*/}
        {/*  <Menu.Item key="setting:2">Moje rezervacije</Menu.Item>*/}
        {/*</SubMenu>*/}

        {user.isAdmin &&
          <SubMenu key="admin" icon={<UserOutlined />} title="Admin">
            <Menu.Item key="meds">
              <Link to='/admin/meds'/>
              Lijek
            </Menu.Item>
            <Menu.Item key="create-pharmacy">
              <Link to='/admin/create-pharmacy'/>
              Ljekarna
            </Menu.Item>
            <Menu.Item key="add">
              <Link to='/admin/meds/add/'/>
              Dodavanje lijeka
            </Menu.Item>
            
            <Menu.Item key="active_substance">
              <Link to='/admin/active_substance'/>
              Aktivna tvar
            </Menu.Item>
            <Menu.Item key="city">
              <Link to='/admin/city'/>
              Mjesto
            </Menu.Item>
            <Menu.Item key="atk">
              <Link to='/admin/atk'/>
              ATK šifra
            </Menu.Item>
            <Menu.Item key="manufacturer">
              <Link to='/admin/manufacturer'/>
              Proizvođač
            </Menu.Item>
            <Menu.Item key="pharmaform">
              <Link to='/admin/pharmaform'/>
              Farmaceutski oblik
            </Menu.Item>
          </SubMenu>
        }
        {user.userType === "admin_ljekarne" &&
        <SubMenu key="admin" icon={<BankOutlined />} title="Moja ljekarna">
          <Menu.Item key="pharmacy">
            <Link to={`/pharmacy/edit/${idPharmacy}`}/>
            Ljekarna
          </Menu.Item>
          <Menu.Item key="add">
            <Link to='/admin/meds/add/'/>
            Lijek
          </Menu.Item>
          <Menu.Item key="create-offer">
            <Link to='/admin/create-offer'/>
            Ponuda
          </Menu.Item>
          <Menu.Item key="employees">
            <Link to='/employees/all'/>
            Pregled svih zaposlenika
          </Menu.Item>
          <Menu.Item key="create-employee">
            <Link to='/create-employee'/>
            Dodavanje novog korisnika kao zaposlenika ljekarne
          </Menu.Item>
          <Menu.Item key="create-employee-existing">
            <Link to='/create-employee-existing'/>
            Dodavanje postojećeg korisnika kao zaposlenika ljekarne
          </Menu.Item>
        </SubMenu>
        }
        {user.userType === "zaposlenik" &&
        <SubMenu key="admin" icon={<BankOutlined />} title="Moja ljekarna">
          <Menu.Item key="add">
            <Link to='/admin/meds/add/'/>
            Lijek
          </Menu.Item>
          <Menu.Item key="create-offer">
            <Link to='/admin/create-offer'/>
            Ponuda
          </Menu.Item>
        </SubMenu>
        }

        <Menu.Item key="logout" icon={<LogoutOutlined />} style={{float: 'right'}} >
          <Link onClick={() => {props.dispatch(); props.clearUsersCart()}} to="/" >
            Odjavi se
          </Link>
        </Menu.Item>

      </Menu>
    )

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: () => dispatch(logoutUser()),
    clearUsersCart: () => dispatch(clearCart())
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navigation));
