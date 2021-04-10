const path = require("path");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Workout = require("./models/workout.js")

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, './public/exercise.html'))
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, './public/stats.html'))
});

//

app.get("/api/workouts", (req, res) => {
    Workout.aggregate([{
        $addFields: {
            totalDuration: {
                $sum: "$exercises.duration"
            }
        }
    }]).then(allWorkouts => {
        console.log(allWorkouts);
        res.json(allWorkouts);
    }).catch(err => {
        res.json(err);
    });
})

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });