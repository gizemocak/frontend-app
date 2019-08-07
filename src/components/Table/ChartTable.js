import React, { Component } from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from "axios";
import { createBrowserHistory } from "history";
const history = createBrowserHistory({ forceRefresh: true });
const jwt = require('jsonwebtoken');
const url = "http://178.128.233.31/backend";

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
            jwt.verify(token, "secretkey",  (err, decoded) =>{
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
        return {
            currency: info.currency,
            balance: info.balance,
            balance_cad: info.balance_cad
        };
    };
    render() {
        var data = [];
        var balanceCAD = 0;
        for (var i = 0; i < this.state.tableData.length; i++) {
            data.push(this.state.tableData[i]);
            balanceCAD += this.state.tableData[i].balance_cad;
        }
        data.push({ currency: "Total in CAD", balance: 0, balance_cad: balanceCAD });
        const columns = [{
            accessor: 'currency', // String-based value accessors!
        }, {
            // accessor: 'balance',
            id: 'balance',
            accessor: (data) => {
                return data.balance.toFixed(3);
            },

        }, {
            // accessor: 'balance_cad',
            id: 'balance_cad',
            accessor: (data) => {
                return '$' + data.balance_cad.toFixed(2);
            },
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
