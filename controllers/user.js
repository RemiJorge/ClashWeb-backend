const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const rdToken = process.env.RANDOM_TOKEN_SECRET;



exports.signup = (req, res, next) => {
    Promise.all([
        User.findOne({ email: req.body.email }),
        User.findOne({ pseudo: req.body.pseudo })
    ])
        .then(([emailUser, pseudoUser]) => {
            if (emailUser !== null && pseudoUser !== null) {
                return res.status(409).json({ raison : 'email and pseudo already exist'});
            }
            else if (emailUser !== null) {
                return res.status(409).json({ raison : 'email already exist'});
            }
            else if (pseudoUser !== null) {
                return res.status(409).json({ raison : 'pseudo already exist'});
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: req.body.email,
                            pseudo: req.body.pseudo,
                            password: hash
                        });
                        user.save()
                            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                            .catch(error => res.status(400).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};





exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                return res.status(401).json({ message : 'identifiant ou mot de passe incorrect !'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message : 'identifiant ou mot de passe incorrect !' });
                        }else{
                            res.status(200).json({
                                userId: user._id, 
                                token: jwt.sign(
                                    { userId: user._id },
                                    rdToken,
                                    { expiresIn: '24h' }
                                )});
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));

};