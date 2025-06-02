require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log(`Bot siap sebagai ${client.user.tag}`);

  // Setiap hari jam 12:00 WIB (WIB = UTC+7 → UTC: 05:00)
  cron.schedule('0 5 * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      if (!channel) return console.error('Channel tidak ditemukan.');

      const guild = channel.guild;

      // Cari role bernama "warga"
      const wargaRole = guild.roles.cache.find(role =>
        role.name.toLowerCase().includes('warga')
      );
      const wargaMention = wargaRole ? `<@&${wargaRole.id}>` : '@warga';

      const pengumuman = `
${wargaMention} indoplay tersayang ampe paleto 💖

**Benefit Nitro Booster Discord**

- 1x Boost : Rp.500.000 IC  
- 2x Boost : Porsche 922 GT3  

**Cara Claim Benefit dan Ketentuan**
- Claim Benefit dilakukan di dalam IN GAME.
- Dilarang melepas Boost sebelum 1 bulan.
- Diharuskan melakukan pendaftaran untuk claim benefit booster di ⁠ <#1367369914549145600>.

@everyone
      `;

      await channel.send({
        content: pengumuman,
        allowedMentions: {
          roles: wargaRole ? [wargaRole.id] : [],
          parse: ['everyone'],
          users: []
        }
      });

    } catch (error) {
      console.error('Gagal mengirim pengumuman:', error);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
});

client.login(process.env.TOKEN);
