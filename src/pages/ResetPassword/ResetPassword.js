import React, { Component } from 'react';
import { createBrowserHistory } from "history";
import axios from "axios";

// import './ForgotPassword.scss';

const history = createBrowserHistory({ forceRefresh: true });
var url = "http://165.227.42.25";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            confirmPassword: ""
        };
        this.resetPassword = this.resetPassword.bind(this);
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
    resetPassword = async e => {
        try {
            e.preventDefault();
            if (this.state.newPassword === this.state.confirmPassword) {
                console.log("here");
                await axios.post(url + "/frontend/update_password", {
                     token: "some_token",
                     pass: this.state.newPassword
                    }).then(res => {
                    console.log(res.data.code);
                    if (res.data.code === "Reset successful") {
                        alert("Password reset successfully, you can login using the new password");
                        history.push("signin");
                    } else {
                        alert("Please try again!");
                    }
                })
            }
        } catch (e) {
            alert(e.message);
        }
    };

    render() {
        return <div className="signin-container">
            <div >
                <form onSubmit={this.resetPassword}>
                    <div className="form-group">
                        <input type="password" className="form-control" name="newPassword" placeholder="New Password" value={this.state.newPassword} onChange={this.handleChange} required></input>
                        <input type="password" className="form-control" name="confirmPassword" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange} required></input>
                    </div>
                    <div >
                        <button type="submit" name="reset" className=" btn btn-info fogotpwd btn">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    }
}

export default ResetPassword;
