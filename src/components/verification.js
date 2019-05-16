import React from 'react'
import QueryString from 'query-string'
import Axios from 'axios';
import { Redirect } from 'react-router-dom'

class Verification extends React.Component {

    componentDidMount(){
        this.verify()
    }

    verify = () => {
        var params = QueryString.parse(this.props.location.search)
        Axios.put('http://localhost:2000/users/verify', {
            username : params.username,
            password : params.password
        })
        .then((res) => alert(res.data))
        .catch((err) => console.log(err))
    }
    render(){
        return(
            <div>
                <Redirect to='/login'/>
            </div>
        )
    }
}

export default Verification