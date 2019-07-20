import React, { Component } from 'react';

class SignUpMessage extends Component {

    render() {
        return (
            <div className="signupMessage">
                <div className="modal" id="modal_search">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div class="modal-body">
                                <div class="form-group">
                                    <label>Sign Up Successfully! Please login your email to verify</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUpMessage;
