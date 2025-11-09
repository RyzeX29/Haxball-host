const HaxballJS = require("haxball.js");

HaxballJS.then((HBInit) => {
    const room = HBInit({
        roomName: "🏆Todos juegan - HFCx7",
        maxPlayers: 30,
        public: true,
        noPlayer: true
    });
    
    console.log("✅ Haxball host funcionando!");
    
    room.onPlayerJoin = function(player) {
        console.log("Jugador conectado: " + player.name);
    };
});
