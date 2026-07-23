const express = require('express');
const { hashPassword } = require('../auth');

const router = express.Router();
const users = [];

router.post('/', async (req, res) => {
  const { name, password } = req.body;
  const passwordHash = await hashPassword(password);
  const user = { id: users.length + 1, name, passwordHash };
  users.push(user);
  res.status(201).json({ data: { id: user.id, name: user.name } });
});

module.exports = router;
