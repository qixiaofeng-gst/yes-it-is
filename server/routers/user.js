const user = require('express')()
const body_parser = require('body-parser')
const { ObjectID:OID } = require('mongodb')

const { user: t_user } = require('../libs/db')

user.post('/', body_parser.json(), ({ body, sessions }, res) => {
	const { email, password } = body
	t_user.get({ email, password }).then(entry => {
		if (entry) {
			res.json({
				success: true,
				session: sessions.set(entry._id, {
					user: entry
				})
			})
		} else {
			console.log(`An user failed to login with ${email}|${password}`)
			res.json({
				success: false
			})
		}
	}).catch(error => {
		res.json({
			success: false
		})
	})
})

module.exports = user
