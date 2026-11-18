const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
// const util = require("util");
// const scrypt = util.promisify(crypto.scrypt);
const prisma = require("../db/prisma");

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

async function register(req, res,next) {
  if (!req.body) req.body = {};
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details });
  }
  value.hashedPassword = await hashPassword(value.password);
  delete value.password;

  try {
    const user = await prisma.user.create({
      data: {
        name: value.name,
        email: value.email,
        hashedPassword: value.hashedPassword,
      },
      select: { name: true, email: true, id: true }, // specify the column values to return
    });
    global.user_id = user.id;

    res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === "PrismaClientKnownRequestError" && err.code === "P2002") {
      return res.status(409).json({ message: "Email already registered" });
    }
    return next(err); // all other errors go to the error handler
  }
}
async function logon(req, res) {
    if (!req.body) req.body = {};
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const emailToLower=email.toLowerCase();

    const user = await prisma.user.findUnique({
      where:{email:emailToLower}
    });  
    if (!user){
      return res.status(401).json({message:"Invalid credentials"})
    }
    if (!(await comparePassword(password, user.hashedPassword))) {
      return res.status(401).json({ message: "invalid credentials" });
    }
  
  global.user_id = user.id;

  return res.status(200).json({
    name: user.name,
    email: user.email,
  });
}

function logoff(req, res) {
  global.user_id = null;
  return res.status(200).json({ message: "Logged off" });
}

module.exports = { logon, logoff, register }