import React from "react";
import agent from "../../agent";
import {connect} from "react-redux";
import Profiles from "./Profiles";

class Chat extends React.Component{
    componentWillMount(){
        this.props.onLoad(agent.Profiles.all())
    }
    render(){
        return (
            <div className="container my-3">
                <div className="row">
                    <div className="col-md-8 col-xs-12">
                        <div className="card">
                            <div className="card-body">

                            </div>
                            <div className="card-footer">
                                <input placeholder="Enter a message" type="text" className="form-control"/>
                                <button className="my-2 btn btn-primary form-control">Send</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-xs-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">
                                    All Users
                                </div>
                            </div>
                            <div className="card-footer">
                                <Profiles profiles={this.props.profiles}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: 'CHAT_PAGE_LOADED', payload})
});

const mapStateToProps = state => ({
    profiles: state.profiles
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);