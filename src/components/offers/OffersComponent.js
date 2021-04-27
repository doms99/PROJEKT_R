import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, List, Card } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { addToCart } from '../../redux/actions';
import moment from 'moment';

class OffersComponent extends React.Component {
  state = {
    extended: undefined
  }

  getFormData = () => {
    return this.props.modelData;
  }

 formatItem = (item) => {
    return <>
      <Card
        title={
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span>{item.medname}</span>
          {!this.state.extended && <span>{item.manufacturername}</span>}
        </div>
      }
        className={this.state.extended && this.state.extended.offerid === item.offerid && 'spotlight'}>

        <div className="offer_image_wrapper">
          <img alt={item.medname} src={item.pictureurl ? item.pictureurl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Slika_nije_dostupna.svg/600px-Slika_nije_dostupna.svg.png"} />
        </div>
        <h3 className="offer_card_item_title">Cijena: <strike style={{ color: 'gray' }}>{item.price}</strike> {(item.price * (1 - item.discount / 100)).toFixed(2)} HRK</h3>

        <h4 className="offer_card_section_title">Specifikacija:</h4>
        <div className="offer_card_info_row">
          <div>Količina aktive tvari: <br /><strong>{item.amount} {item.measuringunit}</strong></div>
          <div>Popust: <br /><strong>{item.discount}%</strong></div>
          <div>Pakiranje: <br /><strong>{item.packing}</strong></div>
        </div>
        {this.state.extended && this.state.extended.offerid === item.offerid && <>
          <br/>
          <div className="offer_card_info_row">
            <div>Proizvođač: <br /><strong>{item.manufacturername}</strong></div>
            <div>Datum isteka: <br /><strong>{moment(item.dateofexpiry).format('DD.MM.YYYY.')}</strong></div>
          </div>
          <br/>
          <div className="offer_card_info_row">
            <div>Aktivna tvar: <br /><strong>{item.substancename}</strong></div>
            <div>ATK: <br /><strong>{item.atkname} - {item.atkdescription}</strong></div>
          </div>
        </>
        }
        <h4 className="offer_card_section_title">Ljekarna:</h4>
        <div className="offer_card_info_row">
          {/* <div>{item.addedtimestamp}</div>
                  <div>{item.dateofexpiry}</div> */}

          <div>Ime: <br /><strong>{item.farmacyname}</strong></div>
          <div>📍 Adresa: <br /><strong>{item.streetandnumber}</strong></div>
          <div>📞 Broj: <br /><strong>{item.phonenumber}</strong></div>

        </div>
        <DownOutlined onClick={() => this.setState({extended: this.state.extended ? undefined : item})}
                      className='icon' style={(this.state.extended && this.state.extended.offerid === item.offerid) ? {transform: 'rotate(180deg)'} : undefined}/>
        <br/>
        <Button className="rezerviraj_btn" onClick={() => {
          if (this.props.token === undefined) {
            this.props.history.push('/login');
          } else {
            this.props.dispatch(item);
          }
        }}><strong>Dodaj u Košaricu</strong></Button>
      </Card>

    </>
}

  render() {
    if(this.state.extended && this.getFormData().filter(item => item.offerid === this.state.extended.offerid).length === 0) {
      this.setState({extended: undefined})
    }

    return (
      <>
        <List
          className={["offers_list", this.state.extended && 'spotlight-background']}
          grid={{ gutter: 1, column: 2 }}
          size="large"
          dataSource={this.props.modelData}
          renderItem={item => (
            <List.Item>
              {this.formatItem(item)}
            </List.Item>
          )}
        />
      </>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (item) => dispatch(addToCart(item))
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OffersComponent));
