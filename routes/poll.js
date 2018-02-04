const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote')

const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '468795',
    key: '08dca85ad46924bc260e',
    secret: 'ce05bd3cfa88dcaca8ec',
    cluster: 'us2',
    encrypted: true
});


router.get('/', (req, res) => {
    // res.send('POLL');

    Vote.find().then(votes => res.json({success: true, votes: votes}));
});

//this is where we want to trigger pusher
router.post('/', (req, res) => {

    const newVote = {
        os: req.body.os,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });
        return res.json({ success: true, message: "Thank you for Voting" });
    });
});


module.exports = router;