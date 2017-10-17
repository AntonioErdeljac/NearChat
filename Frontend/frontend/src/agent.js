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
        requests.get(`/profiles`)
};

const Auth = {
    login: (email, password) =>
        requests.post(`/users/login`, {user: {email, password}}),
    current: () =>
        requests.get(`/user`)
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
    setToken: _token => {token = _token}
};