module.exports = {
    userAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();

        }
        
        req.flash("success_msg","Sign in to access this area")
        res.redirect("/")
    }
        
    



}