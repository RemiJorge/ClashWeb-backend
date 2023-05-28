const User = require('../models/User');
const Role = require('../models/Role');
const Player = require('../models/Player');
const AnnoncePlayer = require('../models/AnnoncePlayer');
const MessageAnnonce = require('../models/MessageAnnonce');
/*
// ajoute un role à la base de données "user", "moderator", "admin"
exports.addRole = async (req, res) => {
    try {
        const role = new Role({
            name: "admin"
        });
        await role.save();
        res.status(201).json({ message: 'Role créé !' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.promoteToAdmin = async (req, res) => {
    try {
        const userId = await User.findOne({email: "remijorge5@gmail.com"});
        const modoId = await Role.findOne({name: "moderator"});
        const adminId = await Role.findOne({name: "admin"});
        console.log(userId);
        userId.role.push(modoId._id);
        userId.role.push(adminId._id);
        await userId.save();
        res.status(201).json({ message: 'Role créé !' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};
*/


// Promouvoir un utilisateur en modérateur
exports.promoteToModerator = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Vérifier si l'utilisateur à promouvoir existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Recuperer le rôle de modérateur
    const moderatorRole = await Role.findOne({ name: "moderator" });
    if (!moderatorRole) {
        return res.status(404).json({ message: "Rôle de modérateur non trouvé." });
    }

    // Vérifier si l'utilisateur est déjà un modérateur
    if (user.role.includes(moderatorRole._id)) {
      return res.status(400).json({ message: "L'utilisateur est déjà un modérateur." });
    }

    // Ajouter le rôle de modérateur à l'utilisateur
    user.role.push(moderatorRole._id);
    await user.save();

    res.status(200).json({ message: "Utilisateur promu en tant que modérateur avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la promotion de l'utilisateur." });
  }
};



// Rétrograder un modérateur
exports.demoteToUser = async (req, res) => {
  try {
    // Récupérer l'id de l'utilisateur à rétrograder
    const userId = req.body.userId;

    // Vérifier si l'utilisateur à rétrograder existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Recuperer le rôle de modérateur
    const moderatorRole = await Role.findOne({ name: "moderator" });
    if (!moderatorRole) {
        return res.status(404).json({ message: "Rôle de modérateur non trouvé." });
    }


    // Vérifier si l'utilisateur est déjà un utilisateur classique
    if (!user.role.includes(moderatorRole._id)) {
      return res.status(400).json({ message: "L'utilisateur est déjà un utilisateur classique." });
    }

    // Supprimer le rôle de modérateur de l'utilisateur
    user.role = user.role.filter(role => !role.equals(moderatorRole._id));
    await user.save();

    res.status(200).json({ message: "Utilisateur rétrogradé en tant qu'utilisateur classique avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la rétrogradation de l'utilisateur." });
  }
};


// Bannir un utilisateur
exports.banUser = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Vérifier si l'utilisateur à bannir existe
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      // Vérifier si l'utilisateur est déjà banni
      if (user.banned) {
        return res.status(400).json({ message: "L'utilisateur est déjà banni." });
      }

      // Si l'utilisateur est un moderateur où un admin, on ne peut pas le bannir
      const moderatorRole = await Role.findOne({ name: "moderator" });
      const adminRole = await Role.findOne({ name: "admin" });
      if (user.role.includes(moderatorRole._id) || user.role.includes(adminRole._id)) {
        return res.status(403).json({ message: "L'utilisateur ne peut pas être banni." });
      }


      
      // Bannir l'utilisateur
      user.banned = true;
      await user.save();

      // Bannir le joueur associé à l'utilisateur
      if (user.playerId) {
        const player = await Player.findById(user.playerId);
        if (player) {

          // Supprimer les annonces du joueur
          await AnnoncePlayer.deleteMany({ playerId: player._id });
          // Supprimer les messages du joueur
          await MessageAnnonce.deleteMany({ playerClan: player._id });
          player.banned = true;
          await player.save();
        }
      }
  
      res.status(200).json({ message: "Utilisateur banni avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors du bannissement de l'utilisateur." });
    }
  };
  

  // Débannir un utilisateur
  exports.unbanUser = async (req, res) => {
    try {
      const userId = req.body.userId;
  
      // Vérifier si l'utilisateur à débannir existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      // Vérifier si l'utilisateur est déjà débanni
      if (!user.banned) {
        return res.status(400).json({ message: "L'utilisateur n'est pas banni." });
      }
  
      // Débannir l'utilisateur
      user.banned = false;
      await user.save();

      // Débannir le joueur associé à l'utilisateur
      if (user.playerId) {
        const player = await Player.findById(user.playerId);
        if (player) {
          player.banned = false;
          await player.save();
        }
      }
      
  
      res.status(200).json({ message: "Utilisateur débanni avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors du débannissement de l'utilisateur." });
    }
  };
  