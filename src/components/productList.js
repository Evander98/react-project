import React from 'react'
import Axios from 'axios'
import cookie from 'universal-cookie'
import swal from 'sweetalert'
import CurrencyFormat from 'react-currency-format'
import { urlAPI } from '../supports/urlAPI'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import '../supports/css/productList.css'

const objCookie = new cookie()

class ProductList extends React.Component{
    state = {listProduct : [], search : ''}

    componentDidMount(){
        this.getDataProduct()
    }

    getDataProduct = () => {
        Axios.get(urlAPI + '/products/productList')
        .then((res) => this.setState({listProduct : res.data}))
        .catch((err) => console.log(err))
    }

    onBtnSearchClick = () => {
        this.setState({search : this.refs.searchBook.value})
    }

    onBtnAddToCart = (index) => {
        var cookieIdUser = objCookie.get('userId')
        var cart = {
            id_user : cookieIdUser,
            id_product : this.state.listProduct[index].id
        }
        Axios.post(urlAPI + '/cart/addProductList', cart)
        .then((res) => swal(res.data, '', 'success'))
        .catch((err) => console.log(err))
    }

    renderProductJsx = () => {
        var jsx = this.state.listProduct.map((val, index) => {
            if(val.product_name.toLowerCase().includes(this.refs.searchBook.value)){
            return(
                    <div className="card m-3" style={{width: '18rem'}}>
                        <Link to={'/product-detail/' + val.id} style={{marginBottom: '45%'}}><img src={urlAPI + '/' + val.product_image} className="card-img-top pointer" alt={val.product_name}/></Link>
                        {
                            val.product_discount > 0 ?
                            <div className='discount'>{val.product_discount}% OFF</div>
                            : null
                        }
                        <div className="card-body" style={{textAlign:'left'}}>
                            <h5 className="card-title" style={{position: 'absolute', bottom: '105px', left: '10px'}}>{val.product_name}</h5>
                            <div style={{position: 'absolute', bottom: '10px', left: '10px'}}>
                                {
                                    val.product_discount > 0 ?
                                    <p className="card-text price-before-discount"><CurrencyFormat value={(val.product_price)} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                    : null
                                }
                                <p className="card-text" style={{fontSize: '18px', fontWeight: '500', color: 'rgb(215,17,73)'}}><CurrencyFormat value={parseInt(val.product_price-(val.product_price*(val.product_discount/100)))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                {
                                    this.props.username === '' ?
                                    <Link to='/login'><input type='button' className="btn btn-primary" value='Add To Cart'/></Link>
                                    :
                                    <input type='button' className="btn btn-primary" value='Add To Cart' onClick={() => this.onBtnAddToCart(index)}/>
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        })
        return jsx
    }
    
    render(){
        return(
            <div className='container'>
                <div className="input-group" style={{width:"350px", position:'relative', left:'70.5%', margin:'1%'}}>
                    <input type="text" ref="searchBook" className="form-control" placeholder="Cari apa hari ini?" onChange={this.onBtnSearchClick}/>
                    <div className="input-group-append mr-2">
                        <button className="btn border-secondary" type="button" id="button-addon2"><i onClick={this.onBtnSearchClick} className="fas fa-search" /></button>
                    </div>
                </div> 
                <div className='row justify-content-center'>
                    {this.renderProductJsx()}
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
export default connect(mapStateToProps)(ProductList)