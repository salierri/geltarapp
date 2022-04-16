const config = require('config');
const mongoose = require('mongoose');

const categories = [
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12"), "name" : "Combat", "role" : "music", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff13"), "name" : "Travel", "role" : "music", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14"), "name" : "Natural ambience", "role" : "ambience", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15"), "name" : "Urban setup", "role" : "music", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff16"), "name" : "Urban ambience", "role" : "ambience", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff17"), "name" : "Tavern", "role" : "music", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff18"), "name" : "Tavern brawl", "role" : "music", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff19"), "name" : "Pirate", "role" : "music", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1a"), "name" : "Sad", "role" : "music", "template" : true },
  { "_id" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1b"), "name" : "Misc", "role" : "music", "template" : true },
];

const presets = [
  { "_id" : new mongoose.Types.ObjectId("625ae31e88f2174117e5ff32"), "name" : "Generic battle", "url" : "4szfmKTFoXA", "title" : "D&D Battle Music 2", "length" : 4001, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae3b988f2174117e5ff59"), "name" : "Great fight", "url" : "PWM54LRIstI", "title" : "Avatar Soundtrack. 13- War (Full Version)", "length" : 682, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae3cc88f2174117e5ff74"), "name" : "Shorter combat", "url" : "kZVZ8_zCz5s", "title" : "Heroes 3 music - Battle 2", "length" : 161, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae3d588f2174117e5ff81"), "name" : "Shorter combat 2", "url" : "kjvtQXsqvWY", "title" : "Heroes 3 music - Battle 3", "length" : 144, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae3dd88f2174117e5ff8e"), "name" : "Bandit fight (vocal)", "url" : "VCAnW11ZmwM", "title" : "The Witcher 3 Wild Hunt OST -Steel For Humans HQ Extended Lyrics", "length" : 346, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae3e588f2174117e5ff9b"), "name" : "Monster fight (vocal)", "url" : "LDnENTDuAiI", "title" : "The Witcher 3- Wild Hunt OST - Silver For Monsters [HQ] [Extended]", "length" : 333, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae3ee88f2174117e5ffa8"), "name" : "Epic boss fight", "url" : "3VokRpoy08I", "title" : "Shadow of the Colossus All Epic Battle Theme Songs Original OST", "length" : 1522, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae3f788f2174117e5ffb5"), "name" : "Boss fight 2", "url" : "ocUEDfuw5eQ", "title" : "Dark Souls 3: All Boss Themes - Complete OST", "length" : 3625, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff12") },
  { "_id" : new mongoose.Types.ObjectId("625ae40488f2174117e5ffc2"), "name" : "Generic D&D travel", "url" : "A8qMyBWZNw0", "title" : "RPG Playlist - Peaceful/Travel Music", "length" : 3477, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff13") },
  { "_id" : new mongoose.Types.ObjectId("625ae40f88f2174117e5ffcf"), "name" : "Celtic mix (great for taiga)", "url" : "dyB-L89i5LY", "title" : "A Celtic Tale: The Legend of Deirdre (Full Album) | Mychael Danna & Jeff Danna", "length" : 2641, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff13") },
  { "_id" : new mongoose.Types.ObjectId("625ae41788f2174117e5ffdc"), "name" : "Forest hiking", "url" : "pdQufNiwExY", "title" : "Two hours in the Forest, Celtic fantasy folk music.", "length" : 7253, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff13") },
  { "_id" : new mongoose.Types.ObjectId("625ae42088f2174117e5ffe9"), "name" : "Chill valleys", "url" : "MnYnXwx9OfI", "title" : "The Elder Scrolls IV: Oblivion - 02 - Through the Valleys", "length" : 260, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff13") },
  { "_id" : new mongoose.Types.ObjectId("625ae42988f2174117e5fff6"), "name" : "Chill roads", "url" : "1_MTj22Q0qc", "title" : "Elder Scrolls V - Skyrim: Dragonborn DLC OST - The Road Most Traveled", "length" : 196, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff13") },
  { "_id" : new mongoose.Types.ObjectId("625ae43d88f2174117e60003"), "name" : "Happy forest", "url" : "xNN7iTA57jM", "title" : "Forest Sounds | Woodland Ambience, Bird Song | 3 Hours", "length" : 10800, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae44688f2174117e60010"), "name" : "Scary forest", "url" : "Z6ylGHfLrdI", "title" : "Dark Ambience - Horror Background Music 10 Hours", "length" : 36000, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae44e88f2174117e6001d"), "name" : "Campfire", "url" : "qsOUv9EzKsg", "title" : "Campfire & River Night Ambience 10 Hours | Nature White Noise for Sleep, Studying or Relaxation", "length" : 36000, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae45888f2174117e6002a"), "name" : "Sailing", "url" : "beOw8MEojQ4", "title" : "Sailing Ship | High Seas Ambience | 1 Hour", "length" : 3601, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae45f88f2174117e60037"), "name" : "Strong winds", "url" : "XrKfcgb519Y", "title" : "Snowstorm Blizzard Wind Sounds for Sleeping & Relaxing | Blizzard Sounds for Sleeping 10 Hours", "length" : 36094, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae46788f2174117e60044"), "name" : "Generic dungeon", "url" : "wScEFaoqwPM", "title" : "D&D Ambience - Generic Dungeon", "length" : 10811, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae47788f2174117e60051"), "name" : "Dark cave", "url" : "E72yDpAfrgY", "title" : "D&D Ambience -  Dark, Dank Cave", "length" : 10800, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae47f88f2174117e6005e"), "name" : "Underwater", "url" : "NY3XkLe6oKQ", "title" : "D&D Ambience - Underwater", "length" : 10811, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae48b88f2174117e6006b"), "name" : "Battle aftermath", "url" : "J7ozm2RYTzw", "title" : "Battle Aftermath - RPG Ambience", "length" : 1200, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff14") },
  { "_id" : new mongoose.Types.ObjectId("625ae49988f2174117e60078"), "name" : "Happy village", "url" : "_YQpacAuhX8", "title" : "Medieval Folk Music - Camelot", "length" : 260, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae4a388f2174117e60085"), "name" : "Medieval city", "url" : "ue-ER61uE_o", "title" : "The Witcher 3: Wild Hunt OST - Merchants of Novigrad", "length" : 191, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae4ad88f2174117e60092"), "name" : "Military style city", "url" : "ezPBaFIYVtI", "title" : "Syberia Soundtrack 4: Komkolzgrad", "length" : 196, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae52888f2174117e6009f"), "name" : "Church mix", "url" : "5cbDTcV1lSw", "title" : "Cathedral Ambient Music | Sleep, Meditation, Relaxation", "length" : 28809, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae53b88f2174117e600ac"), "name" : "Graveyard", "url" : "9lQTbRY2xWY", "title" : "Heroes of Might and Magic III: Necropolis theme by Paul Romero", "length" : 153, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae54488f2174117e600b9"), "name" : "Library", "url" : "dVfOQj7-3vQ", "title" : "Library Theme / Tome of Knowledge - The Binding of Isaac: Rebirth OST Extended", "length" : 901, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae54c88f2174117e600c6"), "name" : "Magical city", "url" : "exI1X6cfh6A", "title" : "Dalaran General Music", "length" : 598, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae55488f2174117e600d3"), "name" : "Farm village", "url" : "kNiOnMMxak0", "title" : "The Witcher 3 - White Orchard (1 Hour of Music)", "length" : 3650, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff15") },
  { "_id" : new mongoose.Types.ObjectId("625ae56488f2174117e600e0"), "name" : "Busy city", "url" : "_52K0E_gNY0", "title" : "Medieval City | Realistic Ambience | 1 Hour #dnd", "length" : 3601, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff16") },
  { "_id" : new mongoose.Types.ObjectId("625ae58188f2174117e600ed"), "name" : "Harbor", "url" : "frEJTGfLOhM", "title" : "Harbor Sounds | Seaside Market Ambience | 1 Hour", "length" : 3600, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff16") },
  { "_id" : new mongoose.Types.ObjectId("625ae59788f2174117e600fa"), "name" : "Crowded tavern", "url" : "EULoybB2Nsw", "title" : "D&D Ambience - Crowded Local Tavern", "length" : 10811, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff16") },
  { "_id" : new mongoose.Types.ObjectId("625ae5a288f2174117e60107"), "name" : "Evening town", "url" : "bSbYpFMNxLI", "title" : "D&D Ambience - Evening Town", "length" : 10811, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff16") },
  { "_id" : new mongoose.Types.ObjectId("625ae5ab88f2174117e60114"), "name" : "Winter village", "url" : "HkIzMuvIhNQ", "title" : "D&D Ambience - Snow Village", "length" : 10811, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff16") },
  { "_id" : new mongoose.Types.ObjectId("625ae5b988f2174117e60121"), "name" : "Enter the tavern", "url" : "jhlncTqYdZ4", "title" : "Medieval Music Instrumental - Blacksmith's Forge", "length" : 208, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff17") },
  { "_id" : new mongoose.Types.ObjectId("625ae5c488f2174117e6012e"), "name" : "Generic tavern 2", "url" : "UtI-uf-VXG0", "title" : "Medieval Music - The Innkeeper", "length" : 208, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff17") },
  { "_id" : new mongoose.Types.ObjectId("625ae5cc88f2174117e6013b"), "name" : "Chill tavern", "url" : "o3MTKqEX_Bo", "title" : "The Witcher 3: Blood and Wine - The Musty Scent of Fresh Pâté Extended", "length" : 628, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff17") },
  { "_id" : new mongoose.Types.ObjectId("625ae5d888f2174117e60148"), "name" : "Longer tavern stay", "url" : "dd10InDdvJE", "title" : "Skyrim - Music & Ambience - Taverns", "length" : 3600, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff17") },
  { "_id" : new mongoose.Types.ObjectId("625ae5e588f2174117e60155"), "name" : "The air is getting tense", "url" : "vMxo_3oHULE", "title" : "The Witcher 3: Wild Hunt - Drink Up, There's More! Extended", "length" : 330, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff18") },
  { "_id" : new mongoose.Types.ObjectId("625ae5f788f2174117e60162"), "name" : "The brawl starts!", "url" : "NYtPB459e6Y", "title" : "Tavern Brawl Music", "length" : 659, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff18") },
  { "_id" : new mongoose.Types.ObjectId("625ae60888f2174117e6016f"), "name" : "Longer combat loop", "url" : "UY6JduQlMRQ", "title" : "Assassins Creed 3 Soundtrack / OST: Fight Club for 10 minutes", "length" : 606, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff18") },
  { "_id" : new mongoose.Types.ObjectId("625ae62388f2174117e6017c"), "name" : "Enter the pirates' realm (happy)", "url" : "7BRLCmWqpUo", "title" : "Pirate Accordion Music - Swashbuckling Pirates", "length" : 207, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff19") },
  { "_id" : new mongoose.Types.ObjectId("625ae6b788f2174117e60189"), "name" : "Pirate tavern", "url" : "0jg4lZty0s4", "title" : "Two Hornpipes (purchased by Disney Studios for Pirates of the Ca)", "length" : 173, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff19") },
  { "_id" : new mongoose.Types.ObjectId("625ae6c388f2174117e60196"), "name" : "Pirate tavern 2", "url" : "esd3EcxQho4", "title" : "Pirate Tavern Music", "length" : 453, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff19") },
  { "_id" : new mongoose.Types.ObjectId("625ae6cc88f2174117e601a3"), "name" : "Long pirate mix", "url" : "uCfu_Yh77D4", "title" : "Epic Pirate Music & Pirate Accordion Music -  Pirates & Plunder", "length" : 5011, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff19") },
  { "_id" : new mongoose.Types.ObjectId("625ae6d588f2174117e601b0"), "name" : "Chiller pirates", "url" : "UNREuwdJCw0", "title" : "Assassin's Creed IV Black Flag - Assassin's Creed IV Black Flag Main Theme (Track 01)", "length" : 136, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff19") },
  { "_id" : new mongoose.Types.ObjectId("625ae6e388f2174117e601bd"), "name" : "Sad flute", "url" : "XQz76UgHSzk", "title" : "Sad flute Song", "length" : 398, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1a") },
  { "_id" : new mongoose.Types.ObjectId("625ae6ec88f2174117e601ca"), "name" : "Very sad", "url" : "jULiKR7scMk", "title" : "Ugur Dariveren & Selcuk Bal - A Lament For Happiness [Sad Emotional Music]", "length" : 130, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1a") },
  { "_id" : new mongoose.Types.ObjectId("625ae6f688f2174117e601d7"), "name" : "Epic sad (main character death)", "url" : "1GQdMOUOeuY", "title" : "Paul Werner - Last Words | SAD EMOTIONAL VOCAL", "length" : 151, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1a") },
  { "_id" : new mongoose.Types.ObjectId("625ae6fe88f2174117e601e4"), "name" : "Slower", "url" : "YNufemzZ3Vo", "title" : "Atis Freivalds - Away | SAD EMOTIONAL MUSIC", "length" : 135, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1a") },
  { "_id" : new mongoose.Types.ObjectId("625ae70988f2174117e601f1"), "name" : "Moving along", "url" : "qgGUJf-Ihyg", "title" : "Tiago D. Ferreira - Do We Fall", "length" : 221, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1a") },
  { "_id" : new mongoose.Types.ObjectId("625ae71688f2174117e601fe"), "name" : "Big decision", "url" : "8GcBGhV047A", "title" : "Who Wants to Be a Millionaire? $64 000 Question Music (One-Hour Loop)", "length" : 3679, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1b") },
  { "_id" : new mongoose.Types.ObjectId("625ae72188f2174117e6020b"), "name" : "Soft guitar", "url" : "ss7EJ-PW2Uk", "title" : "3 Hour Relaxing Guitar Music: Meditation Music, Instrumental Music, Calming Music, Soft Music, ☯2432", "length" : 10811, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1b") },
  { "_id" : new mongoose.Types.ObjectId("625ae72d88f2174117e60218"), "name" : "Elvish style harp music", "url" : "PuoLTYeVcno", "title" : "Beautiful harp music", "length" : 157, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1b") },
  { "_id" : new mongoose.Types.ObjectId("625ae73888f2174117e60225"), "name" : "Stealth music", "url" : "ci5bzi3Si-o", "title" : "Assassin's Creed Unity OST Vol.1 - To Your Stealth (Track 13)", "length" : 170, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1b") },
  { "_id" : new mongoose.Types.ObjectId("625ae75988f2174117e60232"), "name" : "Benny Hill", "url" : "3WShMzwT-nM", "title" : "Benny Hill Theme Tune", "length" : 126, "category" : new mongoose.Types.ObjectId("625ae2f388f2174117e5ff1b") },
];

const doInsert = async () => {
  await mongoose.connect(config.get('mongodb.url'));
  await mongoose.connection.db.collection('categories').insertMany(categories);
  await mongoose.connection.db.collection('presets').insertMany(presets);
  process.exit(0);
};

doInsert();
