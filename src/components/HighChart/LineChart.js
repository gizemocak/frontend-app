import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";


class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineChartData: [],
            investmentType: [],
            xAxisData: []
        };
    };
    componentDidMount() {
        this.loadData();
        setInterval(this.loadData, 30000);
    }
    loadData = async e => {
        let token = localStorage.getItem('userToken');
        const decoded = jwt.decode(token, { complete: true });
        const userName = decoded.payload.user;
        try {
            axios.post(url + "/users/balance_history", {
                username: userName,
                time_period_days: 30
            }).then(res => {
                var result = [];
                const count = res.data.balance_history.length;
                const investment = [];
                for (var i = 0; i < count; i++) {
                    investment.push(this.getBalanceHistoryData(res.data.balance_history[i]))
                }
                var date = [];
                var dataset = [];
                console.log(investment[0].account_history.length);
                for (var x = investment[0].account_history.length - 1; x >= 0; x--) {
                    date.push(investment[0].account_history[x].date);
                }
                this.setState({
                    xAxisData: date
                });
                console.log(this.state.xAxisData);
                for (var j = 0; j < investment.length; j++) {
                    dataset.push(this.getDataset(investment[j]));
                    let customData = {
                        // labels: date,
                        datasets: dataset
                    }
                    this.setState({
                        lineChartData: dataset
                    })
                    console.log(this.state.lineChartData);
                }
            });
        } catch (e) {
            console.log(e);
        }
    };
    getBalanceHistoryData = info => {
        return {
            investment_name: info.investment_name,
            account_history: info.account_history
        };
    };

    getDataset = result => {
        var amountData = [];
        for (var i = 0; i < result.account_history.length; i++) {
            amountData.push(result.account_history[i].account_balance_cad);
        }
        return {
            label: result.investment_name,
            data: amountData.reverse()
        }
    };
    getData() {
        return {
            title: "",
            xAxis: {
                // categories: [
                //     this.state.xAxisData
                // ]
                categories :["A","B","C"]
            },
            series:
                [
                    // this.state.lineChartData.map(function (item) {
                    //     console.log(item.label);
                    //     console.log(item.data);
                    //     return {
                    //         name: item.label,
                    //         data: item.data
                    //     }
                    // })
                    


                    { 
                        name:"first",
                        data: [1, 2, 3] 
                    },
                    {
                        name:"second",
                        data:[4,3,9]
                    }
                ]
        }
    };

    render() {
        var chartOptions = this.getData();
        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </div>
        )
    }
}

export default LineChart;