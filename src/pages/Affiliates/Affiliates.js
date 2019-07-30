import React, { Component } from 'react';
// import './Dashboard.scss';

import { LeftSidebar, Footer,InviteFriend} from './../../components';

class Affiliates extends Component {

    render() {
        return (
            <div className="wrapper">
                <div className="sidebarContainer">
                    <LeftSidebar />
                </div>
                <div className="mainPanel">
                    <div className="content">
                        <InviteFriend />
                    </div>
                    <div className="forFooter">
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }



}

export default Affiliates;
