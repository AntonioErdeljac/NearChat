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


export default Home;