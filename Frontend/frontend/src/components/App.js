import React from "react";
import Header from "./Header";
import Home from "./Home";
import PrivateChat from "./PrivateChat";
import Login from "./Login";
import Register from "./Register";
import Settings from "./Settings";
import {connect} from "react-redux";
import agent from "../agent";
import io from "socket.io-client";
import {Switch, Route, withRouter, Redirect} from "react-router-dom";

class App extends React.Component{

    componentWillReceiveProps(nextProps){
        if(nextProps.redirectTo){
            this.props.history.push(nextProps.redirectTo);
            this.props.onRedirect();
        }
    }

    componentWillMount(){
        const token = window.localStorage.getItem('jwt');

        if(token){
            agent.setToken(token);
        }
        this.props.onLoad(token ? agent.Auth.current() : null, token);
    }

    render(){
        return (
            <div>
                <Header currentUser={this.props.currentUser}/>
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/settings' component={Settings}/>
                    <Route path='/chat/:username' render={(props) => (
                        <PrivateChat {...props} currentUser={this.props.currentUser}/>
                    )}/>
                    <Route exact path='/' component={Home}/>
                </Switch>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
});

const mapDispatchToProps = dispatch => ({
    onLoad: (payload, token) =>
        dispatch({type: 'APP_LOAD', payload, token}),
    onRedirect: () =>
        dispatch({type: 'REDIRECT'})
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));