import React from 'react'
import Axios from 'axios'
import CurrencyFormat from 'react-currency-format'
import { urlAPI } from '../supports/urlAPI'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import '../supports/css/productList.css'

class ProductDetail extends React.Component {
    state = {product : {}}

    componentDidMount(){
        this.getDataApi()
    }

    getDataApi = () => {
        var idUrl = this.props.match.params.id
        Axios.get(urlAPI + '/products/' + idUrl)
        .then((res) => this.setState({product : res.data}))
        .catch((err) => console.log(err))
    }

    qtyValidation = () => {
        if(this.refs.inputQty.value < 1){
            this.refs.inputQty.value = 1
        }
    }

    render(){
        var {nama, harga, stock, discount, img, deskripsi} = this.state.product
        return(
            <div className='container mb-4'>
                <div className='row'>
                    <div className='col-md-4'>
                        <div className='card' style={{width:'100%', border:'none'}}>
                            <img src={img} className='card-img-top' alt={nama}/>
                            {
                                discount > 0 ?
                                <div className='discount'>{discount}% OFF</div>
                                : null
                            }
                        </div>
                    </div>
                    <div className='col-md-8' style={{textAlign:'left'}}>
                        <h1 style={{color: '#4C4C4C'}}>{nama}</h1>
                        {
                            discount > 0 ?
                            <span className='price-before-discount' style={{fontSize: '17px'}}>
                                <CurrencyFormat value={harga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                            </span>
                            : null
                        }
                        <div style={{fontSize:'24px', fontWeight:'600', color:'rgb(215,17,73)'}}><CurrencyFormat value={harga-(harga*(discount/100))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>
                        {
                            stock > 1 ?
                            <div style={{marginTop:'15px', color:'#606060', fontWeight:'500', fontSize:'14px'}}>Available {stock} Stocks</div>
                            :
                            <div style={{marginTop:'15px', color:'#606060', fontWeight:'500', fontSize:'14px'}}>Available {stock} Stock</div>
                        }
                        <div style={{color:'#606060', fontWeight:'400', fontSize:'14px'}}>Masukan jumlah yang diinginkan</div>
                        <input type='number' className='form-control' style={{width:'70px', marginTop:'5px'}} ref='inputQty' onChange={this.qtyValidation}/>
                        <div className='row mt-4'>
                            <div className='col-md-8'>
                                <p style={{color:'#606060', fontStyle:'italic'}}>{deskripsi}</p>
                            </div>
                        </div>
                        {
                            this.props.username === '' ?
                            <div className='row mt-4'>
                                <Link to='/login' style={{display: 'block', width: '100%', marginLeft: '0.82%', marginBottom: '1%'}}><input type='button' className='btn btn-outline-primary col-md-8' value='Buy Now'/></Link>
                                <input type='button' className='btn btn-outline-success col-md-4' style={{marginRight: '0.5%'}} value='Add To Cart'/>
                                <input type='button' className='btn btn-outline-success col-md-4' style={{marginLeft: '0.5%'}} value='Add To Wishlist'/>
                            </div>
                            :
                            <div className='row mt-4'>
                                <input type='button' className='btn btn-outline-primary col-md-8' value='Buy Now' style={{width: '100%', marginLeft: '0.5%', marginBottom: '1%'}}/>
                                <input type='button' className='btn btn-outline-success col-md-4' style={{marginRight: '0.5%'}} value='Add To Cart'/>
                                <input type='button' className='btn btn-outline-success col-md-4' style={{marginLeft: '0.5%'}} value='Add To Wishlist'/>
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