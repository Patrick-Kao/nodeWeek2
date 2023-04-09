const http = require('http');
const mongoose = require('mongoose');
const Posts = require('./modules/post');
const headers = require('./headers');
const dotenv = require('dotenv');
const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');

dotenv.config({ path: '.env' });

const mongoURL = process.env.mongoURL.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

console.log(mongoURL);
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'testPost' // 替換為你要連接的資料庫名稱
}).then(() => console.log('資料庫連接成功'));
const requestListener = async (req, res) => {

    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })
    if (req.url == "/posts" && req.method == "GET") {
        const allPosts = await Posts.find();
        handleSuccess(res, allPosts);

    } else if (req.url == "/posts" && req.method == "POST") {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                if (data.name !== undefined && data.content !== undefined) {
                    const newPost = await Posts.create(
                        {
                            name: data.name,
                            content: data.content,
                            tags: data.tags,
                            image: data.image,
                            likes: data.likes,
                            comments: data.comments
                        }
                    );
                    handleSuccess(res, newPost);
                } else {
                    handleError(res)
                }

            } catch (err) {
                handleError(res, err)
            }
        })


    } else if (req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else if (req.url.includes("/posts") && req.method == 'PATCH') {


        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const id = decodeURIComponent(req.url.slice(7))
                const patch = await Posts.findByIdAndUpdate(id, {
                    name: data.name,
                    content: data.content,
                    tags: data.tags,
                    image: data.image,
                    likes: data.likes,
                    comments: data.comments

                })
                handleSuccess(res, patch);

            } catch (err) {
                handleError(res, err)
            }
        })
    } else if (req.url.includes("/posts") && req.method == 'DELETE') {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                console.log(data)
                const id = decodeURIComponent(req.url.slice(7))
                console.log(id)
                const patch = await Posts.deleteOne({ _id: id })
                handleSuccess(res, patch);

            } catch (err) {
                handleError(res, err)
            }
        })
    }

}
const server = http.createServer(requestListener);
server.listen(3000);