const {Client} = require('clashofclans.js');
const User = require('../models/User');
const Clans = require('../models/Clans');
const Player = require('../models/Player');
const AnnoncePlayer = require('../models/AnnoncePlayer');
const ClanCtrl = require('./clans');

require('dotenv').config();

const API_KEY = process.env.API_KEY;
const coc = new Client({ keys: [API_KEY] });

exports.verifyToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId);
    const tag = req.body.tag;
    const token = req.body.token;

    if (user === null) {
      return res.status(404).json({ message: 'User not found!' });
    } else {
      if (user.playerId !== null) {
        await Player.deleteById(user.playerId);
      }

      const player = await Player.findOne({ tag: tag });

      if (player !== null) {
        return res.status(409).json({ message: 'Player already exists' });
      } else {
        const isTokenValid = await coc.verifyPlayerToken(tag, token);

        if (isTokenValid === true) {
          const response = await coc.getPlayer(tag);
          const playerData = {
            tag: response.tag,
            name: response.name,
            townHallLevel: response.townHallLevel,
            townHallWeaponLevel: response.townHallWeaponLevel,
            expLevel: response.expLevel,
            trophies: response.trophies,
            bestTrophies: response.bestTrophies,
            warStars: response.warStars,
            attackWins: response.attackWins,
            defenseWins: response.defenseWins,
            builderHallLevel: response.builderHallLevel,
            builderBaseTrophies: response.builderBaseTrophies,
            versusTrophies: response.versusTrophies,
            bestVersusTrophies: response.bestVersusTrophies,
            versusBattleWins: response.versusBattleWins,
            role: response.role,
            donations: response.donations,
            donationsReceived: response.received,
            league: response.league
          };
          
          if (response.clan !== null) {
            req.body.clanTag = response.clan.tag;
            await ClanCtrl.createClan(req, res);
          }

          const newPlayer = new Player(playerData);
          await newPlayer.save();
          await user.updateOne({ playerId: newPlayer._id });
          return res.status(200).json({ message: 'Player added' });
        } else {
          return res.status(400).json(isTokenValid);
        }
      }
    }
  } catch (error) {
    console.error('error', error);
    res.status(401).json({ error });
  }
};



exports.getPlayer = async (req, res) => {
  try{
    const user = await User.findById(req.auth.userId);
      if (user === null) {
        res.status(404).json({ message: "L'utilisateur n'existe pas" });
      } else if (user.playerId === null) {
        res.status(401).json({ message: "Connexion à supercell requise" });
      } else {
        const player = await Player.findOne(user.playerId)
        if (player === null) {
          res.status(404).json({ message: "Le joueur n'existe pas" });
        } else {
          let playerData = {
            tag: player.tag,
            name: player.name,
            townHallLevel: player.townHallLevel,
            townHallWeaponLevel: player.townHallWeaponLevel,
            expLevel: player.expLevel,
            trophies: player.trophies,
            bestTrophies: player.bestTrophies,
            warStars: player.warStars,
            attackWins: player.attackWins,
            defenseWins: player.defenseWins,
            builderHallLevel: player.builderHallLevel,
            builderBaseTrophies: player.builderBaseTrophies,
            versusTrophies: player.versusTrophies,
            bestVersusTrophies: player.bestVersusTrophies,
            versusBattleWins: player.versusBattleWins,
            role: player.role,
            donations: player.donations,
            donationsReceived: player.donationsReceived,
            league: player.league
          };

          if (player.lastupdate < Date.now() - 5 * 60 * 10000000) {
            const response = await coc.getPlayer(player.tag);
              playerData = {
                tag: response.tag,
                name: response.name,
                townHallLevel: response.townHallLevel,
                townHallWeaponLevel: response.townHallWeaponLevel,
                expLevel: response.expLevel,
                trophies: response.trophies,
                bestTrophies: response.bestTrophies,
                warStars: response.warStars,
                attackWins: response.attackWins,
                defenseWins: response.defenseWins,
                builderHallLevel: response.builderHallLevel,
                builderBaseTrophies: response.builderBaseTrophies,
                versusTrophies: response.versusTrophies,
                bestVersusTrophies: response.bestVersusTrophies,
                versusBattleWins: response.versusBattleWins,
                role: response.role,
                donations: response.donations,
                donationsReceived: response.received,
                league: response.league
              };
            playerData.lastupdate = Date.now();
            if (response.clan !== null) {
              req.body.clanTag = response.clan.tag;
              await ClanCtrl.createClan(req, res);
            }
            
            await player.updateOne(playerData);

          }

          if (player.clan !== null) {
            const clan = await Clans.findById(player.clan);
            playerData.clan = clan;
          }

          res.status(200).json(playerData);
        }}
        
      } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

exports.getPlayerByTag = async (req, res) => {
  try{
    //rajouter # devant le tag
    const tag = "#" + req.params.id;
    const player = await Player.findOne({ tag: tag });
    const user = await User.findOne({ playerId: player._id });
    req.auth.userId = user._id;
    await this.getPlayer(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

exports.deletePlayer = async (req, res) =>  {
  try{
    const userId = req.auth.userId;
    
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(404).json({ message: 'User not found!' });
    }
    if (user.playerId === null) {
      return res.status(404).json({ message: 'Player not found!' });
    }
    // remove annonce
    await AnnoncePlayer.deleteOne({ playerId: user.playerId });
    // remove player
    await Player.deleteOne({ _id: user.playerId });
    // remove player from user
    await user.updateOne({ playerId: null });
    res.status(200).json({ message: 'Player removed' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
