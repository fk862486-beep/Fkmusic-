const express = require("express");
const router = express.Router();


router.get("/login", (req,res)=>{
    res.render("login");
});


router.post("/login",(req,res)=>{

    const {username,password} = req.body;


    if(username === "Faizan" && password === "OWNER001"){

        req.session.loggedIn = true;
        req.session.user = "Faizan";
        req.session.role = "OWNER";


        return res.redirect("/admin");

    }


    if(username === "admin" && password === "admin123"){

        req.session.loggedIn = true;
        req.session.user = "Admin";
        req.session.role = "ADMIN";


        return res.redirect("/admin");

    }


    res.send(`
    <h2>❌ Login Failed</h2>
    <a href="/login">Try Again</a>
    `);


});


router.get("/logout",(req,res)=>{

    req.session.destroy();

    res.redirect("/login");

});


module.exports = router;
