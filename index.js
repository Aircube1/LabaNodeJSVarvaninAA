const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const TodoTask = require("./models/TodoTask");

async function main() {
    dotenv.config();

    app.use("/static", express.static("public"));
    
    app.use(express.urlencoded({ extended: true }));
    
    await mongoose.connect(process.env.DB_CONNECT).then((response) => {
        console.log("Connected to db!");
    }).catch((error) => {
        console.log(error);
    });
    
    app.set("view engine", "ejs");
    
    app.get("/", (req, res) => {
        TodoTask.find({}).then((tasks) => {
            res.render("todo.ejs", { todoTasks: tasks });
        }).catch((error) => console.log(error));
    });
        
    
    //POST METHOD
    app.post('/',async (req, res) => {
        const todoTask = new TodoTask({
        content: req.body.content
        });
        try {
        await todoTask.save();
        res.redirect("/");
        } catch (err) {
        res.redirect("/");
        }
    });
    
    
    //UPDATE
    app
    .route("/edit/:id")
    .get((req, res) => {
    const id = req.params.id;
        TodoTask.find({}).then((tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        }).catch((error) => console.log(error));
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }).then(() => {
            res.redirect("/");
        }).catch(() => {
            return res.send(500, err);
        });
    });
    
    //DELETE
    app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndDelete(id, { content: req.body.content }).then(() => {
            res.redirect("/");
        }).catch(() => {
            return res.send(500, err);
        });
    });

    app.listen(3000, () => console.log("Server Up and running"));
}

main().catch((error) => {
    console.log(error);
})