const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const mongoose = require("mongoose");
mongoose.set('strictQuery',true);

mongoose.connect("mongodb://127.0.0.1:27017/blogDB",{useNewUrlParser : true});

const blogSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Blog = mongoose.model("Blog",blogSchema);

const Day_1 = new Blog({
    title : "Day 1",
    content : "Mauris et malesuada libero, et tristique dolor. Nam condimentum sapien at magna faucibus bibendum. Nullam quis finibus felis, a pulvinar quam. Phasellus id elit imperdiet, venenatis arcu nec, pulvinar metus. Nulla luctus sollicitudin massa. Nullam odio sem, fermentum non suscipit ut"
});

const Day_2 = new Blog({
    title : "Day 2",
    content : "Vestibulum non pretium eros. Nunc et felis sodales, luctus nisi et, blandit diam. Mauris scelerisque libero diam, vel commodo nunc faucibus sit amet. Nulla justo tellus, bibendum vitae nisi eget, pretium laoreet libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In volutpat ipsum in est lacinia rutrum. Ut luctus ipsum ut nisl rutrum lacinia. Duis tortor sapien, fringilla et imperdiet auctor, congue et mi. Aenean a mattis nunc. Sed ornare risus ac lorem gravida, et sollicitudin ex gravida. Quisque rutrum, massa quis dictum finibus, urna enim vestibulum ex, eget placerat mauris turpis vel quam."
});

const defaultBlogs = [Day_1,Day_2];

app.get("/",function(req,res){
    Blog.find({},function(err,foundBlogs){
        if (foundBlogs.length === 0){
            Blog.insertMany(defaultBlogs,function(err){
                if(err) throw err;
                else console.log("Default items loaded successfully");
            });
            res.redirect("/");
        }
        else{
            if (err) throw err;
            else{
                res.render("content",{
                    blog_array : foundBlogs,
                });    
            }
        }
    });
});
app.get("/posts/:postName",function(req,res){
    const titleName = _.toLower(_.lowerCase(req.params.postName));
    console.log(titleName);
    Blog.find({},function(err,foundBlogs){
        if(err) throw err;
        else{
            for(let index = 0;index < foundBlogs.length;index++){
                storedName = _.toLower(_.lowerCase(foundBlogs[index].title));
                console.log(storedName);
                if(titleName === storedName){
                    console.log("match found");
                    res.render("blog",{
                        blog_head : foundBlogs[index].title,
                        blog_content : foundBlogs[index].content
                    });
                }
            }
        }
    });
});
app.get("/about",function(req,res){
    res.render("about");
});

app.get("/contact",function(req,res){
    res.render("contact");
});

app.get("/compose",function(req,res){
    res.render("compose");
});

app.post("/compose",function(req,res){
    const newBlog = new Blog({
        title : req.body.new_blog_title,
        content : req.body.new_blog_content
    });
    newBlog.save();
    res.redirect("/");
});

app.listen("5000",function(){
    console.log("Server started on port : 5000");
});