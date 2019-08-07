import React, { Component } from 'react';
import axios from "axios";
const url = "http://178.128.233.31";
const jwt = require('jsonwebtoken');

class GlobalUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            investment: "",
            amount: "",
            investments: []
        };
        this.globalUpdate = this.globalUpdate.bind(this);
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

    globalUpdate = async e => {
        try {
            e.preventDefault();
            console.log(this.state.investment, this.state.amount);
            await axios.post(url + "/backend/transactions/global_update", {
                investment_id: this.state.investment,
                amount: this.state.amount,
                username: "admin"
            }).then(res => {
                console.log(res.data);
                // if (res.data.code === "Deposit successful") {
                //     alert("Deposit successfully, Thank you!");
                // }
            }).catch(error => {
                console.log(error.response.data.error);
                alert(error.response.data.msg + " " + "Please Try Again");
            })

        } catch (e) {
            alert(e.message);
        }

    };

    render() {
        return (
            <div className="transfer-container">
                <div className="transfer-form-wrapper">
                    <div className="form">
                        <form onSubmit={this.globalUpdate}>
                            <div class="form-group">
                                <input type="number" className="form-control" name="amount" placeholder="Amount" value={this.state.amount} onChange={this.handleChange} required></input>
                            </div>
                            <div className="form-group">
                                <select type="text" className="form-control" name="investment" placeholder="Investment" value={this.state.investment} onChange={this.handleChange} required>
                                    <option>Investment</option>
                                    {this.state.investments.map(function (item) {
                                        return <option value={item.investmentID}>{item.investmentName}</option>
                                    })}
                                </select>
                            </div>
                            <div >
                                <button type="submit" name="globalUpdate" className="btn btn-primary btn-m round">Global Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default GlobalUpdate;



