import _superagent from "superagent";
import superagentPromise from "superagent-promise";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = '//localhost:8000/api';

const responseBody = res => res.body;

const requests = {
    get: url =>
        superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Profiles = {
    all: () =>
        requests.get(`/profiles`),
    get: username =>
        requests.get(`/profiles/${username}`)
};

const PrivateChat = {
    get: roomName =>
        requests.get(`/privatechat/${roomName}`)
};

const Auth = {
    login: (email, password) =>
        requests.post(`/users/login`, {user: {email, password}}),
    register: (username, email, password) =>
        requests.post(`/users`, {user: {username, email, password}}),
    current: () =>
        requests.get(`/user`)
};

const GlobalChat = {
    all: () =>
        requests.get(`/globalchat`)
};

let token = null;

let tokenPlugin = req => {
    if(token){
        req.set('authorization', `Token ${token}`)
    }
};

export default {
    Profiles,
    Auth,
    GlobalChat,
    PrivateChat,
    setToken: _token => {token = _token}
};