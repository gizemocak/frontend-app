import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { createBrowserHistory } from "history";
import axios from "axios";
import './SignUp.scss';
import SignUpMessage from './signupMessage';
const history = createBrowserHistory({ forceRefresh: true });
var url = "http://178.128.233.31";
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            email: "",
            password: "",
            referralCode: "",
            signedUp: false,
            refCodeFromFriend: ""
        };
        this.newUserSignUp = this.newUserSignUp.bind(this);
        // this.emailValidator = this.emailValidator.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const refCode = query.get('ref_code');
        console.log(refCode);
        if(refCode != null){
            this.setState({
                refCodeFromFriend:refCode
            })
        }    
    };

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
                if (res.data.code === "Signup successful") {
                    //should let user check their email first
                    alert("Signup Successfully, Please verify your account through your email address");
                    this.setState({
                        signedUp:true
                    });
                    history.push("signin");
                } else {
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
                            {this.state.refCodeFromFriend==="" ? 
                            <input type="text" class="form-control" name="referralCode" placeholder="Referral code" value={this.state.referralCode} onChange={this.handleChange} required></input> 
                            : <input type="text" class="form-control" name="referralCodeFromFriend" placeholder="Referral code" value={this.state.refCodeFromFriend} />}
                            
                        </div>
                        <div >
                            <button type="submit" name="signIn" class="btn btn-primary btn-m round">Sign Up</button>
                        </div>
                    </form>
                </div>
                <div class="signup-options-container">
                    <NavLink to="/signIn" className="signup-link" >Sign In</NavLink>
                    <NavLink to="/forgotpassword" className="forgot-password-link">Forgot</NavLink>
                </div>
                {/* <div>
                    {this.state.signedUp === true} ? <SignUpMessage /> : null
                </div> */}
            </div>
        );
    }
}

export default SignUp;