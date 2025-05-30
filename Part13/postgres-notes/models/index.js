const Note = require("./note");
const User = require("./user");
const Team = require("./team");
const Membership = require("./membership");
const UserNotes = require("./userNotes");

User.hasMany(Note);
Note.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

User.belongsToMany(Note, { through: UserNotes, as: "marked_notes" });
Note.belongsToMany(User, { through: UserNotes, as: "users_marked" });

// Note.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Note, User, Team, Membership };