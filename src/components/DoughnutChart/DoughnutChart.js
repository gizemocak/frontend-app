import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

import './DoughnutChart.scss';

import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31";

class DoughnutChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doughnutData: []
        };
    }

    componentDidMount = () => {
        setTimeout(() => {
            let token = localStorage.getItem('userToken');

            const decoded = jwt.decode(token, { complete: true });
            const username = decoded.payload.user;

            axios.post(url + "/users/balance", {
                key: "username",
                value: "ayesha"
                // value: username
            }).then(res => {
                // console.log(res.data.user_balance);
                var result = [];
                var totalBalanceCAD = 0;
                for (var i = 0; i < res.data.user_balance.length; i++) {
                     totalBalanceCAD += res.data.user_balance[i].balance_cad;
                }

                for (var i = 0; i < res.data.user_balance.length; i++) {
                    result.push(this.getDoughnutData(res.data.user_balance[i],totalBalanceCAD));
                }
                this.setState({
                    doughnutData: result
                })
                // console.log(this.state.doughnutData[3]);
            });
        }, 50);
    };

    getDoughnutData = (info, totalBalanceCAD) => {
        return {
            currency: info.currency,
            balance_cad: info.balance_cad.toFixed(2),
            balance_cad_percentage: (info.balance_cad / totalBalanceCAD).toFixed(5)*100
        };
    };
    getData() {
        var dataPercentage = [];
        for (var i= 0; i< this.state.doughnutData.length; i++){
            dataPercentage.push(this.state.doughnutData[i].balance_cad_percentage);
        }
        // console.log(dataPercentage);
        return {
            datasets: [{
                data: dataPercentage,
                backgroundColor: Object.values(this.getLabelsAndColors())
            }],
            labels: Object.keys(this.getLabelsAndColors())
        };
    }

    getOptions() {
        return {
            responsive: true,
            maintainAspectRatio: true
        }
    }

    getLegend() {
        return {
            position: 'bottom'
        };
    }

    getLabelsAndColors() {
        return {
            'Red': '#FF6384',
            'Blue': '#36A2EB',
            'Yellow': '#FFCE56'
        }
    }
    render() {
        let data = this.getData();
        return (
            <div className="doughnut-container">
                <div className="doughnut-wrapper">
                    <Doughnut
                        data={data}
                        width={300}
                        height={300}
                        options={this.getOptions()}
                        legend={this.getLegend()}
                    />
                </div>
            </div>
        );
    }



}

export default DoughnutChart;
