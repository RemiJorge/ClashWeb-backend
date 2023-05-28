const AnnonceClan = require('../models/AnnonceClan');
const MessageAnnonce = require('../models/MessageClan');
const Player = require('../models/Player');

// Créer une annonce pour un joueur
// Créer une annonce pour un clan (disponible pour le co-leader ou le leader du clan)
exports.createAnnonceClan = async (req, res, next) => {
  const { minimumTh, minimumTrophies, description } = req.body;

  try {
    const userId = req.auth.userId;
    const playerId = req.auth.playerId;

    if (!playerId) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const clanId = player.clan;
    if (!clanId) {
      return res.status(404).json({ message: "Clan non trouvé." });
    }

    // Vérifier si l'utilisateur est co-leader ou leader du clan
    if (player.role !== 'leader' && player.role !== 'coLeader') {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à créer une annonce pour ce clan." });
    }

    // Vérifier si le clan a déjà une annonce
    const existingAnnonce = await AnnonceClan.findOne({ clanId });
    if (existingAnnonce) {
      return res.status(409).json({ message: "Le clan a déjà une annonce." });
    }

    //description max 200 caractères tronquée si plus
    const truncatedDescription = description.length > 200 ? description.substring(0, 200) : description;

    const annonceClan = new AnnonceClan({
      clanId,
      minimumTh,
      minimumTrophies,
      description: truncatedDescription,
    });

    await annonceClan.save();
    res.status(201).json({ message: 'Annonce créée avec succès.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Obtenir toutes les annonces des clans
exports.getAllAnnonceClan = async (req, res, next) => {
  try {
    console.log("getAllAnnonceClan");
    const annoncesClans = await AnnonceClan.find().populate('clanId');
    console.log("getAllAnnonceClan success");
    res.status(200).json(annoncesClans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};


// Obtenir une annonce de clan spécifique
exports.getAnnonceClan = async (req, res) => {
  try {
    const playerId = req.auth.playerId;
    if (!playerId) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const clanId = player.clan;
    if (!clanId) {
      return res.status(404).json({ message: "Clan non trouvé." });
    }

    const annonce = await AnnonceClan.findOne({ clanId });

    if (!annonce) {
      return res.status(404).json({ message: 'Aucune annonce trouvée pour ce clan.' });
    }

    res.status(200).json(annonce);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de l\'annonce de clan.' });
  }
};

// Modifier une annonce de clan
exports.updateAnnonceClan = async (req, res, next) => {
  try {
    const playerId = req.auth.playerId;
    if (!playerId) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const clanId = player.clan;
    if (!clanId) {
      return res.status(404).json({ message: "Clan non trouvé." });
    }

    // Vérifier si l'utilisateur est co-leader ou leader du clan
    if (player.role !== 'leader' && player.role !== 'coLeader') {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette annonce de clan." });
    }

    const { minimumTh, minimumTrophies, description } = req.body;

    const annonceClan = await AnnonceClan.findOne({ clanId });
    if (!annonceClan) {
      return res.status(404).json({ message: "Annonce introuvable pour ce clan." });
    }

    //description max 200 caractères tronquée si plus
    const truncatedDescription = description.length > 200 ? description.substring(0, 200) : description;

    annonceClan.minimumTh = minimumTh;
    annonceClan.minimumTrophies = minimumTrophies;
    annonceClan.description = truncatedDescription;

    await annonceClan.save();
    res.status(200).json({ message: 'Annonce mise à jour avec succès.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};


// Supprimer une annonce de clan
exports.deleteAnnonceClan = async (req, res, next) => {
  try {
    const playerId = req.auth.playerId;
    if (!playerId) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }
    const clanId = player.clan;
    if (!clanId) {
      return res.status(404).json({ message: "Clan non trouvé." });
    }

    // Vérifier si l'utilisateur est co-leader ou leader du clan
    if (player.role !== 'leader' && player.role !== 'coLeader') {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette annonce de clan." });
    }

    const annonceClan = await AnnonceClan.findOne({ clanId });
    if (!annonceClan) {
      return res.status(404).json({ message: "Annonce introuvable pour ce clan." });
    }

    // Supprimer les messages de l'annonce
    await MessageAnnonce.deleteMany({ AnnonceClanId: annonceClan._id });

    await AnnonceClan.deleteOne({ clanId });

    res.status(200).json({ message: 'Annonce supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};