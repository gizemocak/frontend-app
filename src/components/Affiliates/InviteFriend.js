import React, { Component } from 'react';
import axios from "axios";
import './Affiliates.scss'

const url = "http://178.128.233.31";
const jwt = require('jsonwebtoken');

class InviteFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedInUser: "",
            email: "",
            ref_code: " "
        };
        this.invite = this.invite.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            let token = localStorage.getItem('userToken');
            const decoded = jwt.decode(token, { complete: true });
            const userName = decoded.payload.user;

            this.setState({
                loggedInUser: userName
            });
            try {
                axios.get(url + "/frontend/user_data/" + userName).then(res => {
                    // console.log(res.data.ref_code);
                    const referralCode = res.data.ref_code;
                    this.setState({
                        ref_code: referralCode
                    });
                    // console.log(this.state.ref_code)
                })
            } catch (e) {
                alert(e.message);
            }
        }, 50);
    }
    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    invite = async e => {
        try {
            e.preventDefault();
            console.log(this.state.loggedInUser, this.state.email, this.state.ref_code);
            await axios.post(url + "/frontend/invite_user", {
                username: this.state.loggedInUser,
                email: this.state.email
            }).then(res => {
                console.log(res.data.code);
                if (res.data.code === "Invite sent successfully") {
                    alert("Invite sent successfully, Thank you!");
                } else {
                    alert("Please try again!");
                }
            })

        } catch (e) {
            alert(e.message);
        }

    };

    render() {
        return (
            <div className="affiliates-container">
                <div >
                    <form onSubmit={this.invite}>
                        <div className="referralCode-container">
                            <label>Referral Code</label>
                            <p>{this.state.ref_code}</p>
                        </div>

                        <div class="form-group">
                            <input type="text" class="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required></input>
                        </div>
                        <div >
                            <button type="submit" name="invite" class="btn btn-info">Invite</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default InviteFriend;



