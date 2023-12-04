const getAnimals = async() => {
    try {
        return (await fetch("api/animals/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showAnimals = async() => {
    let animals = await getAnimals();
    let animalsDiv = document.getElementById("animals");
    animalsDiv.innerHTML = "";
    animals.forEach((animal) => {
        const section = document.createElement("section");
        section.classList.add("animal");
        animalsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = animal.name;
        a.append(h3);

        const img = document.createElement("img");
        img.src = animal.img;
        section.append(img);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(animal);
            document.getElementById("animal-details-box").classList.remove("hidden");
        };
    });
};

const displayDetails = (animal) => {
    const animalDetails = document.getElementById("animal-details");
    animalDetails.innerHTML = "";

    const h2 = document.createElement("h2");
    h2.innerHTML = animal.name;
    animalDetails.append(h2);

    const p = document.createElement("p");
    p.innerHTML = animal.description;
    animalDetails.append(p);

    let pgen = document.createElement("p");
    pgen.innerHTML = `Gender: ${animal.gender}`;
    animalDetails.append(pgen);

    let pbre = document.createElement("p");
    pbre.innerHTML = `Breed: ${animal.breed}`;
    animalDetails.append(pbre);

    let page = document.createElement("p");
    page.innerHTML = `Age: ${animal.age}`;
    animalDetails.append(page);

    animalDetails.append("This animal is: ");
    const ul = document.createElement("ul");
    animalDetails.append(ul);
    animal.personality.forEach((trait) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = trait;
    });

    const dLink = document.createElement("a");
    dLink.innerHTML = "Delete";
    animalDetails.append(dLink);
    dLink.id = "delete-link";

    let between = " | ";
    between.id = "between"
    animalDetails.append(between);

    const eLink = document.createElement("a");
    eLink.innerHTML = "Edit";
    animalDetails.append(eLink);
    eLink.id = "edit-link";

    eLink.onclick = (e) => {
        e.preventDefault();
        document.getElementById("animal-details-box").classList.add("hidden");
        document.getElementById("form-box").classList.remove("hidden");
        document.getElementById("title").innerHTML = "Edit Animal";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteAnimal(animal);
        document.getElementById("animal-details-box").classList.add("hidden");
    };

    resetForm();
    populateEditForm(animal);
};

const deleteAnimal = async(animal) => {
    let response = await fetch(`/api/animals/${animal._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error " +response.status+ " deleting");
        return;
    }

    showAnimals();
    document.getElementById("animal-details").innerHTML = "";
    resetForm();
}

const populateEditForm = (animal) => {
    const form = document.getElementById("animal-form");
    form._id.value = animal._id;
    form.name.value = animal.name;
    form.description.value = animal.description;
    form.gender.value = animal.gender;
    form.breed.value = animal.breed;
    form.age.value = animal.age;
    populatePersonality(animal)
};

const populatePersonality = (animal) => {
    const section = document.getElementById("trait-boxes");

    animal.personality.forEach((trait) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = trait;
        section.append(input);
    });
}

const addAnimal = async(e) => {
    e.preventDefault();
    const form = document.getElementById("animal-form");
    const formData = new FormData(form);
    let response;
    formData.append("personality", getPersonality());

    if (form._id.value == -1) {
        formData.delete("_id");

        response = await fetch("/api/animals", {
            method: "POST",
            body: formData
        });
    } else {
        response = await fetch(`/api/animals/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    if (response.status != 200) {
        console.log("Error " +response.status+ " posting data");
        alert("The form information does not meet the requirements. Please try again.");
    } else {
        alert("New friend added!");
    }

    animal = await response.json();

    if (form._id.value != -1) {
        displayDetails(animal);
    }

    resetForm();
    document.getElementById("form-box").classList.add("hidden");
    showAnimals();
};

const getPersonality = () => {
    const inputs = document.querySelectorAll("#trait-boxes input");
    let personality = [];

    inputs.forEach((input) => {
        personality.push(input.value);
    });

    return personality;
}

const resetForm = () => {
    const form = document.getElementById("animal-form");
    form.reset();
    form._id = "-1";
    document.getElementById("trait-boxes").innerHTML = "";
};

const showAdd = (e) => {
    e.preventDefault();
    document.getElementById("form-box").classList.remove("hidden");
    document.getElementById("title").innerHTML = "Add Animal";
    resetForm();
};

const addPersonality = (e) => {
    e.preventDefault();
    const section = document.getElementById("trait-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showAnimals();
    document.getElementById("animal-form").onsubmit = addAnimal;
    document.getElementById("add-animal").onclick = showAdd;

    document.getElementById("close-animal").onclick = () => {
        document.getElementById("animal-details-box").classList.add("hidden");
    };

    document.getElementById("close-form").onclick = () => {
        document.getElementById("form-box").classList.add("hidden");
    };

    document.getElementById("add-trait").onclick = addPersonality;
};