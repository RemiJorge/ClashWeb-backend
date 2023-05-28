const {Client} = require('clashofclans.js');
const Clans = require('../models/Clans');

require('dotenv').config();

const API_KEY = process.env.API_KEY;
const coc = new Client({ keys: [API_KEY] });

exports.createClan = async (req, res, next) => {
    try{
        const tag = req.body.clanTag;
        const clan = await Clans.findOne({tag: tag});
        if (clan === null) {
            const response = await coc.getClan(tag);
            const clanData = {
                tag: response.tag,            
                name: response.name,
                level: response.level,
                description: response.description,
                clanPoints: response.points,
                clanVersusPoints: response.versusPoints,
                badge: response.badge,
                type: response.type,
                members: response.memberCount,
                lastupdate: Date.now()
            };
            const newClan = new Clans(clanData);
            await newClan.save();
        }
        else {
            if (clan.lastupdate < Date.now() - 1000 * 60 * 10) { // 10 minutes
                const response = await coc.getClan(tag);
                const clanData = {
                    tag: response.tag,            
                    name: response.name,
                    level: response.level,
                    description: response.description,
                    clanPoints: response.points,
                    clanVersusPoints: response.versusPoints,
                    badge: response.badge,
                    type: response.type,
                    members: response.memberCount,
                    lastupdate: Date.now()
                };
                await clan.updateOne(clanData);
            }
        }
        return;
    }
    catch (error) {
        console.error(error);
        return;
    }
};
