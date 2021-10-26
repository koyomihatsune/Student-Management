const { v4: uuidv4 } = require('uuid');
const Configs = require('./../../configs/Constants')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const hash = require('sha256')
function register(req, res) {
    global.DBConnection.LoginInfo.findOne({"username": req.body.username},async (err, instance) => {
        if (instance != null) {
            console.log(req.body.username);
            res.status(409);
            res.json({"Status":"Error", "message": "Username is already registered by someone"})
        } else {
            try {
                let newUserLoginInfo = new global.DBConnection.User({
                    vnu_id : req.body.vnu_id ? req.body.vnu_id : uuidv4(),
                    name: req.body.name,
                    role: req.body.role,
                    email: req.body.email,
                    date_of_birth: req.body.dateOfBirth
                })
                newUserLoginInfo = await newUserLoginInfo.save()
                let newToken = jwt.sign({vnu_id: newUserLoginInfo.vnu_id, createdDate: new Date().getTime()}, Configs.SECRET_KEY, {expiresIn: 3600});
                console.log("new token: ", newToken);
                let loginInfo = new global.DBConnection.LoginInfo({
                    user_ref : new ObjectId(newUserLoginInfo._id),
                    username: req.body.username,
                    password: req.body.password,
                    current_token: newToken,
                    current_socket_id: null,
                });
                
                await loginInfo.save()
                res.json({"status": "Success", "message":{"token" : loginInfo.current_token}})
            } catch (e) {
                res.status(400);
                res.json({"Status":"Error", "message": JSON.stringify(e.message)})
                return;
            }          
        }
    })

}

module.exports = {register};