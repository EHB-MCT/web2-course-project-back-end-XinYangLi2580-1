import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = express.Router()

function signUser(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing on the server");
  }
  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
}


/**
 * POST /api/auth/register
 * body: { email, password, username? }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, username = '' } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ ok: false, message: 'Email already used' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      username,
    })

    const token = signUser(user)

    res.json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, username: user.username },
    })
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Register failed', error: String(e) })
  }
})

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid credentials' })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ ok: false, message: 'Invalid credentials' })
    }

    const token = signUser(user)

    res.json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, username: user.username },
    })
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Login failed', error: String(e) })
  }
})

export default router
