import React from "react";
import Chat from "../Chat";
import {connect} from "react-redux";
import agent from "../../agent";


class Home extends React.Component{
    render(){
        if(this.props.match.params.username){
            console.log(this.props.match);
            return (
                <div className="container">
                    <Chat profile={this.props.match.params.username}/>
                </div>
            )
        }

        console.log(this.props.match, 'MATCH');
        return (
            <div className="container">
                <Chat/>
            </div>
        )
    }
}




export default Home;