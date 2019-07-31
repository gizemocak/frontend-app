// import React, { Component } from 'react';
// import LineChart from 'react-linechart';
// import '../../../node_modules/react-linechart/dist/styles.css';

// class LineChartComponent extends Component {
//     render() {
//         const data = [
//             {
//                 color: "steelblue",
//                 points: [{ x: 1, y: 2 }, { x: 3, y: 5 }, { x: 7, y: -3 }]
//             }
//         ];
//         return (
//             <div className="line-chart-container">
//                 <div className="line-chart-wrapper">
//                     <div className="line-chart-controls">
//                         <div>Line Chart View</div>
//                         <div>Mountain Chart View</div>
//                         <div>
//                             <select>
//                                 <option value='last_30'>Last 30 Days</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="lineChart">
//                         <LineChart
//                             width={600}
//                             height={400}
//                             data={data}
//                         />
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default LineChartComponent;


import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import './LineChart.scss';
import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineChartData: [],
            investmentType: []
        };
    }
    componentDidMount = () => {
        setTimeout(() => {
            let token = localStorage.getItem('userToken');

            const decoded = jwt.decode(token, { complete: true });
            const username = decoded.payload.user;

            axios.post(url + "/users/balance_history", {
                username: username,
                time_period_days: 90
            }).then(res => {
                // console.log(res.data);
                var result = [];
                const count = res.data.balance_history.length;
                const investment = [];
                for (var i = 0; i < count; i++) {
                    investment.push(this.getBalanceHistoryData(res.data.balance_history[i]))
                }
                // this.setState({
                //     investmentType: investment
                // })
                // console.log(this.state.investmentType);
                ///////////////////////////////////
                console.log(investment);
                var date = [];
                var dataset = [];
                console.log(investment[0].account_history.length);
                for (var x = investment[0].account_history.length - 1; x >= 0 ; x--) {
                    date.push(investment[0].account_history[x].date);
                }
                
                for (var j = 0; j < investment.length; j++) {

                    dataset.push(this.getDataset(investment[j]));
                    let customData = {
                        labels: date,
                        datasets: dataset
                    }
                    // console.log(customData);
                    this.setState({
                        lineChartData: customData
                    })
                    console.log(this.state.lineChartData);
                }
            });
        }, 50);
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
            data: amountData.reverse(),
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10
        }
    };

    render() {

        // let data = this.getData();
        return (
            <div className="line-chart-container">
                <div className="line-chart-wrapper">
                    <div className="line-chart-controls">
                        <div>Line Chart View</div>
                        <div>Mountain Chart View</div>
                        <div>
                            <select>
                                <option value='last_30'>Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                    <div className="lineChart">
                        <Line
                            data={this.state.lineChartData}
                            height={100}
                        />
                    </div>
                </div>
            </div>
        );
    }



}

export default LineChart;
