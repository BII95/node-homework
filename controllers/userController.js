const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
// const util = require("util");
// const scrypt = util.promisify(crypto.scrypt);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return`${salt}:${hash}`;
}

function comparePassword(inputPassword, storedHash) {
  const [savedSalt, savedHash] = storedHash.split(":");
  const hashToCheck = crypto
    .scryptSync(inputPassword, savedSalt, 64)
    .toString("hex");
   return crypto.timingSafeEqual(
    Buffer.from(hashToCheck, "hex"),
    Buffer.from(savedHash, "hex")
  );
}

function register(req, res) {
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details });
  }
  const hashedPassword=hashPassword(value.password);
  const newUser = {
    name: value.name,
    email: value.email,
    hashedPassword: hashedPassword,
  };
  global.users.push(newUser);
  global.user_id = newUser;

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
}
function logon(req, res) {
  const user = global.users.find(
    (user) =>
      user.email === req.body.email
  );
  if (!user || !comparePassword(req.body.password,user.hashedPassword)) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }
  global.user_id = user;

  return res.status(200).json({
    name: user.name,
    email: user.email,
  });
}

function logoff(req, res) {
  global.user_id = null;
  return res.status(200).json({ message: "Logged off" });
}

module.exports = { logon, logoff, register };
