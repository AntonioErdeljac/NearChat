import React from "react";
import agent from "../agent";
import {connect} from "react-redux";
import Errors from "./Errors";
import {Redirect} from "react-router-dom";

class Login extends React.Component{
    constructor(props){
        super(props);

        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);
        this.submitForm =(email, password) => ev =>{
            ev.preventDefault();
            this.props.onSubmitForm(email, password);
        }
    }
    render(){
        const {email, password} = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 offset-md-2 col-12">
                        <h1 className="text-center">
                            Login
                        </h1>
                        <Errors errors={this.props.errors}/>
                        <form onSubmit={this.submitForm(email, password)}>
                            <fieldset>
                                <fieldset className="form-group">
                                    <input
                                        onChange={this.changeEmail}
                                        value={email}
                                        placeholder="Email" type="text" className="form-control"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input
                                        onChange={this.changePassword}
                                        value={password}
                                        placeholder="Password" type="text" className="form-control"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <button
                                        type="submit"
                                        disabled={this.props.inProgress}
                                        className="btn btn-primary float-right">
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

const mapDispatchToProps = dispatch => ({
    onChangeEmail: value =>
        dispatch({type: 'UPDATE_FIELD_AUTH', key: 'email', value}),
    onChangePassword: value =>
        dispatch({type: 'UPDATE_FIELD_AUTH', key: 'password', value}),
    onSubmitForm: (email, password) =>
        dispatch({type: 'LOGIN', payload: agent.Auth.login(email, password)})
});

const mapStateToProps = state => ({
    ...state.auth,
    currentUser: state.common.currentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);