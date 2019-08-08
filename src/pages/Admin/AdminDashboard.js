import React, { Component } from 'react';
import './AdminDashboard.scss'
import { LeftSidebar, TransferModal, DoughnutChart, LineChart, ChartTable, TransactionTable, Footer, Withdraw, Deposit, Transfer, GlobalUpdate } from './../../components';
import PieChartCom from '../../components/HighChart/PieChart';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "LineChartView"
        };
    };

    changeMountainView = () =>{
        this.setState({
            activeTab: "MountainChartView"
        })

    };
    changeLineView = () => {
        this.setState({
            activeTab: "LineChartView"
        })
    };
    render() {
        return (
            <div className="wrapper">
                <div className="sidebarContainer">
                    <LeftSidebar />
                </div>
                <div className="mainPanel">
                    <div className="content">
                        <div className="overview-container">
                            <div className="overview-table"><ChartTable /></div>
                            <div className="overview-graph"><PieChartCom /></div>
                        </div> 
                        <div>
                            <div>
                                <ul className="tabs">
                                    <li class="li-item" id="lineView"><span onClick={this.changeLineView}>LineChartView</span></li>
                                    <li class="li-item"  id="MountainView"><span onClick={this.changeMountainView}>MountainChartView</span></li>
                                </ul>
                            </div>
                            <div>
                                {this.state.activeTab === "LineChartView" ? <div className="graph-container"><LineChart /></div> : null}
                                {this.state.activeTab === "MountainChartView" ? <div className="graph-container">MountainChartView</div> : null}
                            </div>

                        </div>

                        <div className="table-container"><TransactionTable /></div>
                        <div className="withdraw-modal-container"><Withdraw /></div>
                        <div className="deposit-modal-container"><Deposit /></div>
                        <div className="transfer-modal-container"><Transfer/></div>
                        <div className="update-modal-container"><GlobalUpdate/></div>
                    </div>
                    <div className="forFooter"> 
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
