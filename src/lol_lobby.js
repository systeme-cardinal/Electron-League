module.exports = {
    customgame: function (lobbyName, lobbyName, mapId) {
        return {
            "customGameLobby": {
                "configuration": {
                    "gameMode": "CLASSIC",
                    "gameMutator": "",
                    "gameServerRegion": "",
                    "mapId": mapId,
                    "mutators": {
                        "id": 4
                    },
                    "spectatorPolicy": "AllAllowed",
                    "teamSize": 5,
                    "customMutatorName": "GAME_CFG_PICK_RANDOM",
                    "pickType": "AllRandomPickStrategy"
                },
                "lobbyName": lobbyName,
                "lobbyName": lobbyName
            },
            "isCustom": true
        }
    },
    PRACTICE_GAME_fun: function () {
        return {
            "customGameLobby": {
                "configuration": {
                    "gameMode": "PRACTICETOOL",
                    "gameMutator": "",
                    "gameServerRegion": "",
                    "mapId": 11,
                    "mutators": {
                        "id": 4
                    },
                    "spectatorPolicy": "AllAllowed",
                    "teamSize": 5,
                    "customMutatorName": "GAME_CFG_PICK_BLIND",
                    "pickType": "AllRandomPickStrategy"
                },
                "lobbyName": "lobbyName",
                "lobbyName": "lobbyName"
            },
            "isCustom": true
        }
    },
    PRACTICETOOL: function() {
        return {
            "customGameLobby": {
              "configuration": {
                "gameMode": "PRACTICETOOL", "gameMutator": "", "gameServerRegion": "", "mapId": 11, "mutators": {"id": 1}, "spectatorPolicy": "AllAllowed", "teamSize": 5
              },
              "lobbyName": "Name",
              "lobbyPassword": null
            },
            "isCustom": true
          }
    },
    CUSTOM_PERSO: function () {
        return {  
            "customGameLobby":{  
               "configuration":{  
                  "gameMode":"CLASSIC",
                  "gameMutator":"",
                  "gameTypeConfig":{  
                     "id":1
                  },
                  "mapId":11,
                  "teamSize":1
               },
               "lobbyName":"Game"
            },
            "isCustom":true,
            "mapId":11
         }
    },
    // Normal Games
    NORMAL_BLIND: function () {
        return {  
            "customGameLobby":{  
               "configuration":{  
                  "gameMode":"CLASSIC",
                  "gameMutator":"",
                  "gameTypeConfig":{  
                     "id":1
                  },
                  "mapId":11
               },
            },
            "isCustom":false,
            "mapId":11,
            "queueId": 430
         }
    },
    NORMAL_DRAFT: function () {
        return {  
            "customGameLobby":{  
               "configuration":{  
                  "gameMode":"CLASSIC",
                  "gameMutator":"",
                  "gameTypeConfig":{  
                     "id":1
                  },
                  "mapId":11,
                  "teamSize":1
               },
               "lobbyName":"Game"
            },
            "isCustom":false,
            "mapId":11,
            "queueId": 400
         } 
    },
    //Ranked game
    RANKED_FLEX_SR: function () {
        return {  
            "customGameLobby":{  
               "configuration":{  
                  "gameMode":"CLASSIC",
                  "gameMutator":"",
                  "gameTypeConfig":{  
                     "id":1
                  },
                  "mapId":11,
                  "teamSize":1
               },
               "lobbyName":"Game"
            },
            "isCustom":false,
            "mapId":11,
            "queueId": 440
         }
    },
    RANKED_FLEX_Q: function () {
        return {  
            "customGameLobby":{  
               "configuration":{  
                  "gameMode":"CLASSIC",
                  "gameMutator":"",
                  "gameTypeConfig":{  
                     "id":1
                  },
                  "mapId":11,
                  "teamSize":1
               },
               "lobbyName":"Game"
            },
            "isCustom":false,
            "mapId":11,
            "queueId": 440
         }
    },
    RANKED_FLEX_TT: function () {
        return {  
            "customGameLobby":{  
               "configuration":{  
                  "gameMode":"CLASSIC",
                  "gameMutator":"",
                  "gameTypeConfig":{  
                     "id":1
                  },
                  "mapId":10,
                  "teamSize":1
               },
               "lobbyName":"Game"
            },
            "isCustom":false,
            "mapId":10,
            "queueId": 470
         }
    }

}