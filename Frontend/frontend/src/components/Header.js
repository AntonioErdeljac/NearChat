import React from "react";
import {Link} from "react-router-dom";

class Header extends React.Component{
    render(){
        return(
            <nav className="navbar mb-3 navbar-light bg-light">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        NearChat
                    </Link>
                    <ul className="nav float-right">
                        <li className="">
                            <Link to="/login" >
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Header;