const User = require("../models/UserShema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.registerUser = async( req, res , next) =>{

    const {username, password} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10)
    let checkuserName = await User.findOne({username})
    
    if(checkuserName){
        return res.status(300).json({message: "User đã tồn tại"})
    }else{
        let user = await User.create({
            username,
            password : hashedPassword
        }).then(user =>{
            return res.status(200).json({message: "register user successfully"})
        }).catch(error =>{
            res.status(400).json(error)
        })
    }
  
}

module.exports.login = async( req, res , next) =>{

    const {username, password} = req.body;

   await User.findOne({username}).then(user =>{
        if(user){
            console.log(user)
            bcrypt.compare(password , user.password, function(err, result){
                if(err){
                    return res.status(400).json({error: err})

                }
                if(result){
                    let token = jwt.sign({username}, 'verySecretValue', {expiresIn : '1h'})
                    return res.status(200).json({message : "Login successfully ", token })
                }
                else{
                    return res.status(400).json({message : "Password is wrong"})
                }

            })
        }else{
            return res.status(400).json({message : "No user found"})
        }
    })


  
}