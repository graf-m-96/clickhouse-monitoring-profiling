import axios from 'axios';

import config from '../../config';

const { apiUrl } = config;

export default class ApiManager {
    static ping(options) {
        return axios(`${apiUrl}/ping`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: options
        })
            .then(answer => answer.data);
    }

    static getClusters(options) {
        return axios(`${apiUrl}/clusters`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: options
        })
            .then(answer => answer.data);
    }

    static pingRemote(options) {
        return axios(`${apiUrl}/ping_remote`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: options
        })
            .then(answer => answer.data);
    }

    static sendQuery(options, query) {
        return axios(`${apiUrl}/query`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: {
                ...options,
                query
            }
        })
            .then(answer => answer.data);
    }
}
