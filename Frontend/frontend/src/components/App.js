import React from "react";
import Header from "./Header";
import Chat from "./Chat/index";

class App extends React.Component{
    render(){
        return (
            <div>
                <Header/>
                {this.props.children}
            </div>
        );
    }
}

export default App;