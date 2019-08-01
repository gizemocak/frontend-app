import React, { Component } from 'react';
import { createBrowserHistory } from "history";
import axios from "axios";

const history = createBrowserHistory({ forceRefresh: true });
var url = "http://178.128.233.31";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token:"",
            newPassword: "",
            confirmPassword: ""
        };
        this.resetPassword = this.resetPassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const emailToken = query.get('token');
        console.log(emailToken);
        this.setState({
            token: emailToken
        })
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

                await axios.post(url + "/frontend/update_password", {
                    token: this.state.token,
                    pass: this.state.newPassword
                }).then(res => {
                    console.log(res.data.code);
                    if (res.data.code === "Reset successful") {
                        alert("Password reset successfully, you can login using the new password now.");
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
                        <button type="submit" name="reset" className="btn btn-primary btn-m round">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    }
}

export default ResetPassword;
