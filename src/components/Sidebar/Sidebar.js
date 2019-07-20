import React, { Component } from 'react';
import './Sidebar.scss';
import Sidebar, { SidebarStyles } from 'react-sidebar';
import axios from "axios";

const url = "http://165.227.42.25";
const jwt = require('jsonwebtoken');

class LeftSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ref_code: null
          };
    }


    componentDidMount(){
        setTimeout( ()=> {
            let token = localStorage.getItem('userToken');
            // console.log(token);

            const decoded = jwt.decode(token, { complete: true });
            // console.log(decoded.payload.user);
            const userName = decoded.payload.user;

            try {
                axios.get(url + "/frontend/user_data/" + userName).then( res => {
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
    }

    getReferralCode = async e => {
        // e.preventDefault();
        console.log("comeinto method");
        
    };
    render() {
        return (
            <div className="sidebar-container">
                <ul className="sidebar navbar-nav" >
                    <div className="navigation-type">
                        <li className="nav-item">
                            <i className="fa fa-home"></i>
                            <span>Dashboard</span>
                        </li>

                        <li className="nav-item">
                            <i className="fa fa-empire"></i>
                            <span>Affiliates</span>
                        </li>
                        <li className="nav-item">
                            <i className="fa fa-clock-o"></i>
                            <span>Stats</span>
                        </li>

                        <li className="nav-item">
                            <i className="fa fa-line-chart"></i>
                            <span>Exchange</span>
                        </li>
                    </div>
                    <div className="Currency-type"><li className="nav-item">
                        <i className="fa fa-chevron-right"></i>
                        <span>CLAM</span>
                    </li>
                        <li className="nav-item">
                            <i className="fa fa-chevron-right"></i>
                            <span>BTC</span>
                        </li>
                        <li className="nav-item">
                            <i className="fa fa-chevron-right"></i>
                            <span>CAD</span>
                        </li>
                        <li className="nav-item">
                            <i className="fa fa-chevron-right"></i>
                            <span>USD</span>
                        </li>
                        <li className="nav-item">
                            <i className="fa fa-chevron-right"></i>
                            <span>GOLD</span>
                        </li>
                    </div>
                    <div className="other-containt">
                        <li className="nav-item">
                            <i className="fa fa-envelope-square"></i>
                            <span>Contact</span>
                        </li>
                        <li className="nav-item">
                            <i className="fa fa-sign-out"></i>
                            <span>Logout</span>
                        </li>
                        <li className="nav-item">
                            <span>Referral Code: {this.state.ref_code}</span>
                        </li>
                    </div>
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
