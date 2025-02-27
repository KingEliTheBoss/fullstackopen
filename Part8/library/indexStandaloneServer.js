const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
console.log("connecting to", MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("error connection to MongoDB:", error.message)
    });

const typeDefs = `
    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }

    type Book {
        title: String!
        author: Author!
        published: Int!
        genres: [String]
        id: ID!
    }

    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String]
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }
`;

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (!args.author && !args.genre) {
                return await Book.find({}).populate("author");
            }

            if (args.author && args.genre) {
                const foundAuthor = await Author.findOne({ name: args.author });
                return await Book.find({ author: foundAuthor.id, genres: args.genre }).populate("author");
            }

            if (args.author) {
                const foundAuthor = await Author.findOne({ name: args.author });
                return await Book.find({ author: foundAuthor.id }).populate("author");
            }

            if (args.genre) {
                return await Book.find({ genres: args.genre }).populate("author");
            }
        },
        allAuthors: async (root, args) => {
            return await Author.find({});
        },
        me: (root, args, context) => {
            return context.currentUser;
        }
    },
    Author: {
        bookCount: async (root, args) => {
            return await Book.collection.countDocuments({ author: { $exists: root.id } });
        }
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new GraphQLError("not authorized", {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                })
            }

            if (args.title.length < 5) {
                throw new GraphQLError("Title is too short", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.title
                    }
                });
            }
            if (args.author.length < 4) {
                throw new GraphQLError("Author name is too short", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.author
                    }
                });
            }

            try {
                const isAuthor = await Author.findOne({ name: args.author });
                let authorId;
                if (!isAuthor) {
                    const author = new Author({ name: args.author });
                    await author.save();
                    authorId = author.id;
                } else {
                    authorId = isAuthor.id;
                }
                const book = new Book({ ...args, author: authorId });
                await book.save();
                await book.populate("author");
                return book;
                //currentUser.friends = currentUser.friends.concat(person);
                //await currentUser.save();
            } catch (error) {
                throw new GraphQLError("Adding book failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.name,
                        error
                    }
                })
            }
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new GraphQLError("not authorized", {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                })
            }

            const author = await Author.findOne({ name: args.name });
            author.born = args.setBornTo;

            if (args.name.length < 4) {
                throw new GraphQLError("Author name is too short", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.name
                    }
                });
            }

            try {
                await author.save();
            } catch (error) {
                throw new GraphQLError("Saving birthyear failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.setBornTo,
                        error
                    }
                })
            }
            return author;
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

            return user.save()
                .catch(error => {
                    throw new GraphQLError("Creating the user failed", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                            invalidArgs: args.username,
                            error
                        }
                    })
                });
        },
        login: async (root, args)=>{
            const user = await User.findOne({ username: args.username });

            if (!user || args.password !== "secret") {
                throw new GraphQLError("wrong credentials", {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id
            }

            return { value: jwt.sign(userForToken, process.env.SECRET) }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
            const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
        }
    }
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
});