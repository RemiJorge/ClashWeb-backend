const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/mail');
const passwordForgetTemplate = require('../utils/templateMail');
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
    User.findOne({ pseudo: req.body.pseudo })
        .then(user => {
            if (user === null) {
                return res.status(401).json({ raison : 'pseudo or password incorrect'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ raison : 'pseudo or password incorrect' });
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



exports.forgetPassword = (req, res, next) => {
    console.log("cherche le pseudo")
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null){
                return res.status(401).json({ raison : 'email incorrect'});
            } else {
                //generate random password
                const randomPassword = Math.random().toString(36).slice(-8);
                //hash random password
                console.log("hash le mot de passe")
                bcrypt.hash(randomPassword, 10)
                    .then(hash => {
                        //update password
                        User.updateOne({ email: req.body.email }, { password: hash })
                            .then(() => {
                                //send email
                                console.log("envoie l'email", user.email, sendEmail)
                                console.log(randomPassword)
                                sendEmail(user.email, 'Mot de passe oublié', passwordForgetTemplate(user.pseudo, randomPassword))
                                    .then(() => res.status(200).json({ message: 'Email envoyé !' }))
                                    .catch(error => res.status(500).json({ error }));
                            })
                            .catch(error => res.status(500).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};


exports.changePassword = (req, res, next) => {
    console.log("change le mdp")
    User.findOne({ _id: req.auth.userId })
        .then(user => {
            if (user === null) {
                return res.status(401).json({ raison : 'token incorrect'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ raison : 'password incorrect' });
                        } else  {
                            bcrypt.hash(req.body.newPassword, 10)
                                .then(hash => {
                                    User.updateOne({ _id: req.auth.userId }, { password: hash })
                                    .then(() => res.status(200).json({ message: 'password updated' }))
                                    .catch(error => res.status(500).json({ error }));
                                })
                                .catch(error => res.status(500).json({ error }));
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};