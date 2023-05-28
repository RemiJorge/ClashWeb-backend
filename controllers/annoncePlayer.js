const AnnonceJoueur = require('../models/AnnoncePlayer');
const MessageAnnonce = require('../models/MessageAnnonce');
// Créer une annonce pour un joueur
exports.createAnnoncePlayer = async (req, res, next) => {
  const { minimumLevel, minimumTrophies, description } = req.body;

  try {
    const userId = req.auth.userId;
    const playerId = req.auth.playerId;
    if (!playerId) {
        return res.status(404).json({ message: "Joueur non trouvé." });
    }
    // Vérifier si le joueur a déjà une annonce
    const existingAnnonce = await AnnonceJoueur.findOne({ playerId });
    if (existingAnnonce) {
      return res.status(409).json({ message: "Le joueur a déjà une annonce." });
    }
    //description max 200 caractères tronquer si plus
    if (description.length > 200) {
        description = description.substring(0, 200);
    }
    // minimumLevel est un nombre compris entre 1 et 50
    if (minimumLevel < 1 || minimumLevel > 50) {
        return res.status(409).json({ message: "Le niveau minimum doit être compris entre 1 et 50." });
    }
    // minimumTrophies est un nombre compris entre 0 et 50000
    if (minimumTrophies < 0 || minimumTrophies > 50000) {
        return res.status(409).json({ message: "Le nombre de trophées minimum doit être compris entre 0 et 50000." });
    }

    const annonceJoueur = new AnnonceJoueur({
        userId,
        playerId,
        minimumLevel,
        minimumTrophies,
        description,
    });

    await annonceJoueur.save();
    res.status(201).json({ message: 'Annonce créée avec succès.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Obtenir toutes les annonces des joueurs
exports.getAllAnnoncePlayer = async (req, res, next) => {
  try {
    const playerId = req.auth.playerId;
    const annoncesJoueurs = await AnnonceJoueur.find().populate('playerId');
    // Filtrer les annonces avec playerId égal à playerId
    let filteredAnnoncesJoueurs = annoncesJoueurs;
    if (playerId !== null){
      filteredAnnoncesJoueurs = annoncesJoueurs.filter(annonce => annonce.playerId._id.toString() !== playerId.toString());
    }
    res.status(200).json(filteredAnnoncesJoueurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};


exports.getAnnoncePlayer = async (req, res) => {
    try {
        const playerId = req.auth.playerId;
        if (!playerId) {
            return res.status(404).json({ message: "no player linked" });
        }

        //populate with player but only clan and role
        // then populate with playerId.clan but only clanPoints, level and members
        const annonce = await AnnonceJoueur.findOne({ playerId }).populate({path: 'playerId', select: 'clan role', populate: {path: 'clan', select: 'clanPoints level members'}});
    
        if (!annonce) {
            return res.status(404).json({ message: 'no annonce found' });
        }
    
        res.status(200).json(annonce);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de l\'annonce joueur.' });
    }
};

// Modifier une annonce joueur
exports.updateAnnoncePlayer = async (req, res, next) => {
    try {
        const playerId = req.auth.playerId;
        if (playerId === null){
            return res.status(404).json({ message: "Joueur non trouvé." });
        }

        const { minimumLevel, minimumTrophies, description } = req.body;
        // minimumLevel est un nombre compris entre 1 et 50
        if (minimumLevel < 1 || minimumLevel > 50) {
            return res.status(409).json({ message: "Le niveau minimum doit être compris entre 1 et 50." });
        }
        // minimumTrophies est un nombre compris entre 0 et 50000
        if (minimumTrophies < 0 || minimumTrophies > 50000) {
            return res.status(409).json({ message: "Le nombre de trophées minimum doit être compris entre 0 et 50000." });
        }

        const annonceJoueur = await AnnonceJoueur.findOne({ playerId })
        if (!annonceJoueur) {
        return res.status(404).json({ message: "Annonce introuvable." });
        }

        //description max 200 caractères tronquer si plus
        if (description.length > 200) {
            description = description.substring(0, 200);
        }


        annonceJoueur.minimumLevel = minimumLevel;
        annonceJoueur.minimumTrophies = minimumTrophies;
        annonceJoueur.description = description;

        await annonceJoueur.save();
        res.status(200).json({ message: 'Annonce mise à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ error });
    }
};


// Supprimer une annonce joueur
exports.deleteAnnoncePlayer = async (req, res, next) => {

  try {

    const playerId = req.auth.playerId;
    if (playerId === null){
        return res.status(404).json({ message: "Joueur non trouvé." });
    }

    // Vérifier si le joueur a une annonce
    const annonce = AnnonceJoueur.findOne({ playerId });
    if (!annonce) {
      return res.status(404).json({ message: "Annonce introuvable." });
    }

    // Supprimer les messages de l'annonce
    await MessageAnnonce.deleteMany({ AnnoncePlayerId: annonce._id });
    
    await AnnonceJoueur.deleteOne({ playerId });


    res.status(200).json({ message: 'Annonce supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
