import React from "react";
import agent from "../agent";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import Profiles from "./Chat/Profiles";
import io from "socket.io-client";

class PrivateChat extends React.Component{
    constructor(props){
        super(props);

        this.setMessage = ev => this.setState({message: ev.target.value});

        this.state = {
            message: ''
        };


    }
    componentWillMount(){
        console.log(this.props.currentUser, ' CURRENTUSER');
        this.props.onLoad(agent.Profiles.get(this.props.match.params.username));
        this.props.onLoadMessages();
    }

    componentDidMount(){
        this.socket = io('localhost:8000');

        const addMessage = message => {
            this.props.onAddMessage(message);
        };

        this.socket.on('RECEIVE_PRIVATE_MESSAGE', function(data){
            console.log('DOBIO SAM PORUKU', data);
            let typing = document.getElementById('typing');
            typing.innerHTML = '';
            addMessage(data);
        });


        this.socket.on('RECEIVE_TYPING', function(data){
            let typing = document.getElementById('typing');
            typing.innerHTML = `<p class="text-muted"><b>${data.author.username}</b> is typing...</p>`
        });


        this.sendMessage = ev => {

            ev.preventDefault();

            this.setState({message: ''});

            this.socket.emit('SEND_PRIVATE_MESSAGE', {
                message: this.state.message,
                author: this.props.currentUser.username,
                receiver: this.props.match.params.username,
                yourRoom: this.props.currentUser.username +'_and_'+this.props.match.params.username,
                guestRoom: this.props.match.params.username+'_and_'+this.props.currentUser.username
            })
        };


        this.isTyping = ev => {
            this.socket.emit('SEND_TYPING', {
                author: this.props.currentUser.username
            });
        }
    }

    componentWillUnmount(){
        this.socket.disconnect();
        this.socket.emit('disconnect');
        this.props.onUnload()
    }

    render(){
        if(this.props.profile && this.props.currentUser){
            console.log(this.props.chatLoaded, 'IS CHAT LOADED?');
            if(!this.props.chatLoaded){
                this.socket.emit('JOIN_PRIVATE_CHAT', {
                    yourRoom: this.props.currentUser.username +'_and_'+this.props.match.params.username,
                    guestRoom: this.props.match.params.username+'_and_'+this.props.currentUser.username
                });
                this.props.onLoadMessages(agent.PrivateChat.get(this.props.currentUser.username+'_and_'+this.props.match.params.username));

            }
            return (
                <div className="container my-3">
                    <div className="row">
                        <div className="col col-xs-12">
                            <div className="card">
                                <div className="card-header"><h4>Private Chat with <b>{this.props.profile.username}</b></h4></div>
                                <div className="card-body" id="messages"  style={{overflow: 'scroll', height: '400px', overflowX: 'hidden'}}>
                                    {
                                        (this.props.messages || []).map((message, key) => {
                                            return (
                                                <div key={key}>
                                                    <p><img src={message.author.image} height="20" className="rounded-circle" alt="" /><b>{message.author.username}</b>: {message.message}</p>
                                                </div>
                                            )
                                        })
                                    }
                                    <div id="typing"></div>
                                </div>
                                <div className="card-footer">
                                    <input
                                        onChange={this.setMessage}
                                        value={this.state.message}
                                        onKeyPress={this.isTyping}
                                        placeholder="Enter a message" type="text" className="form-control"/>
                                    <button onClick={this.sendMessage} className="my-2 btn btn-primary form-control">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: 'PRIVATE_CHAT_PAGE_LOADED', payload}),
    onLoadMessages: payload =>
        dispatch({type: 'PRIVATE_CHAT_MESSAGES_LOADED', payload}),
    onUnload: () =>
        dispatch({type: 'CHAT_PAGE_UNLOADED'}),
    onAddMessage: message =>
        dispatch({type: 'ADD_PRIVATE_MESSAGE', message})
});

const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
    messages: state.chat.privateMessages,
    profile: state.chat.profile,
    chatLoaded: state.chat.chatLoaded
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateChat);