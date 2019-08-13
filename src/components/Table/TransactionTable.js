import React, { Component } from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactSearchBox from 'react-search-box';
import TypeChecker from "typeco";

import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";
var numeral = require('numeral');

class TransactionTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            historyOption: 10,
            transactionData: [],
            filtered: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.getMatchedList = this.getMatchedList.bind(this);
    };
    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
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
            axios.post(url + "/accounts/transaction_history", {
                username: userName
            }).then(res => {

                console.log(res.data.transaction_history);
                var result = [];
                for (var k = 0; k < res.data.transaction_history.length; k++) {
                    result.push(this.getTransactionData(res.data.transaction_history[k]));
                }
                this.setState({
                    transactionData: result.reverse()
                })

                console.log(this.state.transactionData);
            });
        } catch (e) {
            console.log(e);
        }
    }
    getTransactionData = info => {
        var stringNumAmount = info.amount.toString();
        if (info.account_balance_cad != null) {
            var stringNumBalance = info.account_balance_cad.toFixed(8).toString();
        } else {
            var stringNumBalance = "0";
        }
        return {
            date: info.time,
            investment: info.currency,
            description: info.description,
            amount: this.numberFormat(stringNumAmount),
            amount_in_CAD: this.numberFormat(stringNumBalance)
        };
    };

    numberFormat(stringData) {
        if (stringData.length < 8) {
            stringData = stringData;
        }
        else if (stringData.length <= 12) {
            stringData = stringData.substring(0, stringData.length - 4) + ","
                + stringData.substring(stringData.length - 4, stringData.length);
        } else if (stringData.length <= 15) {
            stringData = stringData.substring(0, stringData.length - 12) + ","
                + stringData.substring(stringData.length - 12, stringData.length - 4) + ","
                + stringData.substring(stringData.length - 4, stringData.length);
        } else if (stringData.length <= 18) {
            stringData = stringData.substring(0, stringData.length - 15) + ","
                + stringData.substring(stringData.length - 15, stringData.length - 12) + ","
                + stringData.substring(stringData.length - 12, stringData.length - 4) + ","
                + stringData.substring(stringData.length - 4, stringData.length);
        }
        return stringData;
    };

    getMatchedList(searchText) {
        if (!TypeChecker.isEmpty(searchText)) {
            const res = this.state.transactionData.filter(item => {
                return item.description.includes(searchText)
                    || item.date.includes(searchText)
                    || item.investment.includes(searchText)
                    || item.amount.includes(searchText)
                    || item.amount_in_CAD.includes(searchText)
            });

            this.setState({ transactionData: res }, () => {
                console.log(this.state.transactionData);
            });
        }else{
            this.loadData();
        }
    }
    render() {
        var data = [];
        for (var i = 0; i < this.state.transactionData.length; i++) {
            data.push(this.state.transactionData[i]);
        }

        const columns = [{
            Header: 'Date',
            accessor: 'date',
        }, {
            Header: 'Investment',
            accessor: 'investment',
        }, {
            Header: 'Description',
            accessor: 'description',
        }, {
            Header: 'Amount',
            accessor: 'amount',
        }, {
            id: 'amount_in_CAD',
            Header: 'Amount in CAD',
            accessor: (data) => {
                return '$' + data.amount_in_CAD;
            }
        }]
        return (
            <div className="transactiontable-container">
                <div className="reacttable-container">
                    <div className="transaction-container">
                        <div className="table-title">Transaction History</div>
                        <div className="table-filters">
                            <div className="display-container">
                                <label>Show &ensp; </label>
                                <select type="text" name="historyOption" placeholder="Investment" value={this.state.historyOption} onChange={this.handleChange}>
                                    <option value='10'>10</option>
                                    <option value='25'>25</option>
                                    <option value='50'>50</option>
                                    <option value='100'>100</option>
                                </select>
                                <label> &ensp; Entites</label>
                            </div>
                            <div className="search-container">
                                <ReactSearchBox
                                    placeholder="search"
                                    onChange={v => {
                                        console.log(v);
                                        this.getMatchedList(v);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <ReactTable className="-striped"
                            data={this.state.transactionData}
                            columns={columns}
                            showPageSizeOptions={false}
                            pageSize={this.state.historyOption != 25 && this.state.historyOption != 50 && this.state.historyOption != 100 ? 10 : this.state.historyOption > data.length ? data.length : this.state.historyOption}
                            showPagination={true}
                            filterable
                            // onFilteredChange={this.state.filtered}
                            onFilteredChange={filtered => { this.setState({ filtered }); }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default TransactionTable;
