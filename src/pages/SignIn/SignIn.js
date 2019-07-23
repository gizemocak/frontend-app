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
const url = "http://165.227.42.25";
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
          // console.log(res.data.token);
          // this.setState({
          //   isAuthenticated:true
          // });

          jwt.sign({ user: this.state.userName }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
            localStorage.setItem("userToken", token);
          });
          setTimeout(function () {
            let token = localStorage.getItem('userToken');
            console.log(token);

            const decoded = jwt.decode(token, { complete: true });
            console.log(decoded.payload.user);
          }, 50);


          history.push("dashboard");
        } else {
          alert("Login Failed! Please Sign Up First!");
          history.push("signup");
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
            <div class="form-group">
              <input type="text" class="form-control" name="userName" placeholder="UerName" value={this.state.userName} onChange={this.handleChange} required></input>
            </div>
            <div class="form-group">
              <input type="password" class="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required></input>
            </div>
            <div >
              <button type="submit" name="signIn" class=" btn btn-info">Log In</button>
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
