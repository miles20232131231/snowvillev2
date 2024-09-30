const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, values } = interaction;

        if (customId === 'vehicles_banned') {
            const selectedValue = values[0];
            let embed;

            // Different ephemeral "Hi" messages for each option
            if (selectedValue === 'black') {
                embed = new EmbedBuilder()
                    .setDescription(`- Fox Mountain Motors Ranger (Limited)
- 1958 Mayflower Rage Roxanne (Limited)
- 1959 Leland Series 67 Skyview Ecto (Limited)
- 1969 Bullhorn Canaveral Champion (Limited)
- 1981 Wynne Model-12 Futureline (Limited)
- 1987 Maranello Anniversario
- 1987 Maranello Anniversario Competizione (Limited)
- 2003 Swagwagon (Limited)
- 2003 Wolfsburg New Classic Easter Truck (Limited)
- 2005 Falcon Heritage
- 2005 Navara Horizon GT-R Navmo Z-Tune (Limited)
- 2006 Ferdinand Ultima (Limited)
- 2007 Ferdinand Ultima
- 2007 Panini Ostro
- 2007 Stuttgart CT Surrey
- 2007 Stuttgart GT Surrey 722 (Limited)
- 2007 Wolfsburg Pitch W12
- 2013 Maranello Catania
- 2014 Stuttgart-Sport Falke
- 2015 Maranello MM
- 2015 Ramsey 50
- 2016 Surrey LT-500
- 2016 Surrey S-350
- 2018 Bullhorn Buffalo SFP-1750TT (Limited)
- 2018 Celestruck (Limited)
- 2016-2018 Skane Rusa
- 2018 Marlin Motors Swan V8 (Limited)
- 2020 Falcon Heritage
- 2020 Overland Apache SFP HEEN H1000
- 2020 Surrey Speedlet
- 2021 Marlin Motors Bristol
- 2021 Overland Combatant Ghoul 6x6 (Limited)
- 2021 Surrey Grand Tourer
- 2022 Bitsy Classic Easter Truck (Limited)
- 2022 Bullhorn Buffalo K-Wex (Limited)
- 2022 Bullhorn Buffalo HD Lifted (Limited)
- 2022 RELOAD Voltage
- 2023 Skane Rundtur
- 2023 Andre Buddy
- 2023 Barchetta Corsica
- 2023 Bullhorn Determinator 170 (Limited)
- 2023 Celestial Type-1
- 2023 Chevlon Corbeta Manta HEEN
- 2023 Falcon Advance Beast Rawr Taur 6x6 (Limited)
- 2023 Leland LTS V HEEN H1000
- 2023 NVNA Acesera
- 2023 NVN Asport Acesera
- 2023 Surrey Ripon
- 2024 Silhouette Tifon`)
.setColor('#a3c0fd');
            } else if (selectedValue === 'ban') {
                embed = new EmbedBuilder()
                    .setDescription(`- 1986 Silhouette Attraente
- 2002 Navara Horizon GT-R Series-II
- 2007 Maranello Anacapa
- 2008 Bullhorn Python
- 2023 BKM W70
- 2024 BKM e70
- 2024 BKM Series 70
- 2012 Surrey Renaissance
- 2016 BKM Risen
- 2017 Bullhorn SFP Python
- 2017 Navara Horizon
- 2017 Piranha Summit
- 2017 VSV Admiral GTSR W1 (Limited)
- 2019 Chevlon Corbeta
- 2020 BKM Risen Coupé
- 2020 BKM Risen Roadster
- 2020 SirRodgers Constellation
- 2020 SirRodgers Shadow
- 2020 SirRodgers Sunlight
- 2021 BKM Donner M Convertible
- 2021 BKM Donner M Coupé
- 2021 BKM Regen M
- 2021 Marlin Motors London
- 2021 SirRodgers Specter LWB
- 2021 SirRodgers Specter SWB
- 2021 Stuttgart Vierturig
- 2021 Stuttgart Wilhelm Sondergeland
- 2022 Chryslus Consola SFP (Limited)
- 2022 Colin Commander
- 2022 Ferdinand Rapido Coupe
- 2022 Ferdinand Rapido GT3
- 2022 Mauntley National GT
- 2022 Mauntley Windsor
- 2022 Mauntley Windsor EWB
- 2023 BKM Regen M Touring
- 2023 Bullhorn Determinator
- 2023 Brawnson Arlington HEEN H650
- 2023 Chevion Corbeta Manta
- 2023 Chevlon Corbeta Manta Z06
- 2023 Falcon Advance Beast Rawr Baja (Limited)
- 2023 Ferdinand Snapper GT4
- 2023 Ferdinand Vivo
- 2023 Silhouette Rinoceronte (All trims)
- 2023 Ferdinand Vivo CrossWagen
- 2023 Ferdinand Vivo Gran Wagen
- 2023 Simple Atmos Sapphire
- 2023 Stuttgart Munster
- 2024 BKM eMX
- 2023 Stuttgart Wilhelm Munster
- 2024 Chevlon Corbeta Manta E-Ray`)
.setColor('#a3c0fd');
            } else if (selectedValue === 'slot') {
                embed = new EmbedBuilder()
                    .setDescription(`- 1955 Stuttgart Munster
- 1981 Ferdinand Rapido
- 2003 BKM Regen M CSL (Limited)
- 2007 Caline C281
- 2009 Navara Horizon
- 2011 BKM Regen Coupe Beater (Limited)
- 2011 BKM Regen M GTS (Limited)
- 2013 Celestial Type-1
- 2013 VSV Admiral Clubsport R
- 2014 VSV Thunder GTR
- 2015 Bellco SixtySix
- 2015 Idea Twofer Milkjug (Limited)
- 2015 VSV Thunder R Gen-V2
- 2015 Stuttgart Vance 63
- 2016 Piranha Summit (Limited)
- 2017 Ferdinand Rapido
- 2017 Stuttgart Koblenz 63
- 2017 VSV Admiral
- 2018 BKM Regen M
- 2018 Stuttgart Essen 63
- 2018 Stuttgart Essen 63 Coupe
- 2020 BKM Hofmeister M
- 2020 BKM Olympia M
- 2021 Bullhorn Determinator
- 2021 Bullhorn Prancer
- 2021 Bullhorn Pueblo SFP
- 2021 Falcon Stallion
- 2021 Stuttgart Landschaft
- 2021 Stuttgart Sondergeland 63
- 2021 Stuttgart Vaihingen 63
- 2021 Stuttgart Vaihingen 63 Coupe
- 2022 BKM Hofmeister M
- 2022 BKM Munich M
- 2023 Celestial FCT
- 2022 Celestial Type -5
- 2022 Rever EV
- 2022 Stuttgart ES 53
- 2022 Western SYNTH
- 2023 Beam SB7
- 2023 DejaVu Comet
- 2023 Falcon Advance Belico 800 (Limited)
- 2023 Leland LT55 V
- 2023 Simple Atmos
- 2023 The Terrain Traveller LWB
- 2023 The Terrain Traveller SWB
- 2024 Falcon Stallion
- 2023 Falcon Advance Bellco SS
- 2025 DIRECT D3`)
.setColor('#a3c0fd');
            } else if (selectedValue === 'host') {
                embed = new EmbedBuilder()
                    .setDescription(`
- 2010 Eezee GML (Limit: 2 combined with other GML)
- 2010 Eezee GML E (Limit: 2 combined with other GML)
- Western Li Kobold (Limited) (Limit: 1)
- Western Hawk Go-Kart (Limited) (Limit: 7)
- All Falcon Security Vehicles (Limit: 2)
- All limousines (Limit: 1 Limo)
- 2014 LawnKing GSOX (Only to be driven in residential areas)`)
.setColor('#a3c0fd');
            }

            // Send the selected embed
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
