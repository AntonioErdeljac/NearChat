import React from "react";
import agent from "../../agent";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Profiles from "./Profiles";
import io from "socket.io-client";

class Chat extends React.Component{
    constructor(props){
        super(props);

        this.socket = io('localhost:8000');

        this.socket.on('RECEIVE_MESSAGE', function(data){
            let messages = document.getElementById('messages');
            messages.innerHTML += `<p><img src=${data.profile.image} height="20" className="rounded-circle" alt=""><b>${data.author}</b>: ${data.message}</p>`;
        });

        this.state = {
            message: ''
        };

        this.setMessage = ev => this.setState({message: ev.target.value});

        this.sendMessage = ev => {
            ev.preventDefault();

            this.socket.emit('SEND_MESSAGE', {
                message: this.state.message,
                author: this.props.currentUser.username
            })
        }
    }
    componentWillMount(){
        this.props.onLoad(agent.Profiles.all())
    }
    render(){
        if(this.props.currentUser){
            return (
                <div className="container my-3">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <div className="card">
                                <div className="card-body" id="messages">

                                </div>
                                <div className="card-footer">
                                    <input
                                        onChange={this.setMessage}
                                        value={this.state.message}
                                        placeholder="Enter a message" type="text" className="form-control"/>
                                    <button onClick={this.sendMessage} className="my-2 btn btn-primary form-control">Send</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xs-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title">
                                        All Users
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Profiles profiles={this.props.profiles}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container my-3">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <div className="card">
                                <div className="card-body" id="messages">

                                </div>
                                <div className="card-footer">
                                    <p className="text-muted">
                                        You need to be <Link to="/login">Logged In</Link> or <Link to="/register">Registered</Link> to chat.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xs-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title">
                                        All Users
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Profiles profiles={this.props.profiles}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: 'CHAT_PAGE_LOADED', payload})
});

const mapStateToProps = state => ({
    profiles: state.common.profiles,
    currentUser: state.common.currentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);