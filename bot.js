const HaxballJS = require("haxball-headless");
const commands = require("./commands");

HaxballJS.then((HBInit) => {
  const room = HBInit({
    roomName: "🔥⚽ HFCx7 - TODOS JUEGAN ⚽🔥",
    maxPlayers: 30,
    public: true,
    noPlayer: false
  });

  console.log("✔️ HOST DE HAXBALL FUNCIONANDO!");
  console.log("📌 Sala: 🔥⚽ HFCx7 - TODOS JUEGAN ⚽🔥");

  let botPlayer = null;
  let ultimoAnuncio = 0;
  let jugadoresInactivos = new Map();

  // ✅ INICIALIZAR COMANDOS
  const comandos = commands.getCommands(room, () => ultimoAnuncio, (valor) => { ultimoAnuncio = valor; }, jugadoresInactivos);

  room.onRoomLink = function(link) {
    console.log("🔗 Enlace de la sala: " + link);
    
    setTimeout(() => {
      try {
        botPlayer = room.connectBot();
        if (botPlayer) {
          room.setPlayerDiscProperties(botPlayer.id, {
            name: "🤖🏆 BOT HFCx7"
          });
          console.log("🤖 BOT conectado a la sala");
        } else {
          console.log("⚠️ No se pudo conectar el bot (sala llena?)");
        }
      } catch (error) {
        console.log("❌ Error conectando bot:", error);
      }
    }, 2000);
  };

  // ✅ BIENVENIDA INMEDIATA
  room.onPlayerJoin = function(player) {
    console.log("📌 Jugador conectado: " + player.name);
    jugadoresInactivos.set(player.id, {
      lastActivity: Date.now(),
      afk: false
    });
    room.sendChat(`¡Hola ${player.name}! 🤝 Bienvenido a HFCx7 - ¡Diviértete jugando con nosotros! ⚽`);
  };

  room.onPlayerLeave = function(player) {
    console.log("❌ Jugador desconectado: " + player.name);
    jugadoresInactivos.delete(player.id);
  };

  // ✅ DETECTAR ACTIVIDAD
  room.onPlayerActivity = function(player) {
    const datosJugador = jugadoresInactivos.get(player.id);
    if (datosJugador) {
      datosJugador.lastActivity = Date.now();
      if (datosJugador.afk) {
        datosJugador.afk = false;
        room.sendChat(`🎉 ¡Bienvenido de vuelta ${player.name}! ⚡ ¿Listo para darlo TODO en el campo? 🔥🏆`, player.id);
      }
    }
  };

  // ✅ SISTEMA DE COMANDOS
  room.onPlayerChat = function(player, message) {
    const comando = message.toLowerCase();
    
    // Registrar actividad
    const datosJugador = jugadoresInactivos.get(player.id);
    if (datosJugador) {
      datosJugador.lastActivity = Date.now();
      if (datosJugador.afk) {
        datosJugador.afk = false;
        room.sendChat(`🎉 ¡Bienvenido de vuelta ${player.name}! ⚡ ¿Listo para darlo TODO en el campo? 🔥🏆`, player.id);
      }
    }

    // Ejecutar comando si existe
    if (comandos[comando]) {
      comandos[comando](player);
    }
  };

  // ✅ EVENTOS DE PARTIDO
  room.onTeamGoal = function(team) {
    console.log("⚽ Gol marcado! Equipo: " + (team === room.Red ? "Rojo" : "Azul"));
    
    const scores = room.getScores();
    if (scores && (scores.red >= room.getScoreLimit() || scores.blue >= room.getScoreLimit())) {
      setTimeout(() => {
        commands.anunciarDiscord(room, () => ultimoAnuncio, (valor) => { ultimoAnuncio = valor; });
      }, 3000);
    }
  };

  room.onGameStop = function() {
    console.log("🛑 Partido terminado");
    setTimeout(() => {
      commands.anunciarDiscord(room, () => ultimoAnuncio, (valor) => { ultimoAnuncio = valor; });
    }, 2000);
  };

  room.onTeamVictory = function(scores) {
    console.log("🏆 Equipo ganador!");
    setTimeout(() => {
      commands.anunciarDiscord(room, () => ultimoAnuncio, (valor) => { ultimoAnuncio = valor; });
    }, 4000);
  };

  // ✅ SISTEMA ANTI-AFK
  setInterval(() => {
    const ahora = Date.now();
    const tiempoInactividad = 3 * 60 * 1000; // 3 minutos
    
    jugadoresInactivos.forEach((datos, playerId) => {
      if (ahora - datos.lastActivity > tiempoInactividad && !datos.afk) {
        const player = room.getPlayer(playerId);
        if (player) {
          console.log(`🚫 Kick por AFK: ${player.name}`);
          room.sendChat(`⏰ ${player.name} fue kickeado por inactividad. ¡Vuelve cuando estés listo! 🔄`);
          room.kickPlayer(playerId, "Inactividad", false);
          jugadoresInactivos.delete(playerId);
        }
      }
    });
  }, 30 * 1000);

  // ✅ ANUNCIOS AUTOMÁTICOS CADA 10 MINUTOS
  setInterval(() => {
    if (room.getPlayerList().length > 0) {
      commands.anunciarDiscord(room, () => ultimoAnuncio, (valor) => { ultimoAnuncio = valor; });
    }
  }, 10 * 60 * 1000);

}).catch(error => {
  console.log("❌ Error al iniciar Haxball:", error);
});
