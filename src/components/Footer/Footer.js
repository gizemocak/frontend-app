import React, { Component } from 'react';
import './Footer.scss';
import axios from "axios";
const url = "http://178.128.233.31";
const jwt = require('jsonwebtoken');

class Footer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            ref_code: ""
        };
    };
    componentDidMount() {
        this.loadData();
        setInterval(this.loadData, 30000);
    };
    loadData = async e => {
        let token = localStorage.getItem('userToken');
        const decoded = jwt.decode(token, { complete: true });
        const userName = decoded.payload.user;
        try {
            axios.get(url + "/frontend/user_data/" + userName).then(res => {
                // const referralCode = res.data.ref_code;
                this.setState({
                    ref_code: res.data.ref_code
                });
                // console.log(this.state.ref_code)
            });
        } catch (e) {
            console.log(e);
        }
    };
    
    render(){
        return (
                <div className="footer-control">
                    {/* <div className="footer-filter"> */}
                        <div>Dashboard</div>
                        <div>Affiliates</div>
                        <div>Stats</div>
                        <div>Exchange</div>
                        <div>Contact</div>
                        <div>Logout</div>
                        <div>Referral Code: {this.state.ref_code}</div>
                    {/* </div> */}
                </div>
            
        );
    }
}
export default Footer;
