const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "未填寫姓名"]
        },
        content: {
            type: String,
            require: [true, "未填寫貼文內容"]
        },
        tags: {
            type: Array,

        },
        image: {
            type: String,
        },
        likes: {
            type: Number
        },
        comments: {
            type: Number
        }
    }

)
// 搜尋哪個collection，使用哪個schema
const posts = mongoose.model(
    'Post', postSchema

);
module.exports = posts;