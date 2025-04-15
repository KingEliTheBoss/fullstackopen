require("dotenv").config();
const { Sequelize, Model, QueryTypes, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL);
// This if using Heroku
/*const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});*/

class Note extends Model { };
Note.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    important: {
        type: DataTypes.BOOLEAN
    },
    date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note"
});
Note.sync();

app.get("/api/notes", async (req, res) => {
    const notes = await Note.findAll();

    console.log(JSON.stringify(notes, null, 2));

    res.json(notes);
});

app.post("/api/notes", async (req, res) => {
    try {
        const note = await Note.create(req.body);
        res.json(note);
    } catch (error) {
        return res.status(400).json({ error });
    }


    //Note.build() create a note object but doesn't save it automatically so it can be edited
    // const note = Note.build(req.body);
    // note.important = true;
    // await note.save
});

app.get("/api/notes/:id", async (req, res) => {
    const note = await Note.findByPk(req.params.id);
    if (note) {
        console.log(note.toJSON());
        res.json(note);
    } else {
        res.status(404).end();
    }
});

app.put("/api/notes/:id", async (req, res) => {
    const note = await Note.findByPk(req.params.id);
    if (note) {
        note.important = req.body.important;
        await note.save();
        res.json(note);
    } else {
        res.status(404).end();
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Not web app
/*const main = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        const notes = await sequelize.query("SELECT * FROM notes", {type: QueryTypes.SELECT});
        console.log(notes);

        sequelize.close();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
main();*/