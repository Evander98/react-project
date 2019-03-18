import React from 'react';
import Loader from 'react-loader-spinner'
import cookie from 'universal-cookie'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { onLogin } from '../1.actions'

const Cookie = new cookie()
class Login extends React.Component {
    componentWillReceiveProps(newProps){
        Cookie.set('userData', newProps.username, {path: '/'})
        Cookie.set('userId', newProps.userId, {path: '/'})
    }

    onBtnLoginClick = () => {
        var username = this.refs.username.value
        var password = this.refs.password.value
        this.props.onLogin(username, password)
    }

    renderBtnOrLoading = () => {
        if(this.props.loading){
            return <Loader type="ThreeDots" color="#00BFFF" height="50" width="50"/>
        } else{
            return <button type="button" className="btn btn-primary" onClick={this.onBtnLoginClick} style={{width:"300px"}} ><i className="fas fa-sign-in-alt" /> Login</button>
        }
    }

    renderErrorMessage = () => {
        if(this.props.error !== ""){
            return <div className='alert alert-danger mt-3' role='alert'>
                        {this.props.error}
                    </div>
        }
    }

    render() {
        if(this.props.username !== ''){
            return <Redirect to='/'/>
        }
        return (
            <div className="container myBody" style={{minHeight:"600px"}}>
            <div className="row justify-content-sm-center ml-auto mr-auto mt-3" >
                <form className="border mb-3" style={{padding:"20px", borderRadius:"5%"}} ref="formLogin">
                    <fieldset>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Username</label>
                            <div className="col-sm-9">
                            <input type="text" ref="username" className="form-control" id="inputEmail" placeholder="Username" required autoFocus/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Password</label>
                            <div className="col-sm-9">
                            <input type="password" ref="password" className="form-control" id="inputPassword" placeholder="Password" onKeyPress={this.renderOnKeyPress} required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-12" style={{textAlign : 'center'}}>
                                {this.renderBtnOrLoading()}
                                {this.renderErrorMessage()}
                            </div>
                        </div>
                        <div className="btn my-auto"><p>Don't have Account? <Link to="/register" className="border-bottom">Sign Up!</Link></p></div>
                    </fieldset>
                </form>
                
            </div>                
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        userId : state.user.id,
        username : state.user.username,
        loading : state.user.loading,
        error : state.user.error
    }
}

export default connect(mapStateToProps, { onLogin })(Login)