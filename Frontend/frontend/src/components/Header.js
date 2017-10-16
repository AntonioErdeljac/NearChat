import React from "react";

class Header extends React.Component{
    render(){
        return(
            <nav className="navbar navbar-dark bg-primary">
                <div className="container">
                    <div className="navbar-brand">
                        NearChat
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;