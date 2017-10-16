import React from "react";

const Profiles = props => {
    if(props.profiles){
        return (
            <div>
                {
                    props.profiles.map(profile => {
                        return (
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title">
                                        <img src={profile.image} height="30" className="rounded-circle" alt=""/> <b>{profile.username}</b>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    return null;
};

export default Profiles;