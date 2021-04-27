import { List, Card } from 'antd';

import { deleteFromCart } from '../../redux/actions';
import { connect } from 'react-redux'
import { DeleteTwoTone } from '@ant-design/icons';

const CartListComponent = (props) => {
    console.log(props)
    return (
        <List
            className="cart_list"
            grid={{ gutter: 1, column: 1 }}
            size="large"
            dataSource={props.cart.items}
            renderItem={item => (
                <List.Item className="cart_list_item">
                    <Card title={item.medname}>



                        <div className="cart_image_wrapper">
                            {/* {item.pictureurl} */}
                            <img alt={item.medname} src={item.pictureurl ? item.pictureurl : "https://www.lupocet.hr/images/products/packshots/LUPOCET_500mg_filmom_oblozene_tablete.png"} />
                        </div>

                        <div className="cart_card_column">
                            <h4 className="cart_card_section_title">Ljekarna:</h4>
                            <div className="cart_card_info_row">
                                {/* <div>{item.addedtimestamp}</div>
                  <div>{item.dateofexpiry}</div> */}

                                <div>Ime:<br/><strong>{item.farmacyname}</strong></div>
                                <div>📍 Adresa:<br/><strong>{item.streetandnumber}</strong></div>
                                <div>📞 Broj:<br/><strong>{item.phonenumber}</strong></div>


                            </div>
                        </div>



                        <div className="cart_card_column">
                            <br />
                            <div className="cart_card_info_row">
                            {item.amount &&
                                <div>Kolicina: <strong>{item.amount}</strong></div>
                            }
                            {!item.amount &&
                                <div>Kolicina: <strong>1</strong></div>
                            }


                            </div>
                        </div>

                        <div className="cart_card_column">
                            <h4 className="offer_card_item_title">Cijena:<br/><strike style={{color: 'gray'}}>{item.price}</strike> {(item.price*(1-item.discount/100)).toFixed(2)} HRK</h4>
                        </div>
                        {!props.disableDelete &&
                            <div className="cart_card_column">
                                <br />
                                <DeleteTwoTone onClick={() => props.delete(item.offerid)} className="red_trash_icon" twoToneColor="red" />
                            </div>
                        }



                    </Card>

                </List.Item>

            )}
        />
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        delete: (id) => dispatch(deleteFromCart(id))
    }
}

export default connect(null, mapDispatchToProps)(CartListComponent);
