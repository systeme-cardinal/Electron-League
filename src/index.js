
const got = require('got');
const lcu = require('../module/lcu-connector/index');
const request = require("request");

let auth = {
    protocol: '',
    address: '',
    port: '',
    username: '',
    password: ''
};
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


var cache = require("node-cache");
var nodecache = new cache();
module.exports = {
    // my account
    chargeaccount: function () {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.get(`https://127.0.0.1:${auth.port}/lol-summoner/v1/current-summoner`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                        Accept: "application/json",
                    },
                    json: true,
                }).catch(err => reject(err.statusCode))
                .then(summoner =>{
                    resolve({
                        account: summoner.body
                    })
                })
                
            })
        })
    },
    charge_mystatranked: function() {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.get(`https://127.0.0.1:${auth.port}/lol-ranked/v1/current-ranked-stats`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                        Accept: "application/json",
                    },
                    json: true,
                }).catch(err => reject(err.statusCode))
                .then(summoner =>{
                    resolve(summoner.body)
                })
                
            })
        })
    },
    auth: authentification(),
    lobbyv2: function (data) {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.post(`https://127.0.0.1:${auth.port}/lol-lobby/v2/lobby`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                        Accept: "application/json",

                    },
                    body: JSON.stringify(data)
                }).then(resp => resolve(resp.body))
                    .catch(err => reject(err));
            })
        });
    },
    gomatch: function () {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.post(`https://127.0.0.1:${auth.port}/lol-lobby/v2/lobby/matchmaking/search`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                        Accept: "application/json",

                    }
                }).catch(reject).then(resp => resolve(resp.statusCode));
            })
        })
    },
    accept_game: function () {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.post(`https://127.0.0.1:${auth.port}/lol-matchmaking/v1/ready-check/accept`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                        Accept: "application/json",

                    },
                }).then(resp => resolve(resp.body))
                    .catch(err => reject(err));
            })
        });
    },
    decline_game: function () {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.post(`https://127.0.0.1:${auth.port}/lol-matchmaking/v1/ready-check/decline`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                        Accept: "application/json",

                    },
                }).then(resp => resolve(resp.body))
                    .catch(err => reject(err));
            })
        });
    },
    chat_disabled: function () {
        let body = {
            url: `https://127.0.0.1:${auth.port}/lol-chat/v1/me`,
            "rejectUnauthorized": false,
            headers: {
                'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                Accept: "application/json",
            },
            json: {
                "availability": "offline"
            }
        }

        try {
            request.put(body)
        } catch (error) {
            console.error(error)
        }
    },
    summonerId: function (id) {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.get(`https://127.0.0.1:${auth.port}/lol-summoner/v1/summoners/${id}`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                    },
                    json: true,
                    cache: nodecache
                }).then(resp => resolve(resp.body)).catch(reject)
            })
        })
    },
    select_champ_legacy: function (id, championId) {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.patch(`https://127.0.0.1:${auth.port}/lol-champ-select-legacy/v1/session/actions/${id}`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                    },
                    body: JSON.stringify({
                        "championId": championId,
                    })
                }).then(resp => resolve(resp.statusCode)).catch(reject)
            })
        })
    },
    champselec_legacy: function () {
        return new Promise((resolve, reject) => {
            authentification().catch(console.error).then(auth => {
                got.get(`https://127.0.0.1:${auth.port}/lol-champ-select-legacy/v1/session`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                    },
                    json: true
                })
                    .catch(err => {
                        reject(err)
                    })
                    .then(resp => {
                        resolve(resp.body)
                    })
            })
        });
    },
    lock_champ_legacy: function (id) {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.post(`https://127.0.0.1:${auth.port}/lol-champ-select-legacy/v1/session/actions/${id}/complete`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                    },
                    json: true

                }).then(resp => resolve(resp.statusCode)).catch(reject)
            })
        })
    },
    select_champ: function (id, championId) {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.patch(`https://127.0.0.1:${auth.port}/lol-champ-select/v1/session/actions/${id}`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                    },
                    body: JSON.stringify({
                        "championId": championId,
                    })
                }).then(resp => resolve(resp.statusCode)).catch(reject)
            })
        })
    },
    champselect: function () {
        return new Promise((resolve, reject) => {
            authentification().catch(console.error).then(auth => {
                got.get(`https://127.0.0.1:${auth.port}/lol-champ-select/v1/session`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                    },
                    json: true
                })
                    .catch(err => {
                        console.error(err);
                    })
                    .then(resp => {
                        resolve(resp.body)
                    })
            })
        });
    },
    lock_champ: function (id) {
        return new Promise((resolve, reject) => {
            authentification().then(auth => {
                got.post(`https://127.0.0.1:${auth.port}/lol-champ-select/v1/session/actions/${id}/complete`, {
                    rejectUnauthorized: false,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${(Buffer.from(`${auth.username}:${auth.password}`)).toString('base64')}`,
                    },
                    json: true

                }).then(resp => resolve(resp.statusCode)).catch(reject)
            })
        })
    }
}
/**
 * @return {protocol: String, address: String, port: Number, username: String, password: String, wsURL: String}
 */
function authentification() {
    return new Promise((resolve, reject) => {
       lcu.then(resp =>{
           resolve(resp)
       }).catch(reject)
    })

}
