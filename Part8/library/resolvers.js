const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

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
            const authors = await Author.find({});
            const books = await Book.find({}).populate("author");

            //Could also be done by adding a book reference in the author schema and then just obtaining the count of that array
            //would need to add the book reference to the author in the addBook mutation
            //bookCount: author.bookRef.length
            const authorsToReturn = authors.map(author => ({
                name: author.name, born: author.born || null,
                bookCount: books.filter(book => book.author.name === author.name).length
            }));

            return authorsToReturn;
        },
        me: (root, args, context) => {
            return context.currentUser;
        }
    },
    /*Author: {
        bookCount: async (root, args) => {
            return await Book.collection.countDocuments({ author: { $exists: root.id } });
        }
    },*/
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

                pubsub.publish("BOOK_ADDED", { bookAdded: book });

                return book;
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
        login: async (root, args) => {
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
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED")
        }
    }
};

module.exports = resolvers;