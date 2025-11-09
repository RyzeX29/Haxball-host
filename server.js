const HaxballJS = require("haxball-headless");

HaxballJS.then((HBInit) => {
    const room = HBInit({
        roomName: "🔥⚽ HFCx7 - TODOS JUEGAN ⚽🔥",
        maxPlayers: 30,
        public: true,
        noPlayer: true
    });
    
    console.log("✅ HOST DE HAXBALL FUNCIONANDO!");
    console.log("🎮 Sala: 🔥⚽ HFCx7 - TODOS JUEGAN ⚽🔥");
    
    room.onPlayerJoin = function(player) {
        console.log("👤 Jugador conectado: " + player.name);
    };
});
