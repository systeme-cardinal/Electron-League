const electron = require('electron');
const src = require('./src/index');
const lobby = require('./src/lol_lobby');
const lcu = require('./module/lcu-connector/index');

const app = electron.app;
const ipcMain = electron.ipcMain;
let mainWindow;

// Déclaration des fonctions
function initialize() {
    if (!mainWindow) mainWindow = createMainWindow();
}
function onclosed() {
    // dereference the window
    // for multiple windows store them in an array
    mainWindow = null;
}

function createMainWindow() {
    const fenetre = new electron.BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        frame: true, // a disabled
        darkTheme: true,
        resizable: false,
        movable: true,
    });

    ipcMain.on('async', (event, arg) => {
        event.sender.send('async-reply', 2);
    })
    fenetre.loadURL(`file://${__dirname}/html/index.html`);
    fenetre.on('close', onclosed);

}


app.commandLine.appendSwitch('--ignore-certificate-errors');

app.on('ready', () => {
    initialize();

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain
    .on('login', (event, arg) => {
        authentification()
        .catch(err => {
            event.sender.send("leagueclient", err);
        }).then(data => {
            src.chargeaccount().catch(err => {
                if (err) event.sender.send("myaccount", null);
            })
        })
    })
    .on('chargement_profil', (event, arg) => {
        src.chargeaccount().then(async resp => {
            try {
                var myranked = await src.charge_mystatranked();
                event.sender.send('myaccount', (resp));
                event.sender.send('rankedtier', myranked)
                
            } catch (error) {
                console.error(error)
                event.sender.send('myaccount', (resp));
                event.sender.send('rankedtier', null)
            }
        })
    })
    .on("createLobby", (event, arg) => {
        switch (arg) {
            case "Blind_sr":
                src.lobbyv2(lobby.NORMAL_BLIND()).then(resp => {
                    event.sender.send("lobby", (resp));
                }).catch(err => {
                    console.error(err);
                    event.sender.send("lobby", JSON.stringify({
                        error: "401"
                    }));
                })
                break;
            case "Draft_sr":
                src.lobbyv2(lobby.NORMAL_DRAFT()).then(resp => {
                    event.sender.send("lobby", (resp));
                }).catch(err => {
                    console.error(err);
                    event.sender.send("lobby", JSON.stringify({
                        error: "401"
                    }));
                })
                break;
            case "SoloQ_sr":
                src.lobbyv2(lobby.RANKED_FLEX_Q()).then(resp => {
                    event.sender.send("lobby", (resp));
                }).catch(err => {

                    event.sender.send("lobby", JSON.stringify({
                        error: "401"
                    }));
                })
                break;
            case "Flex_sr":
                src.lobbyv2(lobby.RANKED_FLEX_SR()).then(resp => {
                    event.sender.send("lobby", (resp));
                }).catch(err => {
                    event.sender.send("lobby", JSON.stringify({
                        error: "401"
                    }));
                })

                break;
            default:
                event.sender.send("lobby", JSON.stringify({
                    error: "401"
                }));
        }
    })
    .on("readycheck", (event, arg) => {
        src.gomatch().catch(console.error)
    })
    .on("acceptgame", (event, arg) => {
        src.accept_game().then(resp => {
            event.sender.send("accept_game", (resp))
        }).catch(resp => {
            event.sender.send("accept_game", (resp))
        })
    })
    .on("declinegame", (event, arg) => {
        src.decline_game().then(resp => {
            event.sender.send("decline_game", (resp))
        }).catch(resp => {
            event.sender.send("decline_game", (resp))
        })
    })
    .on("websocket", (event) => {
        authentification().then(riot => {
            const WSS = require('ws');
            let ws = new WSS(riot.wsURL, { rejectUnauthorized: false }, {
                origin: "https://127.0.0.1:" + riot.port,
                Host: "127.0.0.1:" + riot.port
            });

            ws.on('error', (err) => {
                console.log("err" + err.message);
            });
            ws.on('open', () => {
                ws.send('[5, "OnJsonApiEvent"]');
            });
            ws.on('message', (_msg) => {
                if (_msg) {
                    try {
                        var msg = JSON.parse(_msg);
                        msg = msg[2];
                        if (msg.uri === "/lol-matchmaking/v1/ready-check") { event.sender.send("ready_check", (msg)); }
                        else if (msg.uri === "/lol-lobby/v2/comms/members") { event.sender.send("comms_members", (msg)); }
                        else if (msg.uri === "/lol-lobby/v2/lobby") { event.sender.send("lobby_get", (msg)); }
                        else if (msg.uri.indexOf("lol-chat") !== -1) {
                            return;
                        } else if (msg.uri.indexOf("lol-clash") !== -1) {
                            return;
                        } else if ((msg.uri === "/lol-champ-select-legacy/v1/implementation-active")
                            || msg.uri === "/lol-lobby-team-builder/champ-select/v1/session"
                        ) { event.sender.send("champ_select", true) }
                        else if (msg.uri === "/lol-champ-select/v1/session") {
                            event.sender.send("champ_select", true)
                            if (msg.eventType === "Create") return event.sender.send("champselect_create", msg);
                            if (msg.eventType === 'Update') return event.sender.send("champselect_update", msg);
                            if (msg.eventType === 'Delete') return event.sender.send("champselect_delete", msg);
                            console.log("SHIT YOU ARE FUCKING USELESS")
                        } else if ((msg.uri === "/lol-champ-select-legacy/v1/pickable-champions") || (msg.uri === "/lol-champ-select/v1/pickable-champions")) {
                            try {
                                setTimeout(() => {
                                    event.sender.send("pickable_champions", (msg))
                                }, 2000)
                            } catch (error) {
                                console.error(error)
                            }
                        } else if (msg.uri === "/lol-matchmaking/v1/ready-check") {
                            event.sender.send("ready_check", (msg))
                        };


                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        }).catch(console.error)
    }).on("champselect", (event) => {
        src.champselect().catch(console.error).then(msg => event.sender.send("champselect_update", msg))
    }).on("summonerId", (event, arg) => src.summonerId(arg).catch(err => event.sender.send("summoner_info", undefined)).then(resp => event.sender.send("summoner_info", resp)))
    .on("pick_select", (event, arg) => src.pick_champ(arg).catch(err => event.sender.send("picked", false)).then(resp => event.send.sender("picked", true)))
    .on("lock_champ_legacy", async (event, arg) => {
        // Peux être une perso crée 
        src.champselec_legacy().then(async testStart => {
            var i = 0;
            var id_pick = testStart["actions"][0].find(valeur => valeur.championId === 0);
            var lock = await src.select_champ_legacy(id_pick.id, arg).catch(err => {
                console.error(error2);
                return event.sender.send("locked", false);
            })
            src.lock_champ_legacy(id_pick.id).then(resp => {
                return event.sender.send("locked", true)
            }).catch(err => {
                console.error(error2);
                return event.sender.send("locked", false);
            })
        }).catch(err => {
            console.error(error2);
            return event.sender.send("locked", false);
        })
        //Peux etre une normal
        src.champselect().then(async testStart => {
            var i = 0;
            var id_pick = testStart["actions"][0].find(valeur => valeur.championId === 0);
            var lock = await src.select_champ(id_pick.id, arg).catch(err => {
                console.error(err);
                return event.sender.send("locked", false);
            })
            src.lock_champ(id_pick.id).then(resp => {
                return event.sender.send("locked", true)
            }).catch(err => {
                console.error(error2);
                return event.sender.send("locked", false);
            })
        }).catch(err => {
            console.error(error2);
            return event.sender.send("locked", false);
        })

    })

function authentification() {
    return new Promise((resolve, reject) => {
       lcu.then(resp =>{
           resolve(resp)
       }).catch(reject)
    })

}





process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error)