const express = require('express')

const app = express()
const app_port = 3100

const ss = require('./libs/ss')

const sessions = new ss(0) // permenant, so never use sessions.clear()
const login_msg = { msg: 'login please' }
app.use((req, res, next) => { // Middleware to take care of sessions.
  const { query: { session }, path } = req
	
  console.log(`Accessing path: ${path} at ${(new Date()).toLocaleString()}.`)
	
  if ('/user' === path) {
		sessions.clear(session)
		req.sessions = sessions
    next()
    return
  }
  if (false === sessions.check(session)) {
    res.json(login_msg)
    return
  }

	req.session = sessions.get(session)
  next()
})

app.post('/', (req, res) => res.json({ message: 'Welcome to task manager.' }))
app.use('/user', require('./routers/user'))
app.use('/task', require('./routers/task'))

app.listen(app_port, () => {
  console.log(`Server listening ${app_port}. Start at ${new Date().toLocaleString()}`)
})
