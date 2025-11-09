// ✅ FUNCIÓN PARA ANUNCIAR DISCORD
function anunciarDiscord(room, getUltimoAnuncio, setUltimoAnuncio) {
  const ahora = Date.now();
  if (ahora - getUltimoAnuncio() < 2 * 60 * 1000) {
    return;
  }
  setUltimoAnuncio(ahora);

  const mensajeCompleto = [
    "🎯 **ÚNETE A NUESTRO DISCORD**",
    "🔍 **NECESITAMOS JUGADORES COMO TU**",
    "🔗 **HAXAMPEONATO CHILENO: https://discord.gg/Gn5RuE8Yz9**",
    "",
    "⚽ **ÚNETE A NUESTRAS OTRAS LIGAS**",
    "",
    "**PFx3 | PREMIER FLASH x3**",
    "🔗 https://discord.gg/B5W3Hudxq3",
    "",
    "**MSAx5 | MIERDATA SERIE A**", 
    "🔗 https://discord.gg/eXPU6hKjEm"
  ].join('\n');

  room.sendChat(mensajeCompleto);
  console.log("📢 Anuncio de Discord enviado");
}

// ✅ OBTENER TODOS LOS COMANDOS
module.exports = {
  getCommands: function(room, getUltimoAnuncio, setUltimoAnuncio, jugadoresInactivos) {
    return {
      // ✅ COMANDO !discord
      "!discord": function(player) {
        anunciarDiscord(room, getUltimoAnuncio, setUltimoAnuncio);
      },

      // ✅ COMANDO !afk
      "!afk": function(player) {
        const datosJugador = jugadoresInactivos.get(player.id);
        if (datosJugador && !datosJugador.afk) {
          datosJugador.afk = true;
          room.setPlayerTeam(player.id, 0);
          room.sendChat(`⏸️ ${player.name} está ahora en modo AFK. ¡Escribe cualquier cosa para volver! 🎮`, player.id);
        }
      },

      // ✅ COMANDO !bot
      "!bot": function(player) {
        room.sendChat("🤖🏆 BOT HFCx7: ¡Estoy aquí para jugar! Usa !discord para unirte a nuestra comunidad", player.id);
      },

      // ✅ COMANDO !help
      "!help": function(player) {
        const ayuda = [
          "🤖🏆 **COMANDOS BOT HFCx7:**",
          "!discord - Únete a nuestra comunidad y otras ligas", 
          "!afk - Ponte modo espectador temporalmente",
          "!help - Muestra esta ayuda"
        ].join('\n');
        room.sendChat(ayuda, player.id);
      },

      // ✅ COMANDO !comandos
      "!comandos": function(player) {
        const ayuda = [
          "🤖🏆 **COMANDOS BOT HFCx7:**",
          "!discord - Únete a nuestra comunidad y otras ligas",
          "!afk - Ponte modo espectador temporalmente", 
          "!help - Muestra esta ayuda"
        ].join('\n');
        room.sendChat(ayuda, player.id);
      }
    };
  },

  // ✅ EXPORTAR FUNCIÓN DE ANUNCIO (CORREGIDO)
  anunciarDiscord: anunciarDiscord
};
