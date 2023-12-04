const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

mongoose.connect(
    "mongodb+srv://angelidisdanai:ufkBvXlteDvPQKpT@assignment17.fdmsu3p.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("Could not connect to MongoDB...", error));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const animalSchema = new mongoose.Schema ({
    name: String,
    description: String,
    img: String,
    gender: String,
    breed: String,
    age: Number,
    personality: [String],
});

const Animal = mongoose.model("Animal", animalSchema);

/* Animal information taken from https://finalvictoryrescue.com/ :) */

app.get("/api/animals", (req, res) => {
    getAnimals(res);
});

const getAnimals = async (res) => {
    const animals = await Animal.find();
    res.send(animals);
}

app.post("/api/animals", upload.single("img"), (req, res) => {
    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const animal = new Animal ({
        name: req.body.name,
        description: req.body.description,
        gender: req.body.gender,
        breed: req.body.breed,
        age: req.body.age,
        personality: req.body.personality.split(",")
    });

    if (req.file) {
        animal.img = "images/" + req.file.filename;
    }

    createAnimal(animal, res);
});

const createAnimal = async (animal, res) => {
    const result = await animal.save();
    res.send(animal);
};

app.put("/api/animals/:id", upload.single("img"), (req, res) => {
    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateAnimal(req, res);
});

const updateAnimal = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        description: req.body.description,
        gender: req.body.gender,
        breed: req.body.breed,
        age: req.body.age,
        personality: req.body.personality.split(","),
    };

    if (req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await Animal.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const animal = await Animal.findById(req.params.id);
    res.send(animal);
};


app.delete("/api/animals/:id", upload.single("img"), (req, res) => {
    removeAnimal(res, req.params.id);
});

const removeAnimal = async (res, id) => {
    const animal = await Animal.findByIdAndDelete(id);
    res.send(animal);
  };

const validateAnimal = (animal) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(2).max(100).required(),
        description: Joi.string().min(5).max(1000).required(),
        gender: Joi.string().min(4).max(10).required(),
        breed: Joi.string().min(2).max(100).required(),
        age: Joi.number().integer().min(0).max(50).required(),
        personality: Joi.allow(""),
    });

    return schema.validate(animal);
};

app.listen(3000, () => {
    console.log("I'm listening");
});