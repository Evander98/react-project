import React from 'react'
import Axios from 'axios';
import cookie from 'universal-cookie'
import CurrencyFormat from 'react-currency-format'
import { urlAPI } from '../supports/urlAPI';
import { Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert';

const objCookie = new cookie()

class Cart extends React.Component{
    state = {cartList : [], selectCart : -1}

    componentDidMount(){
        var cookieIdUser = objCookie.get('userId')
        this.getDataAPI(cookieIdUser)
    }

    getDataAPI = (cookieIdUser) => {
        Axios.get(urlAPI + '/cart/cart/' + cookieIdUser)
        .then((res) => this.setState({cartList : res.data}))
        .catch((err) => console.log(err))
    }

    fnTotalHarga = () => {
        var totalBayar = 0
        for(var i=0; i < this.state.cartList.length; i++){
            totalBayar += (this.state.cartList[i].product_price-(this.state.cartList[i].product_price*(this.state.cartList[i].product_discount/100))) * this.state.cartList[i].qty 
        }
        return totalBayar
    }

    editHandler = (index) => {
        this.setState({selectCart : index})
    }

    onBtnCancel = () => {
        this.setState({selectCart : -1})
    }

    onBtnSave = (val) => {
        if(this.refs.qtyEdit.value > val.product_stocks){
            swal('Insufficient Amount of Stocks', '', 'error')
        } else{
            if(this.refs.qtyEdit.value < 1 ){
                swal('Please check your quantity', 'Quantity cannot be less than 1', 'error')
            } else{
                var qty = this.refs.qtyEdit.value ? this.refs.qtyEdit.value : this.refs.qtyEdit.placeholder
                var newData = {
                    id : val.id,
                    id_user : objCookie.get('userId'),
                    id_product : val.id_product,
                    qty,
                    stocks : qty - val.qty
                }
                Axios.post(urlAPI + '/cart/editQty', newData)
                .then((res) => {
                    this.setState({cartList : res.data, selectCart : -1})
                    swal('Quantity Changed', '', 'success')
                })
                .catch((err) => console.log(err))
            }
        }
    }

    onBtnDelete = (val) => {
        var data = {
            id : val.id,
            qty : val.qty,
            id_product : val.id_product,
            id_user : objCookie.get('userId')
        }
        Axios.post(urlAPI + `/cart/deleteCart`, data)
        .then((res) => {
            this.setState({cartList : res.data})
            swal('Product Excluded from Cart', '', 'success')
        })
        .catch((err) => console.log(err))
    }

    onBtnCheckout = () => {
        var date = new Date()
        for(var i = 0; i < this.state.cartList.length; i++){
            var data = {
                id_user : this.state.cartList[i].id_user,
                id_product : this.state.cartList[i].id_product,
                qty : this.state.cartList[i].qty,
                total_price : parseInt(this.state.cartList[i].product_price-(this.state.cartList[i].product_price*(this.state.cartList[i].product_discount/100)))*this.state.cartList[i].qty,
                checkout_date : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
                verified : 0
            }
            Axios.post(urlAPI + '/checkout/checkout/' + data.id_user, data)
            .then((res) => {
                this.setState({cartList : res.data})
                swal('Checkout Succeed', '', 'success' )
            })
        }
    }

    renderJsx = () => {
        var jsx = this.state.cartList.map((val, index) => {
            if(this.state.selectCart === index){
                return (
                    <tr>
                        <th scope="row">{index+1}</th>
                        <td>{val.product_name}</td>
                        <td><CurrencyFormat value={parseInt(val.product_price-(val.product_price*(val.product_discount/100)))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                        <td><input type='text' className='form-control' placeholder={val.qty} ref='qtyEdit'/></td>
                        <td><img src={urlAPI + '/' + val.product_image} alt={val.product_name} width='50px'/></td>
                        <td><CurrencyFormat value={parseInt(val.product_price-(val.product_price*(val.product_discount/100)))*val.qty} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                        <td>
                            <Button animated color='teal' onClick={() => this.onBtnSave(val)}>
                                <Button.Content visible>Save</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='save' />
                                </Button.Content>
                            </Button>
                            <Button animated color='red' onClick={this.onBtnCancel}>
                                <Button.Content visible>Cancel</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='cancel' />
                                </Button.Content>
                            </Button>
                        </td>
                    </tr>
                )
            } else {
                return (
                    <tr>
                        <th scope="row">{index+1}</th>
                        <td>{val.product_name}</td>
                        <td><CurrencyFormat value={parseInt(val.product_price-(val.product_price*(val.product_discount/100)))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                        <td>{val.qty}</td>
                        <td><img src={urlAPI + '/' + val.product_image} alt={val.product_name} width='50px'/></td>
                        <td><CurrencyFormat value={parseInt(val.product_price-(val.product_price*(val.product_discount/100)))*val.qty} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                        <td>
                            <Button animated color='teal' onClick={() => this.editHandler(index)}>
                                <Button.Content visible>Edit</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='edit' />
                                </Button.Content>
                            </Button>
                            <Button animated color='red' onClick={() => this.onBtnDelete(val)}>
                                <Button.Content visible>Delete</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='delete' />
                                </Button.Content>
                            </Button>
                        </td>
                    </tr>
                )
            }
        })
        return jsx
    }

    render(){
        return(
            <div className='container'>
                {
                    this.fnTotalHarga() > 0 ?
                    <div>
                        <table className="table table-hover">
                            <thead className='thead-dark'>
                                <tr>
                                <th scope="col">NO.</th>
                                <th scope="col">NAMA PRODUK</th>
                                <th scope="col">HARGA</th>
                                <th scope="col">QTY</th>
                                <th scope="col">IMAGE</th>
                                <th scope="col">TOTAL</th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderJsx()}
                            </tbody>
                        </table>
                        <div className='row'>
                            <div className='col-md-6 mt-3' style={{textAlign : 'left'}}>
                                <h4>Total Bayar : <CurrencyFormat value={this.fnTotalHarga()} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h4>
                            </div>
                            <div className='col-md-6' style={{textAlign : 'right'}}>
                                <Button animated color='teal' onClick={this.onBtnCheckout}>
                                    <Button.Content visible>Checkout</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='check' />
                                    </Button.Content>
                                </Button>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <h1>Cart Anda Masih Kosong</h1>
                        <div className='mt-5'>
                            <Link to='/'>
                                <Button animated color='teal'>
                                    <Button.Content visible>Continue Shopping</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='shop' />
                                    </Button.Content>
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Cart