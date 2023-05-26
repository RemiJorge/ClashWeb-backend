const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
require('dotenv').config();

const rdToken = process.env.RANDOM_TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, rdToken);
      const userId = decodedToken.userId;
      const user = await User.findById(userId);
      if (user.banned) {
          return res.status(403).json({message: 'Vous avez été banni.'});
      }
      req.auth = {
          userId: userId,
          playerId : user.playerId
      };
      // if user is banned
      

      next();
  } catch(error) {
      res.status(401).json({message: 'Invalid token'});
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    // Vérifie si l'utilisateur existe
    const user = await User.findById(userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.role.some(role => role.name === "admin")) {
      // L'utilisateur est un admin
      next();
    } else {
      // L'utilisateur n'est pas un admin
      return res.status(403).json({ message: "Require Admin Role!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la vérification du rôle de l'utilisateur." });
  }
};


// Vérifie si l'utilisateur est un modérateur
const isModerator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    // Vérifie si l'utilisateur existe
    const user = await User.findById(userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.role.some(role => role.name === "moderator" || role.name === "admin")) {
      // L'utilisateur est un modérateur
      next();
    } else {
      // L'utilisateur n'est pas un modérateur
      return res.status(403).json({ message: "Require Moderator Role!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la vérification du rôle de l'utilisateur." });
  }
};


const auth = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = auth;