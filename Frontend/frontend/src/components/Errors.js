import React from "react";

class Errors extends React.Component{
    render(){
        if(this.props.errors){
            return (
                <div className="alert alert-danger">
                    {
                        Object.keys(this.props.errors).map(key => {
                            return (
                                <p key={key}>{key} {this.props.errors[key]}</p>
                            )
                        })
                    }
                </div>
            )
        }
        return null;
    }
}

export default Errors;