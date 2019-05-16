import React, { Component } from 'react';
import Navbar from './components/header'
import Homepage from './components/homepage'
import Login from './components/login'
import Register from './components/register'
import ProductList from './components/productList'
import ProductDetail from './components/productDetail'
import Manage from './components/admin/manageProduct'
import Cart from './components/cart'
import Verify from './components/verification'
import Footer from './components/footer'
import PageNotFound from './components/404'
import cookie from 'universal-cookie'
import { Route, withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux'
import { keepLogin } from './1.actions'
import './App.css';


const objCookie = new cookie()

class App extends Component {
  componentDidMount(){
    var cookies = objCookie.get('userData')
    if(cookies !== undefined){
      this.props.keepLogin(cookies)
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar/>
        <Switch>
          <Route path='/' component={Homepage} exact/>
          <Route path='/login' component={Login} exact/>
          <Route path='/register' component={Register} exact/>
          <Route path='/products' component={ProductList} exact/>
          <Route path='/product-detail/:id' component={ProductDetail} exact/>
          <Route path='/manage-product' component={Manage} exact/>
          <Route path='/cart' component={Cart} exact/>
          <Route path='/verify' component={Verify} exact/>
          <Route path='*' component={PageNotFound} exact/>
        </Switch>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(null, { keepLogin })(App));
