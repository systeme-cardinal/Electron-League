const cp = require('child_process');
const IS_WIN = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const fs = require("fs-extra");


class LCUConnector {
    constructor() {

    }
    getLCUPathFromProcess() {
        return new Promise((resolve, reject) => {
            const INSTALL_REGEX_WIN = /"--install-directory=(.*?)"/;
            const INSTALL_REGEX_MAC = /--install-directory=(.*?)( --|\n|$)/;
            const INSTALL_REGEX = IS_WIN ? INSTALL_REGEX_WIN : INSTALL_REGEX_MAC;
            const command = IS_WIN ?
                `WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline` :
                `ps x -o args | grep 'LeagueClientUx'`;

            cp.exec(command, (err, stdout, stderr) => {
                if (err || !stdout || stderr) {
                    reject({
                        error: "client not found"
                    });
                    return;
                }

                const parts = stdout.match(INSTALL_REGEX) || [];
                resolve(parts[1]);
            });
        });
    }

    getLCULockFile() {
        return new Promise((resolve, reject) =>{
            this.getLCUPathFromProcess().then(chemin =>{
                var lock = fs.readFileSync(chemin + "lockfile", { encoding: "utf8" });
                var array = lock.split(':');
                return resolve({
                    protocol: array[4],
                    address: "127.0.0.1",
                    port: array[2],
                    username: 'riot',
                    password: array[3],
                    wsURL: 'wss://' + 'riot' + ':' + array[3] + '@' + "127.0.0.1" + ':' + array[2] + "/"
                });
            }).catch(err =>{
                return reject({
                    error: err.error
                })
            })
        })
        
    }
}

module.exports = LCUConnector;