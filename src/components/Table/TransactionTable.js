import React, { Component } from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactSearchBox from 'react-search-box'

import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://142.93.148.141";

class TransactionTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionData: []
        };
    }

    componentDidMount = () => {
        setTimeout(() => {
            let token = localStorage.getItem('userToken');

            const decoded = jwt.decode(token, { complete: true });
            const username = decoded.payload.user;

            axios.post(url + "/users/transaction_history", {
                account_id: 40
            }).then(res => {
                console.log(res.data.transaction_history);
                var result = [];

                for (var i = 0; i < res.data.transaction_history.length; i++) {
                    result.push(this.getTransactionData(res.data.transaction_history[i]));
                }
                this.setState({
                    transactionData: result
                })
                console.log(this.state.transactionData[1]);
            });
        }, 50);
    };

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
            accessor: 'date', // String-based value accessors!
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
                return '$' + data.amount_in_CAD.toFixed(2);
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
                            pageSize={data.length}
                            showPagination={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default TransactionTable;
