import Axios from 'axios'
import { urlAPI } from '../supports/urlAPI'
// import cookie from 'universal-cookie'

// const objCookie = new cookie()
export const onLogin = (username, password) => {
    return (dispatch) => {
        dispatch({
            type : 'LOADING'
        })

        Axios.get(urlAPI + '/users/login', {params : {username, password}})
        .then((res) => {
            if(res.data.length > 0){
                if(res.data[0].verified){
                    dispatch({
                        type : 'LOGIN_SUCCESS',
                        payload : {id : res.data[0].id, username : res.data[0].username, role : res.data[0].role}
                    })
                } else{
                    dispatch({
                        type : 'NOT_VERIFIED'
                    })
                }
            } else{
                dispatch({
                    type : 'USER_NOT_FOUND'
                })
            }
        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type : 'SERVER_ERROR'
            })
        })
    }
}

export const keepLogin = (cookie) => {
    return (dispatch) => {
        Axios.get(urlAPI + '/users/keepLogin', {params : {username : cookie}})
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : res.data[0]
                })
            }
        })
        .catch((err) => console.log(err))
    }
}

export const resetUser = () => {
    return {
        type : 'RESET_USER'
    }
}

export const userRegister = (username, password, email, phone) => {
    return (dispatch) => {
        dispatch({
            type : 'LOADING'
        })
        var newData = {username, password, email, phone, role : 'user'}
        Axios.post(urlAPI + '/users/register', newData)
        .then((res) => {
            if(res.data === 'Username has been taken'){
                dispatch({
                    type : 'USERNAME_NOT_AVAILABLE'
                })
            } else{
                dispatch({
                        type : 'REGISTER_SUCCESS',
                        payload : res.data
                    }
                )
            }
        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type : 'SERVER_ERROR'
            })
        })

        // Axios.get(urlAPI + '/users', {params : {username : newData.username}})
        // .then((res) => {
        //     if(res.data.length > 0){
        //         dispatch({
        //             type : 'USERNAME_NOT_AVAILABLE'
        //         })
        //     } else{
        //         Axios.post(urlAPI + '/users/register', newData)
        //         .then((res) => dispatch({
        //             type : 'LOGIN_SUCCESS',
        //             payload : {username : newData.username}
        //         }, objCookie.set('userData', username, {path : '/'}, alert(res.data))
        //         ))
        //         .catch((err) => console.log(err))
        //     }
        // })
        // .catch((err) => {
        //     console.log(err)
        //     dispatch({
        //         type : 'SERVER_ERROR'
        //     })
        // })
    }
}