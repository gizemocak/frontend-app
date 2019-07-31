import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import './Sidebar.scss';
import Sidebar, { SidebarStyles } from 'react-sidebar';
import axios from "axios";
import { createBrowserHistory } from "history";
const url = "http://178.128.233.31";
const jwt = require('jsonwebtoken');
const history = createBrowserHistory({ forceRefresh: true });
class LeftSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ref_code: null,
            currencies: []
        };
    }
    componentDidMount() {
        setTimeout(() => {
            let token = localStorage.getItem('userToken');
            // console.log(token);

            const decoded = jwt.decode(token, { complete: true });
            // console.log(decoded.payload.user);
            const userName = decoded.payload.user;

            try {
                axios.get(url + "/frontend/user_data/" + userName).then(res => {
                    // console.log(res.data.ref_code);
                    const referralCode = res.data.ref_code;
                    this.setState({
                        ref_code: referralCode
                    });
                    // console.log(this.state.ref_code)
                })
            } catch (e) {
                alert(e.message);
            }
        }, 50);

        axios.get(url + "/frontend/all_investments").then(res => {
            // console.log(res.data.investments);
            var result = [];
            for (var i = 0; i < res.data.investments.length; i++) {
                result.push(res.data.investments[i].currency);
            }
            const uniqueResult = Array.from(new Set(result));
            this.setState({
                currencies: uniqueResult
            })
        });
    }
    logout = async e => {
        localStorage.removeItem("userToken");
        history.push("signin");
    }
    render() {
        return (
            <div>
                <ul class="sidebar navbar-nav" >
                    <li id="li_dashboard" class="nav-item">
                        <i className="fa fa-home"></i>
                        <Link to="/dashboard" className="link"><span>Dashboard</span></Link>
                    </li>

                    <li id="li_Affiliates" class="nav-item">
                        <i className="fa fa-empire"></i>
                        <Link to="/affiliates" className="link"><span>Affiliates</span></Link>
                    </li>
                    <li id="li_Stats" class="nav-item">
                        <i className="fa fa-clock-o"></i>
                        <span>Stats</span>
                    </li>
                    <li id="li_Exchange" class="nav-item">
                        <i className="fa fa-line-chart"></i>
                        <span>Exchange</span>
                    </li>

                    {this.state.currencies.map(function(item){
                        return <li  class="nav-item">
                        <i className="fa fa-chevron-right"></i>
                        <span>{item}</span>
                    </li>
                    })}

                    <li id="li_Contact" class="nav-item">
                        <i className="fa fa-envelope-square"></i>
                        <span>Contact</span>
                    </li>
                    <li id="li_Logout" class="nav-item" onClick={this.logout}>
                        <i className="fa fa-sign-out"></i>
                        <span>Logout</span>
                    </li>
                    <li id="li_ReferralCode" class="nav-item">
                        <span>Referral Code: {this.state.ref_code}</span>
                    </li>
                </ul>
            </div>
        );
    }
}

// class LeftSidebar extends Component {
//     render() {
//         const sidebar = <div>Item 1</div>
//         const sidebarStyle = {
//             root: {
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 overflow: "hidden"
//             },
//             sidebar: {
//                 zIndex: 2,
//                 position: "absolute",
//                 top: 0,
//                 bottom: 0,
//                 transition: "transform .3s ease-out",
//                 WebkitTransition: "-webkit-transform .3s ease-out",
//                 willChange: "transform",
//                 overflowY: "auto",
//                 width: '250px'
//             },
//             content: {
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 overflowY: "auto",
//                 WebkitOverflowScrolling: "touch",
//                 transition: "left .3s ease-out, right .3s ease-out"
//             },
//             overlay: {
//                 zIndex: 1,
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 opacity: 0,
//                 visibility: "hidden",
//                 transition: "opacity .3s ease-out, visibility .3s ease-out",
//                 backgroundColor: "rgba(0,0,0,.3)"
//             },
//             dragHandle: {
//                 zIndex: 1,
//                 position: "fixed",
//                 top: 0,
//                 bottom: 0
//             }
//         };
//         return <Sidebar
//             defaultSidebarWidth = {
//                 160
//             }
//             docked = {
//                 true
//             }
//             open = {
//                 true
//             }
//             sidebar = {
//                 sidebar
//             }
//             styles = {
//                 sidebarStyle
//             }
//             onSetOpen = {
//                 (open: boolean) => {}
//             }
//             rootId = "test-root-id"
//             sidebarId = "test-sidebar-id"
//             contentId = "content-div"
//             overlayId = "test-overlay-id" >
//         </Sidebar>
//     }
// }

export default LeftSidebar;
