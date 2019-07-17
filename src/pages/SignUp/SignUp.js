import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { createBrowserHistory } from "history";
import axios from "axios";
import './SignUp.scss';
const history = createBrowserHistory({ forceRefresh: true });
var url = "http://165.227.42.25";
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            email: "",
            password: "",
            referralCode: ""
        };
        this.newUserSignUp = this.newUserSignUp.bind(this);
        // this.emailValidator = this.emailValidator.bind(this);
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

    newUserSignUp = async e => {
        // e.preventDefault();
        // console.log("comeinto method");
        try {
            e.preventDefault();
            this.emailValidator(this.state.email);
            await axios.post(url + "/frontend/signup", {
                code: this.state.referralCode,
                password: this.state.password,
                username: this.state.userName,
                email: this.state.email
            }).then(res => {
                console.log(res.data.code);
                if(res.data.code==="Signup successful"){
                    //should let user check their email first
                    history.push("signin");
                }else{
                    alert("Sign up failed! Please try again!");
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
                    <form onSubmit={this.newUserSignUp}>
                        <div class="form-group">
                            <input type="text" class="form-control" name="userName" placeholder="UserName" value={this.state.userName} onChange={this.handleChange} required></input>
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required></input>
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required></input>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="referralCode" placeholder="Referral code" value={this.state.referralCode} onChange={this.handleChange} required></input>
                        </div>
                        <div >
                            <button type="submit" name="signIn" class=" btn btn-info">Sign Up</button>
                        </div>
                    </form>
                </div>
                <div class="signup-options-container">
                    <NavLink to="/signIn" className="signup-link" >Sign In</NavLink>
                    <NavLink to="/forgotpassword" className="forgot-password-link">Forgot</NavLink>

                </div>
            </div>
        );
    }
}

export default SignUp;





