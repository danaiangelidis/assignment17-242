const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/* Animal information taken from https://finalvictoryrescue.com/ :) */

let animals = [{
        _id: 1,
        name: "Angel",
        description: "This sweet baby is Angel, a labrador mix who came to us from a local shelter. She has the most hilariously tiny ears and is so affectionate! Angel is the definition of a velcro dog, all she wants to do is be right by your side or in your lap all day! She loves other dogs, walks, and is very playful! She is going to make an incredible family dog someday, hopefully just in time for the holidays!",
        img: "images/angel.jpg",
        gender: "Female",
        breed: "Retriever/Labrador Mix",
        age: 2,
        personality: [
            "affectionate",
            "clingy",
            "kid-friendly",
            "dog-friendly",
            "playful",
            "energetic"
        ],
    },
    {
        _id: 2,
        name: "Eve",
        description: "This stunning girl is Eve, a 1 year old Kai Ken mix who came to us from a local shelter. These girls are beautiful, gentle, affectionate dogs who love everyone they meet! They are smart, playful, and are so excited to start life anew in their forever families! They are learning their leash skills and household manners so they can become the best family dogs ever!",
        img: "images/eve.jpg",
        gender: "Female",
        breed: "Kai Dog Mix",
        age: 1,
        personality: [
            "social",
            "gentle",
            "kid-friendly",
            "dog-friendly",
            "affectionate",
            "cat-apprehensive"
        ],
    },
    {
        _id: 3,
        name: "Kevin",
        description: "This pretty boy is Kevin, a 3 year old shepherd who came to us from a local shelter. He is absolutely stunning, smart, and energetic! Kevin has been in foster, is completely housetrained, crate trained, and extremely friendly with other dogs. He does have lots of energy, and will need some leash training from his family, but he's truly a delight! Kevin knows he's handsome, and will make friends with anyone he meets! If you are looking for an adventure pal to complete your family, Kevin is your boy.",
        img: "images/kevin.jpg",
        gender: "Male",
        breed: "Sheperd Mix",
        age: 3,
        personality: [
            "smart",
            "energetic",
            "kid-friendly",
            "dog-friendly",
            "not leash trained",
            "adventurous"
        ],
    },
    {
        _id: 4,
        name: "Prince",
        description: "Meet Prince, an adorable and affectionate kitten who is eagerly searching for his forever home. This charming little feline is all about snuggles and companionship, making him the perfect addition to any loving family.",
        img: "images/tux.jpeg",
        gender: "Male",
        breed: "Tuxedo",
        age: 0,
        personality: [
            "snuggly",
            "clingy",
            "couch potato",
            "kid-friendly",
            "cat-friendly",
            "calm"
        ],
    },
    {
        _id: 5,
        name: "Drizzle",
        description: "This beautiful girl is Drizzle, an 8 month old golden retriever mix who came to us with her siblings and mom, completely feral and terrified of everything. They have been improving in our care, but these babies will still need a lot of extra TLC and patience to learn how to be dogs. They are unaccustomed to human touch, and are unfamiliar with what it takes to be a family pup. However, our staff are working with them around the clock to ensure they are getting socialized and learning what it means to be a dog! They are learning leash skills, slowly being comfortable with pets and affection, and working on household manners. These babies are going to need special adopters who are dedicated to training and working with them so they can become the best dogs they can be!",
        img: "images/drizzle.jpg",
        gender: "Female",
        breed: "Retriever Mix",
        age: 0,
        personality: [
            "fearful",
            "a rescue",
            "dog-friendly",
            "not house trained",
            "not used to human touch"
        ],
    },
    {
        _id: 6,
        name: "Tux",
        description: "Meet Tux, an absolutely adorable female tuxedo kitten who is eagerly searching for her forever home. With her striking black and white coat, she is as stylish as she is playful. Myrtle is a bundle of energy and loves nothing more than engaging in fun-filled playtime.",
        img: "images/prince.jpg",
        gender: "Female",
        breed: "Tuxedo",
        age: 0,
        personality: [
            "energetic",
            "playful",
            "gentle",
            "cuddly",
            "litterbox trained",
            "excitable"
        ],
    },
];

app.get("/api/animals", (req, res) => {
    res.send(animals);
});

app.post("/api/animals", upload.single("img"), (req, res) => {
    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const animal = {
        _id: animals.length+1,
        name: req.body.name,
        description: req.body.description,
        gender: req.body.gender,
        breed: req.body.breed,
        age: req.body.age,
        personality: req.body.personality.split(",")
    }

    if (req.file) {
        animal.img = "images/" + req.file.filename;
    }

    animals.push(animal);
    res.send(animals);
});

app.put("/api/animals/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const animal = animals.find((r) => r._id === id);;

    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    animal.name = req.body.name;
    animal.description = req.body.description;
    animal.gender = req.body.gender,
    animal.breed = req.body.breed,
    animal.age = req.body.age,
    animal.personality = req.body.personality.split(",");

    if (req.file) {
        animal.img = "images/" + req.file.filename;
    }

    res.send(animal);
});

app.delete("/api/animals/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const animal = animals.find((r) => r._id === id);

    if (!animal) {
        res.status(404).send("Animal not found");
        return;
    }

    const index = animals.indexOf(animal);
    animals.splice(index, 1);
    res.send(animal);

});

const validateAnimal = (animal) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(5).max(500).required(),
        gender: Joi.string().min(4).max(6).required(),
        breed: Joi.string().min(2).max(50).required(),
        age: Joi.number().integer().min(0).max(30).required(),
        personality: Joi.allow(""),
    });

    return schema.validate(animal);
};

app.listen(3000, () => {
    console.log("I'm listening");
});