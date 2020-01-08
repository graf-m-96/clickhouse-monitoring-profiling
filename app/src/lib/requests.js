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

    static remote(options) {
        return axios(`${apiUrl}/remote`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: options
        })
            .then(answer => answer.data);
    }

    static getQueryLogs(options) {
        return axios(`${apiUrl}/query_log`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: options
        })
            .then(answer => answer.data);
    }
}
