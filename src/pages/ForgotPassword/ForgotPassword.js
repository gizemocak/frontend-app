import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { createBrowserHistory } from "history";
import axios from "axios";

import './ForgotPassword.scss';

const history = createBrowserHistory({ forceRefresh: true });
var url = "http://178.128.233.31";
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
    this.forgetPassword = this.forgetPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  emailValidator(email) {
    let emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    // console.log(emailPattern.test(email));
    return emailPattern.test(email);
  };

  forgetPassword = async e => {
    try {
        e.preventDefault();
        this.emailValidator(this.state.email);
        await axios.post(url + "/frontend/reset_password", {
            email: this.state.email
        }).then(res => {
            console.log(res.data.code);
            if(res.data.code==="Reset successful"){
                alert("Please check your email to reset password.");
            }else{
                alert("Please try again!");
            }
        })
    } catch (e) {
        alert(e.message);
    }
};

  render() {
    return <div className="signin-container">
      <div >
        <form onSubmit={this.forgetPassword}>
          <div className="form-group">
            <input type="email" className="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required></input>
          </div>
          <div >
            <button type="submit" name="forget" className="btn btn-primary btn-m round">Forgot Password</button>
          </div>
        </form>
      </div>
      <div className="signup-options-container">
        <NavLink to="/signin" className="signup-link">Sign In</NavLink>
        <NavLink to="/signup" className="forgot-password-link">Sign Up</NavLink>
      </div>
    </div>
  }
}

export default ForgotPassword;
