import React from "react";
import {Link} from "react-router-dom";

const LoggedOutView = props => {
    if(!props.currentUser){
    return (
        <ul className="nav float-right">
            <li className="">
                <Link to="/login" >
                    Login
                </Link>
            </li>
            <li className="mx-3">
                <Link to="/register" >
                    Register
                </Link>
            </li>
        </ul>
    );
    }
    return null;
};


const LoggedInView = props => {
    if(props.currentUser){
    return (
        <ul className="nav float-right">
            <li className="mx-3">
                <Link to="/settings" >
                    Settings
                </Link>
            </li>
            <li className="">
                <Link to={`@${props.currentUser.username}`} >
                    <img src={props.currentUser.image} className="rounded-circle mx-1" height="20" alt=""/>
                    {props.currentUser.username}
                </Link>
            </li>
        </ul>
    );
    }
    return null;
};

class Header extends React.Component{
    render(){
        return(
            <nav className="navbar mb-3 navbar-light bg-light">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        NearChat
                    </Link>
                    <LoggedOutView currentUser={this.props.currentUser}/>
                    <LoggedInView currentUser={this.props.currentUser}/>
                </div>
            </nav>
        );
    }
}

export default Header;