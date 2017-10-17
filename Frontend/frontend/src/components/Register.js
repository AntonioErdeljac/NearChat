import React from "react";
import {connect} from "react-redux";
import agent from "../agent";
import Errors from "./Errors";

class Register extends React.Component{
    constructor(props){
        super(props);

        this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);

        this.submitForm = (username, email, password) => ev => {
            ev.preventDefault();

            this.props.onSubmitForm(username, email, password);
        }
    }
    render(){
        const {username, email, password} = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col">

                        <h1 className="text-center">
                            Register
                        </h1>

                        <Errors errors={this.props.errors}/>

                        <form onSubmit={this.submitForm(username, email, password)}>
                            <fieldset>
                                <fieldset className="form-group">
                                    <input type="text"
                                           onChange={this.changeUsername}
                                           value={username}
                                           placeholder="Username"
                                           className="form-control"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input type="text"
                                           onChange={this.changeEmail}
                                           value={email}
                                           placeholder="Email"
                                           className="form-control"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input type="password"
                                           onChange={this.changePassword}
                                           value={password}
                                           placeholder="Password"
                                           className="form-control"/>
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
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onChangeUsername: value =>
        dispatch({type: 'UPDATE_FIELD_AUTH', key: 'username', value}),
    onChangeEmail: value =>
        dispatch({type: 'UPDATE_FIELD_AUTH', key: 'email', value}),
    onChangePassword: value =>
        dispatch({type: 'UPDATE_FIELD_AUTH', key: 'password', value}),
    onSubmitForm: (username, email, password) =>
        dispatch({type: 'REGISTER', payload: agent.Auth.register(username, email, password)})
});

const mapStateToProps = state => ({
    ...state.auth
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);