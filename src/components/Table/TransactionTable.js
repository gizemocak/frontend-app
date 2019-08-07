import React, { Component } from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactSearchBox from 'react-search-box'

import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";
var numeral = require('numeral');

class TransactionTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionData: []
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
            });
        } catch (e) {
            console.log(e);
        }
    }
    getTransactionData = info => {
        return {
            date: info.time,
            investment: info.type,
            description: info.description,
            amount: info.amount,
            amount_in_CAD: info.account_balance_cad
        };
    };

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
                var stringCAD = numeral(data.amount_in_CAD).format('$000,000,000.00000000');
                return stringCAD;
            }
        }]
        return (
            <div className="transactiontable-container">
                <div className="reacttable-container">
                    <div className="transaction-container">
                        <div className="table-title">Transaction History</div>
                        <div className="table-filters">
                            <div className="display-container">
                                <label>Show  </label>
                                <select className="numberOption">
                                    <option value='last_30'>10</option>
                                    <option value='last_30'>20</option>
                                </select>
                                <label>  Entites</label>
                            </div>
                            <div className="search-container">
                                <ReactSearchBox
                                    placeholder="search"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <ReactTable className="-striped"
                            data={data}
                            columns={columns}
                            pageSize={(data.length > 10) ? 10 : data.length}
                            showPagination={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default TransactionTable;
