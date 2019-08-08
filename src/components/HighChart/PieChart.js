import React from "react";
import { render } from "react-dom";
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";
import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";

class PieChartCom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doughnutData: []
        };
    }

    componentDidMount() {
        this.loadData();
        setInterval(this.loadData, 30000);
    }
    loadData = async e => {
        let token = localStorage.getItem('userToken');
        const decoded = jwt.decode(token, { complete: true });
        const userName = decoded.payload.user;
        try {
            axios.post(url + "/users/balance", {
                key: "username",
                value: userName
            }).then(res => {
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
                });
                console.log(this.state.doughnutData);
            });
        } catch (e) {
            console.log(e);
        }
    };  
    getDoughnutData = (info, totalBalanceCAD) => {
        return {
            currency: info.currency,
            balance_cad: info.balance_cad,
            balance_cad_percentage: (info.balance_cad / totalBalanceCAD).toFixed(5)*100
        };
    };
    getData() {
        return {
            chart: {
                type: 'pie'
            },
            title: {
                text: ''
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y}'
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.x}%</b> of total<br/>'
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: "investments",
                    colorByPoint: true,
                    size: '60%',
                    innerSize: '40%',
                    data: 
                    this.state.doughnutData.map(function(item){
                            return {
                                name: item.currency,
                                y:item.balance_cad,
                                x: item.balance_cad_percentage
                            }
                        })
                }
            ]
        };
    }

    render() {
        var options = this.getData();
        return ( 
            <div>
                <PieChart highcharts={Highcharts} options={options} />
            </div>
        );
    }
}

export default PieChartCom;

