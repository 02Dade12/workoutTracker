const router = require('express').Router();
const Workout = require('../models/workout.js');

router.post('/workouts', async(req, res) => {
    try {
        let result = await Workout.create({});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/workouts/:id', async(req, res) => {
    try {
        let { body } = req;
        let { id } = req.params;
        let result = await Workout.findByIdAndUpdate(id, { $push: { exercises: body } }, { new: true, runValidators: true })
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/workouts', async(req, res) => {
    try {
        let result = await Workout.aggregate([
            { $addFields: { totalDuration: { $sum: '$exercises.duration', }, }, },
        ])
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/workouts/range', async(req, res) => {

    try {
        let result = await Workout.aggregate([
                { $addFields: { totalDuration: { $sum: '$exercises.duration', }, }, },
            ])
            .sort({ _id: -1 })
            .limit(7);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/workouts', async(req, res) => {
    try {
        let { id } = req.body
        let result = Workout.findByIdAndDelete(id)
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;