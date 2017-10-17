import React from "react";
import Chat from "../Chat";
import {connect} from "react-redux";
import agent from "../../agent";
import io from "socket.io-client";


class Home extends React.Component{
    render(){
        return (
            <div className="container">
                <Chat/>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onLoadMessages: messages =>
        dispatch({type: 'LOAD_MESSAGES', messages})
});


export default connect(null, mapDispatchToProps)(Home);