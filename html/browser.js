const { ipcRenderer } = require('electron');
        ipcRenderer.send("login", "");
        ipcRenderer.on("leagueclient", (event, result) => {
            if (result) {
                alert(result.error);
                window.close();
            }
        });
        ipcRenderer.on("myaccount", (event, result) =>{     
            if (!result) {
                alert("Vous devez être connecté sur le launcher officiel pour utiliser ce launcher");
                window.close();
            } else {
                document.getElementById("summonerName").innerHTML = "<h4 style='color:#fff;text-align: center;'>" + result.account.displayName + '</h4>'
                document.getElementById("icone").innerHTML = `<img src="https://ddragon.leagueoflegends.com/cdn/9.8.1/img/profileicon/${result.account.profileIconId}.png" style="width:150px;    border-radius: 50%;">`
                document.getElementById("level").innerHTML =  `
                <h4 style='color:#fff;
                position: absolute;
                left: 680;
                top: 240;
                box-shadow: 0 3px rgba(0,0,0,.1);
                border-radius: 4px;
                font-size: 18px;
                padding: 5px;'>` + result.account.summonerLevel + '</h4>'
            }
        });
        ipcRenderer.on("rankedtier", (event, result) =>{
            if (!result) return;
            console.log(result);
            var SOLO5V5 = result.queues.find(r => r.queueType === "SOLO5V5");
            document.getElementById("soloq").innerHTML = `
                <div style="font-size:2em;color:#fff;text-align:center">SOLO/DUO</div>
                <img src="../cdn/ranked_remastered/${SOLO5V5.tier}.png" heigt="90px" width="90px" style="margin-left: 45px;">
                <div style="font-size:1.5em;color:#fff;text-align:center">${SOLO5V5.tier + ' ' + SOLO5V5.division}<br />${SOLO5V5.leaguePoints} LP</div>
                <div style="font-size:15px;color:#fff;text-align:center">${SOLO5V5.wins + ' VICTOIRE /' + SOLO5V5.losses + ' DEFAITE'}</div>
            `
            var FLEXTT = result.queues.find(r => r.queueType === "FLEXTT");
            document.getElementById("flex3").innerHTML = `
                <div style="font-size:2em;color:#fff;text-align:center">FLEX3V3</div>
                <img src="../cdn/ranked_remastered/${FLEXTT.tier}.png" heigt="90px" width="90px" style="margin-left: 25px;">
                <div style="font-size:1.5em;color:#fff;text-align:center">${FLEXTT.tier + ' ' + FLEXTT.division}<br />${FLEXTT.leaguePoints} LP</div>
                <div style="font-size:15px;color:#fff;text-align:center">${FLEXTT.wins + ' VICTOIRE /' + FLEXTT.losses + ' DEFAITE'}</div>
            `
            var FLEXSR = result.queues.find(r => r.queueType === "FLEXSR");
            document.getElementById("flex5").innerHTML = `
                <div style="font-size:2em;color:#fff;text-align:center">FLEX5V5</div>
                <img src="../cdn/ranked_remastered/${FLEXSR.tier}.png" heigt="90px" width="90px" style="margin-left: 25px;">
                <div style="font-size:1.5em;color:#fff;text-align:center">${FLEXSR.tier + ' ' + FLEXSR.division}<br />${FLEXSR.leaguePoints} LP</div>
                <div style="font-size:15px;color:#fff;text-align:center">${FLEXSR.wins + ' VICTOIRE /' + FLEXSR.losses + ' DEFAITE'}</div>
            `
        })
        var game = {};
        let test;
        function openTab(evt, tabName) {
            // Declare all variables
            var i, tabcontent, tablinks
            if (tabName == "Home") {
                document.getElementById("selected").style.marginLeft = "0px"
            }
            if (tabName == "Profile") {
                document.getElementById("selected").style.marginLeft = "200px";
                ipcRenderer.send("chargement_profil", "")
            }
            if (tabName == "Play") {
                document.getElementById("selected").style.marginLeft = "100px"
            }
            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent")
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none"
            }
            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tablinks")
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "")
            }
            // Show the current tab, and add an "active" class to the button that opened the tab
            document.getElementById(tabName).style.display = "block"
            evt.currentTarget.className += " active"
        }
        function openTab_play(evt, tabName) {
            // Declare all variables
            var i, tabcontent, tablinks
            // Get all elements with class="tabcontent" and hide them
            tabcontent_play = document.getElementsByClassName("tabcontent_play")
            for (i = 0; i < tabcontent_play.length; i++) {
                tabcontent_play[i].style.display = "none"
            }
            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tablinks_play")
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "")
            }
            // Show the current tab, and add an "active" class to the button that opened the tab
            document.getElementById(tabName).style.display = "block"
            evt.currentTarget.className += " active"
        }
        function SummonersRift(evt) {
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none"
            }
            var tabname = "Matchmaking"
            document.getElementById(tabname).style.display = "block";
            var nommatch = document.getElementById('nommatch');
            if (evt.value === "Blind_sr") {
                nommatch.innerHTML = "Mode Aveugle<br />Summoners Rift";
                nommatch.name = "Blind_sr";
            };
            ipcRenderer.send("createLobby", evt.value);
        };
        function matchmaking(evt) {
            if (!game) {
                alert(`Une erreur s'est produite, merci de relancer le matchmaking`);
            } else {
                ipcRenderer.send("readycheck", game);
                document.getElementById("letsgo").innerHTML = `     
                    <input type="button" value="Jouer" class="btn btn-block" onclick="matchmaking(this.form)" disabled="disabled">
                    <input type="text" name="chronotime" id="chronotime" value="0:00:00:00"/>
                `;
                //chrono()
            }
        }            var game = document.getElementById("nommatch").name;
        ipcRenderer.on('ready_check', function (event, result) {
            var match_trouvé = document.getElementById("match_trouvé");
            var modal = document.getElementsByClassName("modal");
            if (result.data) {
                //On affiche le modal
                match_trouvé.style.display = "block";
                modal.style.display = "block";
                document.getElementById("timer").innerHTML = result.data.timer;
            } else {
                match_trouvé.style.display = "none";
                document.getElementById("timer").innerHTML = "0";
                document.getElementById("bouton_match_accept_decline").innerHTML = `     
                <button type="button" class="btn btn-primary" onclick="acceptgame()">Accepter</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="declinegame()">Refusé</button>
                `;
            }
        });
        function acceptgame() {
            ipcRenderer.send("acceptgame", "");
        }
        function declinegame() {
            ipcRenderer.send("declinegame", "");
        }
        ipcRenderer.on("accept_game", function (event, result) {
            document.getElementById("bouton_match_accept_decline").innerHTML = `     
                <button type="button" class="btn btn-primary" onclick="acceptgame()" disabled="disabled">Accepter</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="declinegame()" disabled="disabled">Refusé</button>
            `;
        })
        ipcRenderer.on("decline_game", function (event, result) {
            document.getElementById("bouton_match_accept_decline").innerHTML = `     
            <button type="button" class="btn btn-primary" onclick="acceptgame()" disabled="disabled">Accepter</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="declinegame()" disabled="disabled">Refusé</button>
                `;
        })
        var startTime = 0
        var start = 0
        var end = 0
        var diff = 0
        var timerID = 0
        window.onload = chronoStart;
        function chrono() {
            end = new Date()
            diff = end - start
            diff = new Date(diff)
            var msec = diff.getMilliseconds()
            var sec = diff.getSeconds()
            var min = diff.getMinutes()
            var hr = diff.getHours() - 1
            if (min < 10) {
                min = "0" + min
            }
            if (sec < 10) {
                sec = "0" + sec
            }
            if (msec < 10) {
                msec = "00" + msec
            }
            else if (msec < 100) {
                msec = "0" + msec
            }
            document.getElementById("chronotime").value = hr + ":" + min + ":" + sec + ":" + msec
            timerID = setTimeout("chrono()", 10)
        }
        function chronoStart() {
            document.chronoForm.startstop.value = "stop!"
            document.chronoForm.startstop.onclick = chronoStop
            document.chronoForm.reset.onclick = chronoReset
            start = new Date()
            chrono()
        }
        function chronoContinue() {
            document.chronoForm.startstop.value = "stop!"
            document.chronoForm.startstop.onclick = chronoStop
            document.chronoForm.reset.onclick = chronoReset
            start = new Date() - diff
            start = new Date(start)
            chrono()
        }
        function chronoReset() {
            document.getElementById("chronotime").value = "0:00:00:000"
            start = new Date()
        }
        function chronoStopReset() {
            document.getElementById("chronotime").value = "0:00:00:000"
            document.chronoForm.startstop.onclick = chronoStart
        }
        function chronoStop() {
            document.chronoForm.startstop.value = "start!"
            document.chronoForm.startstop.onclick = chronoContinue
            document.chronoForm.reset.onclick = chronoStopReset
            clearTimeout(timerID)
        }
        ipcRenderer.on("lobby_get", function (event, result) {
            if (test === JSON.stringify(result)) return;
            if (result) {
                test = JSON.stringify(result); // pour le cache
                var invocateur = result.data.members;
                var html = '';
                for (var i in invocateur) {
                    html += ` 
                    <div class="single-product" id="summoner${i}">
                        <div class="thumb">
                            <img src="http://raw.communitydragon.org/latest/game/assets/ux/summonericons/profileicon${invocateur[i].summonerIconId}.png">
                        </div>
                        <div class="details" name="pseudo">
                            <h4>${invocateur[i].summonerName}</h4>
                        </div>
                    </div>`
                }
                document.getElementById("lobby").innerHTML = html;
            } else {
                return;
            }
        });
        ipcRenderer.on("champ_select", function (event, result) {
            console.log("champselect")
            document.location.href = __dirname + "/champ_select/champ.html"
        })
