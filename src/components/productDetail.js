import React from 'react'
import Axios from 'axios'
import cookie from 'universal-cookie'
import CurrencyFormat from 'react-currency-format'
import { urlAPI } from '../supports/urlAPI'
import { connect } from 'react-redux'
import '../supports/css/productList.css'
import swal from 'sweetalert'

const objCookie = new cookie()

class ProductDetail extends React.Component {
    state = {product : {}}

    componentDidMount(){
        this.getDataApi()
    }

    getDataApi = () => {
        var idUrl = this.props.match.params.id
        Axios.get(urlAPI + '/products/productById/' + idUrl)
        .then((res) => {
            this.setState({product : res.data[0]})
        })
        .catch((err) => console.log(err))
    }

    qtyValidation = () => {
        if(this.refs.inputQty.value < 1){
            this.refs.inputQty.value = 1
        }
    }

    onBtnAddToCart = () => {
        if(this.refs.inputQty.value > this.state.product.product_stocks){
            swal('Insufficient Amount of Stocks', '', 'error')
        } else{
            var cookieIdUser = objCookie.get('userId')
            var cart = {
                id_user : cookieIdUser,
                id_product : this.state.product.id,
                qty : this.refs.inputQty.value ? parseInt(this.refs.inputQty.value) : this.refs.inputQty.value = 1
            }
            Axios.post(urlAPI + '/cart/addCart', cart)
            .then((res) => swal(res.data, '', 'success'))
            .catch((err) => console.log(err))
        }
    }


    render(){
        var {product_name, product_price, product_stocks, product_discount, product_image, product_description} = this.state.product
        return(
            <div className='container mb-4'>
                <div className='row'>
                    <div className='col-md-4'>
                        <div className='card' style={{width:'100%', border:'none'}}>
                            <img src={urlAPI + '/' + product_image} className='card-img-top' alt={product_name}/>
                            {
                                product_discount > 0 ?
                                <div className='discount'>{product_discount}% OFF</div>
                                : null
                            }
                        </div>
                    </div>
                    <div className='col-md-8' style={{textAlign:'left'}}>
                        <h1 style={{color: '#4C4C4C'}}>{product_name}</h1>
                        {
                            product_discount > 0 ?
                            <span className='price-before-discount' style={{fontSize: '17px'}}>
                                <CurrencyFormat value={product_price} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                            </span>
                            : null
                        }
                        <div style={{fontSize:'24px', fontWeight:'600', color:'rgb(215,17,73)'}}><CurrencyFormat value={product_price-(product_price*(product_discount/100))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>
                        {
                            product_stocks > 1 ?
                            <div style={{marginTop:'15px', color:'#606060', fontWeight:'500', fontSize:'14px'}}>Available {product_stocks} Stocks</div>
                            :
                            <div style={{marginTop:'15px', color:'#606060', fontWeight:'500', fontSize:'14px'}}>Available {product_stocks} Stock</div>
                        }
                        <div style={{color:'#606060', fontWeight:'400', fontSize:'14px'}}>Masukan jumlah yang diinginkan</div>
                        <input type='number' className='form-control' style={{width:'70px', marginTop:'5px'}} ref='inputQty' onChange={this.qtyValidation}/>
                        <div className='row mt-4'>
                            <div className='col-md-8'>
                                <p style={{color:'#606060', fontStyle:'italic'}}>{product_description}</p>
                            </div>
                        </div>
                        {
                            this.props.username === '' ?
                            <div className='row mt-4'>
                                <input type='button' className='btn btn-outline-primary col-md-4' style={{marginRight: '0.5%'}} value='Add To Cart'/>
                                <input type='button' className='btn btn-outline-primary col-md-4' style={{marginLeft: '0.5%'}} value='Add To Wishlist'/>
                            </div>
                            :
                            <div className='row mt-4'>
                                <input type='button' className='btn btn-outline-primary col-md-4' style={{marginRight: '0.5%'}} onClick={this.onBtnAddToCart} value='Add To Cart'/>
                                <input type='button' className='btn btn-outline-primary col-md-4' style={{marginLeft: '0.5%'}} value='Add To Wishlist'/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username
    }
}

export default connect(mapStateToProps)(ProductDetail)