const mongoose = require("mongoose");

const password = process.argv[2];

const url =
    `mongodb+srv://FullStackEli:${password}@cluster0.x4uyz.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}
else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
}
else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        phoneNumber: process.argv[4],
    });

    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.phoneNumber} to phonebook`);
        mongoose.connection.close();
        process.exit();
    });
}