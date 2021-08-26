const helpers = {}

helpers.isPost = (posts, postId) => {
    return posts.find(post => {
        return post.id === parseInt(postId);
    });
}

module.exports = helpers;