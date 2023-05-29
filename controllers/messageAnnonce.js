const MessageAnnonce = require('../models/MessageAnnonce');
const Player = require('../models/Player');
const AnnonceJoueur = require('../models/AnnoncePlayer');

// Créer un message pour une annonce
exports.createMessageAnnonce = async (req, res, next) => {
  try {
    const playerClan = await Player.findOne({ _id: req.auth.playerId });
    const { AnnoncePlayerId, message } = req.body;
    // Vérifier si le joueur a déjà postulé à l'annonce
    if (playerClan === null) {
        return res.status(404).json({ message: "no player" });
    }
    if (AnnoncePlayerId === null) {
        return res.status(404).json({ message: "no annonce" });
    }
    const existingMessage = await MessageAnnonce.findOne({ AnnoncePlayerId, playerClan });
    if (existingMessage) {
      return res.status(409).json({ message: "Le joueur a déjà postulé à l'annonce." });
    }

    if (playerClan.clan === null) {
        return res.status(404).json({ message: "no clan" });
    }

    const ClanId = playerClan.clan;

    const messageAnnonce = new MessageAnnonce({
      AnnoncePlayerId,
      playerClan,
      ClanId,
      message,
    });

    await messageAnnonce.save();
    res.status(201).json({ message: 'Message créé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// Obtenir tous les messages d'une annonce
exports.getMessagesByAnnonce = async (req, res, next) => {
  try {
    const playerId = req.auth.playerId;
    const AnnoncePlayer = await AnnonceJoueur.findOne({ playerId });
    const AnnoncePlayerId = AnnoncePlayer._id;
    const messages = await MessageAnnonce.find({ AnnoncePlayerId }).populate('ClanId').populate('playerClan', "name expLevel role tag");
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// supprimer un message
exports.deleteMessage = async (req, res, next) => {
  try{
    const messageId = req.params.id;
    const message = await MessageAnnonce.findById(messageId);
    if (message === null) {
      return res.status(404).json({ message: 'Message not found!' });
    }
    const playerClan = await Player.findOne({ _id: req.auth.playerId });
    if (playerClan === null) {
      return res.status(404).json({ message: "no player" });
    }
    await message.deleteOne();
    res.status(200).json({ message: 'Message removed' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

