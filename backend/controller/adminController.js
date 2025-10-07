const adminController = {}

// Minimal login stub — replace with DB lookup and password checks
adminController.login = async (req, res) => {
  const { email, password } = req.body || {}
  // This is a stub: accept any email/password for now and return a fake token
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  // In a real app: verify credentials, sign a JWT with admin role
  const fakeToken = Buffer.from(`${email}:${Date.now()}`).toString('base64')
  return res.status(200).json({ token: fakeToken, admin: { email } })
}

adminController.status = async (req, res) => {
  return res.json({ status: 'ok', time: new Date().toISOString() })
}

module.exports = adminController
