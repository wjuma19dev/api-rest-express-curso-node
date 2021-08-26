const express = require('express');
const morgan = require('morgan');
const Joi = require('joi');
const app = express();
const config = require('config');
const errorhandler = require('errorhandler');
const debug = require('debug')('app:inicio');
// const dbDebug = require('debug')('app:db');
// const logger = require('./middlewares/logger');

const { isPost } = require('./helpers');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
// app.use(morgan('tiny'));

console.log('Aplicacion:', config.get('nombre'));
console.log('DB Server:', config.get('configDB.host'));


let posts = [
    {id: 1, title: 'A first post', content: 'This is a first post'},
    {id: 2, title: 'A second post', content: 'This is a second post'},
];

if (app.get('env') === 'development') {
    app.use(morgan('dev'));
    debug('Morgan esta habilitado.');
}

// Trabajando con la base de datos
debug('DB connected successfully!')

app.get('/', (req, res) => {
    res.send("Hello world!");
});

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {

    const schema = Joi.object({
        id: Joi.number()
            .required(),
        title: Joi.string()
            .min(5)
            .required(),
        content: Joi.string()
            .required()
    });

    const { value, error } = schema.validate({ id: posts.length + 1, title: req.body.title, content: req.body.content });

    if (error) {
        let message = error.details[0].message;
        return res.status(400).json({
            statusCode: 400,
            error: {
                message
            }
        });
    }

    posts.push(value);
    res.json(value);

});

app.patch('/posts/:postId', (req, res) => {

    let post = isPost(posts, req.params.postId);

    if(!post) {
        return res.status(404).json({
            statusCode: 404,
            error: {
                message: 'Post does not exist!'
            }
        });
    }

    const schema = Joi.object({
        title: Joi.string()
            .min(5)
            .required(),
        content: Joi.string()
            .required()
    });

    const {error, value} = schema.validate({
        title: req.body.title,
        content: req.body.content
    });

    if (error) {
        let message = error.details[0].message;
        return res.status(400).json({
            statusCode: 400,
            error: {
                message
            }
        });
    }

    post.title = value.title;
    post.content = value.content;
    
    res.status(201).json({
        message: 'Post updated successfully'
    });

});

app.delete('/posts/:postId', (req, res) => {
    const post = isPost(posts, req.params.postId);
    if(!post) {
        return res.status(404).json({
            statusCode: 404,
            error: {
                message: 'Post does not exist!'
            }
        });
    }
    const index = posts.indexOf(post);
    posts.splice(index, 1);
    res.status(201).json({
        message: 'Post deleted successfully'
    });
})

app.listen(
    3000,
    () => console.log('Server running on port 3000')
);