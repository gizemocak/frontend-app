import React, { Component } from 'react';
import './Dashboard.scss';

import { LeftSidebar, TransferModal, DoughnutChart, LineChart, ChartTable, TransactionTable, Footer, MountainChart } from './../../components';
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
                                {this.state.activeTab === "LineChartView" ? <div className="graph-container"><LineChart /></div> 
                                : <div className="graph-container"><MountainChart/></div>}
                            </div>

                        </div>

                        <div className="table-container"><TransactionTable /></div>
                        <div className="transfer-modal-container"><TransferModal /></div>
                    </div>
                    <div className="forFooter">
                        <Footer />
                    </div>
                </div>
            </div>
            // <div className="dashboard-container">
            //     <div className="navigation">
            //         <LeftSidebar/>
            //     </div>
            /* <div className="content-wrapper" id="content-div">
                <div className="overview-container">
                    <div className="overview-table"><ChartTable/></div>
                    <div className="overview-graph"><DoughnutChart /></div>
                </div>
                <div className="graph-container"><LineChart /></div>
                <div className="table-container"><TransactionTable /></div>
                <div className="transfer-modal-container"><TransferModal/></div> */
            /* <div className="footer-container"><Footer/></div>
                    </div> */
            // </div>
        );
    }



}

export default Dashboard;
