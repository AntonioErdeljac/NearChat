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

        const addMessage = message => {
            this.props.onAddMessage(message);
        };

        this.socket.on('RECEIVE_MESSAGE', function(data){
            console.log('RECEIVED MESSAGE');
            addMessage(data);
        });

        this.state = {
            message: ''
        };

        this.setMessage = ev => this.setState({message: ev.target.value});

        this.sendMessage = ev => {
            console.log('SALJEM PORUKU');
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

    componentWillUnmount(){
        this.socket.disconnect();
        this.socket.emit('disconnect');
        this.props.onUnload()
    }


    render(){
        if(this.props.currentUser && this.props.profile){
            return (
                <div className="container my-3">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <div className="card">
                                <div className="card-title">{this.props.profile}</div>
                                <div className="card-body" id="messages">
                                    {
                                        this.props.messages.map(message => {
                                            return (
                                                <div>
                                                    <p><img src={message.profile.image} height="20" className="rounded-circle" alt="" /><b>{message.author}</b>: {message.message}</p>
                                                </div>
                                            )
                                        })
                                    }
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
        } else if(this.props.currentUser) {
            console.log(this.props);
            return (
                <div className="container my-3">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <div className="card">
                                <div className="card-body" id="messages">
                                    {
                                        (this.props.messages || []).map(message => {
                                            return (
                                                <div>
                                                    <p><img src={message.profile.image} height="20" className="rounded-circle" alt="" /><b>{message.author}</b>: {message.message}</p>
                                                </div>
                                            )
                                        })
                                    }
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
                                    <p>Login or Sign Up to leave a message.</p>
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
        dispatch({type: 'CHAT_PAGE_LOADED', payload}),
    onUnload: () =>
        dispatch({type: 'CHAT_PAGE_UNLOADED'}),
    onAddMessage: message =>
        dispatch({type: 'ADD_MESSAGE', message})
});

const mapStateToProps = state => ({
    profiles: state.common.profiles,
    currentUser: state.common.currentUser,
    messages: state.chat.messages
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);