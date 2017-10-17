import React from "react";
import {connect} from "react-redux";

class Settings extends React.Component{
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="text-center">
                            Settings
                        </h1>

                        <hr/>

                        <button onClick={this.props.onClickLogout} className="btn btn-danger">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onClickLogout: () =>
        dispatch({type: 'LOGOUT'})
});

export default connect(null, mapDispatchToProps)(Settings);