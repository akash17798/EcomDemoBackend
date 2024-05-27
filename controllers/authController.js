const Auth = require('../models/auth')

exports.registerUser = (req, res) => {
    const {user_name, user_mobile, user_email, user_password, user_confirm_password } = req.body;
    const auth = new Auth(null, user_name, user_mobile, user_email, user_password, user_confirm_password);
    auth.save()
    .then(() => {
        res.redirect("/")
    })
    .catch((err)=>{
        console.error(err)
    })
}