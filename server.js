const HaxballJS = require("haxball.js");

HaxballJS.then((HBInit) => {
    const room = HBInit({
        roomName: "🔥⚽ HFCx7 - TODOS JUEGAN ⚽🔥",
        maxPlayers: 30,
        public: true,
        noPlayer: true
    });
    
    console.log("✅ Haxball host funcionando!");
    
    room.onPlayerJoin = function(player) {
        console.log("Jugador conectado: " + player.name);
    };
});
