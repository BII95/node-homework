const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
// const util = require("util");
// const scrypt = util.promisify(crypto.scrypt);
const pool = require("../db/pg-pool");

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
  value.hashed_password=hashPassword(value.password)
  let result = null;

  try {
    result = await pool.query(
      `INSERT INTO users (email, name, hashed_password)
       VALUES ($1, $2, $3) RETURNING id, email, name`,
      [value.email, value.name, value.hashed_password],
    );
  } catch (e) {
    if (e.code === "23505") {
      // unique constraint on email was violated
      return res.status(400).json({ message: "email already registered" });
    }
    return next(e);
  }

  const user = result.rows[0];
  global.user_id = user.id;

  res.status(201).json({
    name: user.name,
    email: user.email,
  });
}
async function logon(req, res) {
    if (!req.body) req.body = {};
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const user = result.rows[0];
    if (!comparePassword(password, user.hashed_password)) {
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

module.exports = { logon, logoff, register };
