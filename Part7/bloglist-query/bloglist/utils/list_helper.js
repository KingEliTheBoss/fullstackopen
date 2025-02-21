const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes;
    };
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
    const reducer = (max, item) => {
        return Math.max(max, item.likes);
    };

    const maxLikes = blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);

    if (maxLikes === 0) {
        return {}
    }

    const favoriteBlog = blogs.find(blog => blog.likes === maxLikes);
    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }

};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {};
    }

    const reducer = (count, item) => {
        count[item.author] = (count[item.author] || 0) + 1;
        return count;
    };

    const countsOfAuthors = blogs.reduce(reducer, {});
    const maxCount = Math.max(...Object.values(countsOfAuthors));
    const authorWithMostBlogs = Object.keys(countsOfAuthors).filter(author => countsOfAuthors[author] === maxCount);

    return {
        author: authorWithMostBlogs[0],
        blogs: maxCount
    };
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {};
    }

    const reducer = (count, item) => {
        count[item.author] = (count[item.author] || 0) + item.likes;
        return count;
    };

    const likesOfAuthors = blogs.reduce(reducer, {});
    const maxLikes = Math.max(...Object.values(likesOfAuthors));
    const authorWithMostLikes = Object.keys(likesOfAuthors).filter(author => likesOfAuthors[author] === maxLikes);

    return {
        author: authorWithMostLikes[0],
        likes: maxLikes
    };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}