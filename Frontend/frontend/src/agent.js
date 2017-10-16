import _superagent from "superagent";
import superagentPromise from "superagent-promise";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = '//localhost:3000/api';

const responseBody = res => res.body;

const requests = {
    get: url =>
        superagent.get(`${API_ROOT}${url}`).then(responseBody)
};

const Profiles = {
    all: () =>
        requests.get(`/profiles`)
};

export default {
    Profiles
};