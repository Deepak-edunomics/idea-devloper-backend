const Router = require("express").Router();
const Blog = require('../../models/Blog/').Blog;
const path = require("path");
const fs = require('fs')
const multer = require("multer");
const crypto = require("crypto");
// const auth = require('../middleware').auth
// var blogJ = require('./sampleblog')
// var nss = require('node-suggestive-search').init({
//     dataBase: "mongodb",
//     mongoDatabase: "mongodb+srv://test1:xyz@123@cluster0.cedka.mongodb.net/sample1?retryWrites=true&w=majority", //please fill this
//     cache: true
// });

// var nss = require('node-suggestive-search').init({
//     dataBase: "mongodb",
//     mongoDatabase: "mongodb+srv://localhost:27017/sample1?retryWrites=true&w=majority", //please fill this
//     cache: true
// });

// const storage = multer.diskStorage({
//     destination: (req, file, cd) => {
//         const dir = "./assets/admin/blogfiles/";
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }
//         cd(null, dir);
//     },
//     filename: (req, file, cd) => {
//         cd(null, crypto.randomBytes(10).toString("hex") + file.originalname);
//     },
// });
// let uploadFile = multer({
//     storage: storage,
// });

// router.post("/uploadfiles", uploadFile.any(), (req, res, error) => {
//     return res.status(200).json({ success: true, filename: req.files[0].filename });
// });

// router.get("/getFile/:filename", (req, res) => {
//     return res.sendFile(path.resolve(__dirname + "../../../../assets/admin/blogfiles", req.params.filename));
// })
console.log("Blog");

Router.post("/add", (req, res, error) => {
    let blog;
    console.log(req.body)
    if (req.body.files != null) {
        blog = new Blog({
            title: req.body.title,
            blog_content: req.body.blog_content,
            files: req.body.files,
            tags: req.body.tags
        });
    } else {
        blog = new Blog({
            title: req.body.title,
            blog_content: req.body.blog_content
        });
    }
    blog.save().then(createdblog => {
            res.status(200).json({
                message: "Successfully pushed the blog"
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating a blog failed!'
            })
        });
})

Router.get("/", async(req, res, next) => {
    Blog.find({})
        .then((result) => {
            return res.status(200).json({ success: true, blogs: result });

        })
        .catch((error) => {
            next(error);
        });
});
// search by name
// let titleString=Blog.find({})
//     .then((result) => {
//         return res.status(200).json({ success: true, blogs: result});
//
//     }).catch((error) => {
//         next(error);
//     });
// nss.loadJson(titleString, "title").then(data => {
// //sample response will be received
// });

//

Router.get('/:id/:name', async(req, res) => {
    try {
        let query = req.params.name;
        // const helps= await HelpDoc.find({
        //     title: {$regex:}
        // });
        fs.readFile("./sampleblog.js", 'utf8', function(err, data) {
            var blogs = JSON.parse(data);
            var blog = blogs["blog" + req.params.id]
            var title = blog.title
                // console.log( blog.name);
            return res.json({ sucess: true, data: title })

        });
    } catch (err) {

        console.log(err);

        return res.status(500).json({ success: false, msg: "Server error" });

    }
})

Router.put("/:blog_id", (req, res) => {
    let updatedBlog = {
        title: req.body.title,
        blog_content: req.body.blog_content,
        files: req.body.files,
        uploadDate: req.body.uploadDate,
        tags: req.body.tags
    }

    Blog.findOneAndUpdate({ _id: req.params.blog_id }, updatedBlog)
        .then((result) => {
            return res.json({ blog: result, success: true });
        })
        .catch((err) => {
            console.log(err);
            return res.json({ success: false, error: err });
        });
});


// api to edit the blog .

Router.get("/:tags", (req, res) => {
    var blog = req.query.array.split(',');
    var i;
    let list1 = []
    for (i = 0; i < blog.length; i++) {
        Blog.find({ tags: blog[i] })
            .then((result) => {
                if (result.length > 0) {

                    list1.push(result);
                }

            })
            .catch((error) => {
                next(error);
            });
    }
    if (list1.length > 0)
        return res.status(200).json({ success: true, blogs: list1 });
    else
        return res.status(200).json({ success: false, msg: "No related posts" });


});


Router.delete("/", (req, res, next) => {
    Blog.findByIdAndRemove({ _id: req.body.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "unable to delete the blog"
            })
        } else {
            // filepath = path.join(__dirname, '../../../' + req.body.file);
            // console.log(filepath)
            // fs.unlinkSync(filepath)
            console.log("sucess")
            res.status(200).json({
                message: "Deleted successfully"
            })
        }
    })
})


// router.get("/:category_id", (req, res) => {
//   Blog.find({ categoryId: req.params.category_id })
//     .then((result) => {
//       if (result.length > 0) {
//         return res.status(200).json({ success: true, blogs: result });
//       } else {
//         return res.status(200).json({ success: false, msg: "No blogs found" });
//       }
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// router.post("/", async (req, res, next) => {
//   let blog = req.body;
//   Blog.create(blog)
//     .then((result) => {
//       if (result._id) {
//         res.json({ success: true, msg: "Blog added" });
//       } else {
//         res.json({ success: false, msg: "Some error occured" });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       next(error);
//     });
// });

// router.delete("/:blog_id", (req, res) => {
//   const blog_id = req.params.blog_id;
//   Blog.deleteOne({ _id: blog_id }).then((result) => {
//     return res
//       .status(200)
//       .json({ message: "blog deleted", success: true, data });
//   });
// });

Router.put("/:blog_id", (req, res) => {
    let blog = req.body;

    Blog.findOneAndUpdate({ _id: req.params.blog_id }, blog)
        .then((result) => {
            return res.json({ blog: result, success: true });
        })
        .catch((err) => {
            console.log(err);
            return res.json({ success: false, error: err });
        });
});




module.exports = Router;