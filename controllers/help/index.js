const Router = require("express").Router();
const { HelpDoc } = require("../../models/Help");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
// const auth = require("../middleware").auth;
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        const dir = "./assets/admin/blogfiles/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cd(null, dir);
    },
    filename: (req, file, cd) => {
        cd(null, crypto.randomBytes(10).toString("hex") + file.originalname);
    },
});
let uploadFile = multer({
    storage: storage,
});

Router.get("/", async(req, res) => {
    try {
        const helps = await HelpDoc.find();
        return res.json({ success: true, data: helps });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});
Router.get("/query", async(req, res) => {
    try {
        let query = req.query["value"];
        const helps = await HelpDoc.find({
            title: { $regex: `.*${query}.*`, $options: "i" },
        });
        return res.json({ success: true, data: helps });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});
Router.get("/tags", async(req, res) => {
    try {
        let tagValue = req.query["value"];
        let tagArray = tagValue.split(",");
        const helps = await HelpDoc.find({ tags: { $in: tagArray } });
        return res.json({ success: true, data: helps });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});
// router.post("/uploadfiles",uploadFile.any(), (req, res, error) => {
//   return res.status(200).json({ success: true, filename: req.files[0].filename });
// });

Router.post("/", async(req, res) => {
    try {
        console.log("body", req.body);
        const { title, description, tags } = req.body;
        //const files = req.files;
        let helpValue;
        console.log(req.body);
        if (req.body.files != null) {
            helpValue = {
                title: title,
                content: req.body.content,
                files: req.body.files,
                tags: tags,
            };
        } else {
            helpValue = {
                title: title,
                content: req.body.content,
                tags: tags,
            };
        }
        /*if(files)
        {
           picurl = files.map((file) => ({ url: file.path }));
        }*/
        const help = await HelpDoc.create(helpValue);
        return res
            .status(201)
            .json({ success: true, msg: "Help created", data: help });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});

Router.delete("/:helpid", async(req, res) => {
    try {
        const { helpid } = req.params;
        await HelpDoc.findByIdAndDelete(helpid);
        return res.json({ success: true, msg: "Deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});

Router.put("/:id", (req, res) => {
    const helpid = req.params.id;
    let help = req.body;

    HelpDoc.findOneAndUpdate({ _id: helpid }, help)
        .then((result) => {
            return res.json({ help: result, success: true });
        })
        .catch((err) => {
            console.log(err);
            return res.json({ success: false, error: err });
        });
});
module.exports = Router;