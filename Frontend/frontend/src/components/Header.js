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
        </ul>
    );
    }
    return null;
}
const LoggedInView = props => {
    if(props.currentUser){
    return (
        <ul className="nav float-right">
            <li className="">
                <Link to="/login" >
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