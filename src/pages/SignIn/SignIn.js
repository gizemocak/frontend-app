import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchToken } from '../../actions/signInActions';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { createBrowserHistory } from "history";
import decode from 'jwt-decode'
import './SignIn.scss';

const history = createBrowserHistory({ forceRefresh: true });
const url = "http://178.128.233.31";
const jwt = require('jsonwebtoken');

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      isAuthenticated: false
    };
    this.signIn = this.signIn.bind(this);
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

  signIn = async e => {
    try {
      e.preventDefault();
      console.log(this.state.userName, this.state.password);
      await axios.post(url + "/frontend/login", {
        password: this.state.password,
        username: this.state.userName
      }).then(res => {
        console.log(res.data.code);
        if (res.data.code === "Login successful") {
          //create jwt token and save it into localStorage
          jwt.sign({ user: this.state.userName }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
            localStorage.setItem("userToken", token);
          });
          //nav to dashboard page
          history.push("dashboard");
        }
      }).catch(error => {
        var errorResult = error.response.data.error;
        if (errorResult === "Incorrect Password") {
          alert("Incorrect Password, Please Try Again!");
        } else if (errorResult === "Email unconfirmed") {
          alert("Email Unconfirmed, Please Confirm Your Email First!");
        } else if (errorResult === "User does not exist") {
          alert("User Not Exist! Please Sign Up First!");
          history.push("signup");
        } else {
          alert("Network Error, Please Try Again!");
        }
      })
    } catch (e) {
      alert(e.message);
    }
  };

  render() {
    return (
      <div className="signin-container">
        <div >
          <form onSubmit={this.signIn}>
            <div className="form-group">
              <input type="text" className="form-control" name="userName" placeholder="UserName" value={this.state.userName} onChange={this.handleChange} required></input>
            </div>
            <div class="form-group">
              <input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required></input>
            </div>
            <div >
              <button type="submit" name="signIn" className="btn btn-primary btn-m round">Login</button>
            </div>
          </form>
        </div>
        <div className="signup-options-container">
          <NavLink to="/signup" className="signup-link">Sign Up</NavLink>
          <NavLink to="/forgotpassword" className="forgot-password-link">Forgot</NavLink>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    UserStore: state.UserStore
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        fetchToken,
      },
      dispatch
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn)
