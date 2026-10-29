const {userSchema}= require("../validation/userSchema");

function register(req, res) {
  const {error,value}=userSchema.validate(req.body,{abortEarly:false})
  if (error){
    return res.status(400).json({message:error.details})
  }
  const userCredentials = {
    name: value.name,
    email: value.email,
    password: value.password,
  };
  global.users.push(userCredentials)
  global.user_id=userCredentials;
  
  res.status(201).json({
    name: userCredentials.name,
    email: userCredentials.email
  })
}
function logon(req,res) {
  const user =global.users.find(
    (user)=>
        user.email === req.body.email && 
        user.password === req.body.password
  );
  if (!user){
    return res.status(401).json({
        message: "invalid credentials"
    })
  }
  global.user_id = user;

return res.status(200).json({
    name: user.name,
    email:user.email
})
}


function logoff(req,res) {
    global.user_id=null
    return res.status(200).json({message:"Logged off"})
}

module.exports = { logon, logoff, register };
 