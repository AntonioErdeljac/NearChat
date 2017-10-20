import React from "react";
import agent from "../../agent";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Profiles from "./Profiles";
import io from "socket.io-client";

class Chat extends React.Component{
    constructor(props){
        super(props);

        this.setMessage = ev => this.setState({message: ev.target.value});

        this.state = {
            message: ''
        };

        this.socket = io('localhost:8000');


    }
    componentWillMount(){
        console.log('Component mounted, calling profiles');
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(position => {
                this.props.onSetPosition(position.coords.latitude, position.coords.longitude);
                this.props.onLoad(Promise.all([agent.Profiles.all(position.coords.latitude, position.coords.longitude), agent.GlobalChat.all(), agent.Profiles.near(position.coords.latitude, position.coords.longitude)]))
            })
        }
    }

    componentDidMount(){
        this.socket = io('localhost:8000');

        const addMessage = message => {
            this.props.onAddMessage(message);
        };



        this.socket.on('JOINED_GLOBAL_CHAT', function(data){
            console.log(data, 'JOINED GLOBAL CHAT')
        });

        const locationUpdate = profiles => {
            this.props.onLocationUpdate(profiles)
        };


        this.socket.on('RECEIVE_NEW_USERS', function(data){
            locationUpdate(data.profiles.profiles);
        });

        this.socket.on('RECEIVE_MESSAGE', function(data){

            let typing = document.getElementById('typing');
            typing.innerHTML = '';
            console.log('RECEIVED MESSAGE');
            addMessage(data);
        });

        this.socket.emit('JOIN_GLOBAL_CHAT', {
            id: this.socket.id
        });


        this.socket.on('RECEIVE_TYPING', function(data){
            let typing = document.getElementById('typing');
            typing.innerHTML = `<p class="text-muted"><b>${data.author.username}</b> is typing...</p>`
        });


        this.sendMessage = ev => {

            console.log('SALJEM PORUKU');
            ev.preventDefault();

            this.socket.emit('SEND_MESSAGE', {
                message: this.state.message,
                author: this.props.currentUser.username
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
        if(this.props.currentUser){

            const socketFunction = () => {
                this.socket.emit('RECEIVED_LOCATION_UPDATE_ALL', {
                    user: this.props.currentUser.username
                })
            };
            this.socket.on('RECEIVE_LOCATION_UPDATE', function(){
                socketFunction()
            });

            this.socket.emit('JOIN_USER_ROOM', {
                user: this.props.currentUser.username
            });
            if("geolocation" in navigator){
                navigator.geolocation.watchPosition(position => {
                    this.socket.emit('LOCATION_UPDATE', {
                        user: this.props.currentUser.username,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                });
            }
            return (
                <div className="container my-3">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <div className="card">
                                <div className="card-title">{this.props.profile}</div>
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
                        <div className="col-md-4 col-xs-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title">
                                        Users Near You
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Profiles currentUser={this.props.currentUser} profiles={this.props.nearProfiles}/>
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
                                    <p><Link to="/login">Login</Link> or <Link to="/register">Sign Up</Link> to leave a message.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xs-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title">
                                       Users Near You
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Profiles currentUser={this.props.currentUser} profiles={this.props.profiles}/>
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
        dispatch({type: 'ADD_MESSAGE', message}),
    onLocationUpdate: profiles =>
        dispatch({type: 'LOCATION_UPDATE', profiles}),
    onSetPosition: (lat, lng) =>
        dispatch({type: 'SET_POSITION', payload: agent.User.update({geometry:{type: 'point', coordinates: [lat, lng]}})})
});

const mapStateToProps = state => ({
    profiles: state.common.profiles,
    nearProfiles: state.common.nearProfiles,
    currentUser: state.common.currentUser,
    messages: state.chat.messages
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);