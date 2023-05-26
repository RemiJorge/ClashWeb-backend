const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Player = require('../models/Player');
const Role = require('../models/Role');
const sendEmail = require('../utils/mail');
const passwordForgetTemplate = require('../utils/templateMail');
require('dotenv').config();

const rdToken = process.env.RANDOM_TOKEN_SECRET;



exports.signup = async (req, res, next) => {
    try {
        const emailUser = await User.findOne({ email: req.body.email });
        if (emailUser !== null) {
            return res.status(409).json({ raison: 'email already exist' });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            // Récupérer le rôle par défaut "user"
            const defaultUserRole = await Role.findOne({ name: "user" });
            if (!defaultUserRole) {
                return res.status(404).json({ message: "Rôle par défaut 'user' non trouvé." });
            }
            const user = new User({
                email: req.body.email,
                password: hashedPassword,
                role: [defaultUserRole._id] // Ajout du rôle par défaut
            });

            await user.save();

            res.status(201).json({ message: 'Utilisateur créé !' });
        }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  };
  




  exports.login = async (req, res, next) => {
    try {
  
      // Recherche de l'utilisateur par email
      const user = await User.findOne({ email: req.body.email });
  
      if (user === null) {
        return res.status(401).json({ raison: 'email or password incorrect' });
      } else {
        // Comparaison du mot de passe fourni avec le mot de passe haché enregistré
        const validPassword = await bcrypt.compare(req.body.password, user.password);
  
        if (!validPassword) {
          return res.status(401).json({ raison: 'email or password incorrect' });
        } else {
          // Vérification des rôles de l'utilisateur
          const moderatorRole = await Role.findOne({ name: 'moderator' });
          const adminRole = await Role.findOne({ name: 'admin' });
  
          const isModo = user.role.includes(moderatorRole._id);
          const isAdmin = user.role.includes(adminRole._id);

          let player = null;
          let tag = null;
          let role = null;
          if (user.playerId !== null) {
            player = await Player.findById(user.playerId);
            tag = player.tag;
            role = player.role
          }
          
          // Création du token JWT pour l'authentification
          const token = jwt.sign(
            { userId: user._id },
            rdToken,
            { expiresIn: '24h' }
          );
  
          res.status(200).json({
            userId: user._id,
            token: token,
            isModo: isModo,
            isAdmin: isAdmin,
            role: role,
            playerTag: tag
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  };
  



exports.forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user === null) {
      return res.status(401).json({ raison: 'email incorrect' });
    } else {
      // Génération d'un mot de passe aléatoire
      const randomPassword = Math.random().toString(36).slice(-8);

      // Hachage du mot de passe aléatoire
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Mise à jour du mot de passe de l'utilisateur
      await User.updateOne({ email: req.body.email }, { password: hashedPassword });

      // Envoi de l'email
      await sendEmail(user.email, 'Mot de passe oublié', passwordForgetTemplate(user.pseudo, randomPassword));

      res.status(200).json({ message: 'Email envoyé !' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};


exports.changePassword = async (req, res, next) => {
  try {

    const user = await User.findById(req.auth.userId);

    if (user === null) {
      return res.status(401).json({ raison: 'token incorrect' });
    } else {
      const validPassword = await bcrypt.compare(req.body.password, user.password);

      if (!validPassword) {
        return res.status(401).json({ raison: 'password incorrect' });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

        await User.updateOne({ _id: req.auth.userId }, { password: hashedPassword });

        res.status(200).json({ message: 'password updated' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};


// Obtenir tous les utilisateurs et leurs le player et roles associé mais ne pas renvoyer le mot de passe
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('playerId').populate('role');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}