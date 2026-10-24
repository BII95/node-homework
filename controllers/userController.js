
function register(req, res) {
  const userCredentials = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  global.users.push(userCredentials)
  global.user_id=userCredentials;
  
  res.status.json(201).json({
    name: res.body.name,
    email: res.body.email
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
 