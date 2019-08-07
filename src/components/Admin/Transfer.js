import React, { Component } from 'react';
import axios from "axios";
const url = "http://178.128.233.31";
const jwt = require('jsonwebtoken');

class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            investment: "",
            fromUsername: "",
            toUsername: "",
            amount: "",
            investments: []
        };
        this.transfer = this.transfer.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    componentDidMount() {
        this.loadData();
        setInterval(this.loadData, 30000);
    };
    loadData = async e => {
        try {
            axios.get(url + "/frontend/all_investments").then(res => {
                // console.log(res.data.investments);
                var result = [];
                for (var i = 0; i < res.data.investments.length; i++) {
                    result.push(this.getInvestmentData(res.data.investments[i]));
                }
                const uniqueResult = Array.from(new Set(result));
                console.log(uniqueResult);
                this.setState({
                    investments: uniqueResult
                });
                console.log(this.state.investments);
            });
        } catch (e) {
            console.log(e);
        }
    };
    getInvestmentData = info => {
        return {
            investmentID: info.investment_id,
            investmentName: info.investment_name
        };
    };
    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    transfer = async e => {
        try {
            e.preventDefault();
            console.log(this.state.investment, this.state.fromUsername,this.state.toUsername, this.state.amount);
            await axios.post(url + "/backend/transactions/transfer", {
                amount:  this.state.amount,
                username: "admin", 
                sender: this.state.fromUsername,
                recipient: this.state.toUsername,
                investment_id: this.state.investment,
                custom_memo: "transfer to" + this.state.toUsername
            }).then(res => {
                console.log(res.data);
                if (res.data.code === "transfer amount successful") {
                    alert("transfer amount successfully, Thank you!");
                }
            }).catch(error => {
                console.log(error.response.data.error);
                alert(error.response.data.msg +" " + "Please Try Again");
              })

        } catch (e) {
            alert(e.message);
        }
    };

    render() {
        return (
            <div className="deposit-container">
                <div className="form-container">
                    <div className="form">
                        <form onSubmit={this.transfer}>
                            <div className="form-group">
                                <select type="text" className="form-control" name="investment" placeholder="Investment" value={this.state.investment} onChange={this.handleChange} required>
                                    <option>Investment</option>
                                    {this.state.investments.map(function (item) {
                                        return <option value = {item.investmentID}>{item.investmentName}</option>
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" name="fromUsername" placeholder="From:Username" value={this.state.fromUsername} onChange={this.handleChange} required></input>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" name="toUsername" placeholder="To:Username" value={this.state.toUsername} onChange={this.handleChange} required></input>
                            </div>
                            <div class="form-group">
                                <input type="number" className="form-control" name="amount" placeholder="Amount" value={this.state.amount} onChange={this.handleChange} required></input>
                            </div>
                            <div >
                                <button type="submit" name="deposit" className="btn btn-primary btn-m round">Transfer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Transfer;



