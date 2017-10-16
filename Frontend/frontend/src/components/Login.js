import React from "react";

class Login extends React.Component{
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 offset-md-2 col-12">
                        <h1 className="text-center">
                            Login
                        </h1>
                        <form action="">
                            <fieldset>
                                <fieldset className="form-group">
                                    <input placeholder="Email" type="text" className="form-control"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input placeholder="Password" type="text" className="form-control"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <button className="btn btn-primary float-right">
                                        Submit
                                    </button>
                                </fieldset>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;