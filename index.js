document.getElementById('playerButton').addEventListener('click', generateForm);
document.getElementById("generateButton").addEventListener("click", generateScheduleAndDisplay);

function calculateVorgabe(player1TTR, player2TTR) {
    const difference = player2TTR - player1TTR; // Korrektur der Berechnung
    const vorgabe = Math.min(Math.round(difference / 70), 7); // Berücksichtigung des Spieler mit niedrigerem TTR-Wert
    return vorgabe;
}

function generateForm() {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    const formDiv = document.getElementById("form");
    formDiv.innerHTML = ""; // Clear previous form
    for (let i = 0; i < numPlayers; i++) {
        const playerDiv = document.createElement("div");
        playerDiv.innerHTML = `
            <label for="player${i + 1}Name">Name des Spielers ${i + 1}:</label>
            <input type="text" id="player${i + 1}Name">
            <label for="player${i + 1}TTR">TTR-Punkte des Spielers ${i + 1}:</label>
            <input type="number" id="player${i + 1}TTR">
        `;
        formDiv.appendChild(playerDiv);
    }
}
function generateSchedule(players) {
    const numPlayers = players.length;
    const schedule = [];
    
    // Erstellen einer Liste von Spielerindizes
    const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);

    // Bestimmen der Anzahl der Runden, die benötigt werden, damit jeder Spieler genau einmal gegen jeden anderen spielt
    const numRounds = numPlayers - 1;
    for (let round = 0; round < numRounds; round++) {
        const roundSchedule = [];
        for (let i = 0; i < numPlayers / 2; i++) {
            const player1Index = playerIndices[i];
            const player2Index = playerIndices[numPlayers - 1 - i];
            if (players[player1Index].name === "Freilos") { // Falls Spieler Freilos hat
                roundSchedule.push({ 
                    player1: "Freilos für " + players[player2Index].name, 
                    player2: "", 
                    vorgabe: undefined // Keine Vorgabe erforderlich
                });
            } else if (players[player2Index].name === "Freilos") { // Falls Spieler Freilos hat
                roundSchedule.push({ 
                    player1: players[player1Index].name, 
                    player2: "Freilos für " + players[player1Index].name, 
                    vorgabe: undefined // Keine Vorgabe erforderlich
                });
            } else {
                const vorgabe = calculateVorgabe(players[player1Index].ttr, players[player2Index].ttr);
                roundSchedule.push({ 
                    player1: players[player1Index].name, 
                    player2: players[player2Index].name, 
                    vorgabe 
                });
            }
        }
        schedule.push(roundSchedule);

        // Rotieren der Spielerindizes, außer dem ersten Spieler
        playerIndices.splice(1, 0, playerIndices.pop());
    }

    return schedule;
}

function generateScheduleAndDisplay() {
    const players = [];
    for (let i = 0; i < parseInt(document.getElementById("numPlayers").value); i++) {
        const name = document.getElementById(`player${i + 1}Name`).value;
        const ttr = parseInt(document.getElementById(`player${i + 1}TTR`).value);
        players.push({ name, ttr });
    }
    if (players.length % 2 !== 0) { // Überprüfung auf ungerade Anzahl von Spielern
        players.push({ name: "Freilos", ttr: -1 }); // Hinzufügen eines Spielerobjekts für das Freilos
    }
    const schedule = generateSchedule(players);
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Spielplan:</h2>";
    schedule.forEach((round, roundIndex) => {
        outputDiv.innerHTML += `<h3>Runde ${roundIndex + 1}</h3>`;
        round.forEach(match => {
            if (match.player1.startsWith("Freilos")) { // Überprüfen, ob Spieler 1 ein Freilos hat
                outputDiv.innerHTML += `<p>${match.player1}</p>`;
            } else if (match.player2.startsWith("Freilos")) { // Überprüfen, ob Spieler 2 ein Freilos hat
                outputDiv.innerHTML += `<p>${match.player2}</p>`;
            } else {
                if(match.vorgabe > 0){
                outputDiv.innerHTML += `<p>${match.player1} vs. ${match.player2} - ${match.vorgabe === undefined ? "" : match.vorgabe + " Punkte Vorgabe für " + match.player1}</p>`;
                } else {
                    outputDiv.innerHTML += `<p>${match.player1} vs. ${match.player2} - ${match.vorgabe === undefined ? "" : Math.abs(match.vorgabe) + " Punkte Vorgabe für " + match.player2}</p>`;
                }
            }
        });
    });
}