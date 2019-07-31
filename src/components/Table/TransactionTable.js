import React, { Component } from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactSearchBox from 'react-search-box'

import axios from "axios";
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";

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

            axios.post(url + "/users/get_accounts", {
                username : username
            }).then(res=>{

                // console.log(res.data.accounts[0].account_id);
                var accountsList = [];
                for(var i= 0; i<res.data.accounts.length; i++){
                    accountsList.push(res.data.accounts[i].account_id);
                }
                // console.log(accountsList[1]);
                var result = [];

                for(var j=0; j<accountsList.length; j++){
                    axios.post(url + "/users/transaction_history", {
                        account_id: accountsList[j]
                    }).then(res => {
                        for (var k= 0; k< res.data.transaction_history.length; k++) {
                            result.push(this.getTransactionData(res.data.transaction_history[k]));
                        }
                        // console.log(this.sortDate(result[0].date,result[1].date));
                        
                        // array.sort(function(a,b){
                        //     // Turn your strings into dates, and then subtract them
                        //     // to get a value that is either negative, positive, or zero.
                        //     return new Date(b.date) - new Date(a.date);
                        //   });
                        
                        result.sort(function(a, b) {
                            a = new Date(a.dateModified);
                            b = new Date(b.dateModified);
                            return a>b ? -1 : a<b ? 1 : 0;
                        });

                        // console.log(result.sort());
                        // for(var x = 0; x<result.length; x++){
                        //     console.log(result[x].date, result[x+1].date);
                        // }
                        this.setState({
                            transactionData: result
                        })
                        // console.log(this.state.transactionData);
                    });
                }                
            })
        }, 50);
    };

    // sortDate = (a,b) => {
    //     return a.getTime() - b.getTime();
    // };


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
