import React, { Component } from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from "axios";
import { createBrowserHistory } from "history";
const history = createBrowserHistory({ forceRefresh: true });
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";
var numeral = require('numeral');

class ChartTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: []
        };
        this.getTableData = this.getTableData.bind(this);
    };
    componentDidMount() {
        this.loadData();
        setInterval(this.loadData, 30000);
    };
    loadData = async e => {
        let token = localStorage.getItem('userToken');
        try {
            jwt.verify(token, "secretkey", (err, decoded) => {
                if (!err) {
                    console.log(decoded.user);
                    const username = decoded.user;
                    axios.post(url + "/users/balance", {
                        key: "username",
                        value: username
                    }).then(res => {
                        var result = [];
                        for (var i = 0; i < res.data.user_balance.length; i++) {
                            result.push(this.getTableData(res.data.user_balance[i]));
                        }
                        this.setState({
                            tableData: result
                        })
                    });
                } else {
                    console.log(err);
                    localStorage.removeItem('userToken');
                    history.push("signin");
                }
            });
        } catch (e) {
            console.log(e);
        }
    };
    getTableData = info => {
        if(info.balance != null){
            var stringBalance = info.balance.toFixed(8).toString();
        }else{
            var stringBalance = "0.00000000";
        }
        
        if (info.balance_cad != null) {
            var stringBalanceCAD = info.balance_cad.toFixed(8).toString();
        } else {
            var stringBalanceCAD = "0.00000000";
        }
        return {
            currency: info.currency,
            balance: this.numberFormat(stringBalance),
            balance_cad: this.numberFormat(stringBalanceCAD)
        };
    };
    numberFormat(stringData){
        if (stringData.length<8){
            stringData = stringData;
        }
        else if(stringData.length <= 12) {
            stringData = stringData.substring(0, stringData.length - 4) + ","
                + stringData.substring(stringData.length - 4, stringData.length);
        } else if (stringData.length <= 15) {
            stringData = stringData.substring(0, stringData.length - 12) + ","
                + stringData.substring(stringData.length - 12, stringData.length - 4) + ","
                + stringData.substring(stringData.length - 4, stringData.length);
        } else if(stringData.length<=18){
            stringData = stringData.substring(0, stringData.length - 15) + ","
                + stringData.substring(stringData.length - 15, stringData.length - 12) + ","
                + stringData.substring(stringData.length - 12, stringData.length - 4) + ","
                + stringData.substring(stringData.length - 4, stringData.length);
        }
        return stringData;
    };
    render() {
        var data = [];
        var balanceCAD = 0;
        for (var i = 0; i < this.state.tableData.length; i++) {
            data.push(this.state.tableData[i]);
            console.log(this.state.tableData[i].balance_cad);
            parseFloat(this.state.tableData[i].balance_cad.replace(/,/g, ''));
            balanceCAD += parseFloat(this.state.tableData[i].balance_cad.replace(/,/g, ''));
            var stringTotalBalanceCAD= this.numberFormat(balanceCAD.toString());
        }
        data.push({ currency: "Total in CAD", balance_cad: stringTotalBalanceCAD });
        const columns = [{
            accessor: 'currency', // String-based value accessors!
        }, {
            // accessor: 'balance',
            id: 'balance',
            // accessor: (data) => {
            //     if (data.balance != null) {
            //         var stringNumber = numeral(data.balance).format('$000,000,000.00000000');
            //         return stringNumber;
            //     }
            // },
            accessor: (data) => {
                if(data.balance != null){
                    return '$' + data.balance;
                } 
            }

        }, {
            // accessor: 'balance_cad',
            id: 'balance_cad',
            // accessor: (data) => {
            //     var stringCAD = numeral(data.balance_cad).format('$000,000,000.00000000');
            //     return stringCAD;
            // },
            accessor: (data) => {
                return '$' + data.balance_cad;
            }
        }]

        return (
            <div className="Charttable-container">
                <ReactTable className="-striped"
                    data={data}
                    columns={columns}
                    pageSize={data.length}
                    showPagination={false}
                />
            </div>
        );
    }
}
export default ChartTable;
