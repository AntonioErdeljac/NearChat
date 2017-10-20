import React from "react";
import {Link} from "react-router-dom";

const Profiles = props => {
    if(!props.profiles){
        return (
            <p>Loading...</p>
        )
    }

    if(props.profiles.length === 0){
        return <p className="text-muted">No users near you</p>
    }

    return (
        <div>
            {
                props.profiles.map(profile => {
                    if(props.currentUser){
                        if(profile.profile.username !== props.currentUser.username){
                            return (
                                <Link key={profile.profile.username} to={`/chat/${profile.profile.username}`}>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="card-title">
                                                <img src={profile.profile.image} height="30" className="rounded-circle" alt=""/> <b>{profile.profile.username}</b>
                                            </div>
                                            <div className="card-text">
                                                <div className="text-muted"><b>{Math.round(profile.distance)}m</b> from you</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        }
                    } else {
                        return (
                            <Link key={profile.profile.username} to={`/chat/${profile.profile.username}`}>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-title">
                                            <img src={profile.profile.image} height="30" className="rounded-circle" alt=""/> <b>{profile.username}</b>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                })
            }
        </div>
    )

};

export default Profiles;