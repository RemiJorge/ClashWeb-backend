const MessageClan = require('../models/MessageClan');
const AnnonceClan = require('../models/AnnonceClan');
const Player = require('../models/Player');


// Créer un message pour une annonce de clan
exports.createMessageClan = async (req, res, next) => {
    try {
      const playerId = req.auth.playerId;
      const { AnnonceClanId, message } = req.body;
  
      // Vérifier si le joueur existe
      const player = await Player.findOne({ _id: playerId });
      if (!player) {
        return res.status(404).json({ message: "Joueur non trouvé." });
      }
  
      // Vérifier si l'annonce existe
      const annonceClan = await AnnonceClan.findOne({ _id: AnnonceClanId });
      if (!annonceClan) {
        return res.status(404).json({ message: "Annonce introuvable." });
      }
  
      // Vérifier si le joueur a déjà postulé à l'annonce
      const existingMessage = await MessageClan.findOne({ AnnonceClanId, player });
      if (existingMessage) {
        return res.status(409).json({ message: "Le joueur a déjà postulé à l'annonce." });
      }
  
      const messageClan = new MessageClan({
        AnnonceClanId,
        player,
        message
      });
  
      await messageClan.save();
      res.status(201).json({ message: 'Message créé avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  };
  

// Obtenir tous les messages d'une annonce de clan
exports.getMessagesByClan = async (req, res, next) => {
    try {
      const playerId = req.auth.playerId;
      if (!playerId) {
        return res.status(404).json({ message: "Joueur non trouvé." });
      }
      const player = await Player.findById(playerId);
      if (player.clan === null) {
        return res.status(404).json({ message: "Joueur non trouvé." });
     }
     
      // Vérifier si l'annonce existe
      const annonceClan = await AnnonceClan.findOne({ clanId: player.clan })
      if (!annonceClan) {
        return res.status(404).json({ message: "Annonce introuvable." });
      }
      const AnnonceClanId = annonceClan._id;
      const messages = await MessageClan.find({ AnnonceClanId }).populate('player');
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
};
  
// Supprimer un message d'une annonce de clan
exports.deleteMessageClan = async (req, res, next) => {
    try {
        const messageId = req.params.id;

        // Vérifier si le message existe
        const message = await MessageClan.findById(messageId);
        if (!message) {
        return res.status(404).json({ message: 'Message introuvable.' });
        }

        await message.deleteOne();

        res.status(200).json({ message: 'Message supprimé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};