const task = require('express')()
const body_parser = require('body-parser')
const {
  ObjectID
} = require('mongodb')

const {
  task: t_task
} = require('../libs/db')

task.post('/', body_parser.json(), ({ body, session }, res) => {
  const { user: { _id: user_id } } = session
	const { _id } = body
  if (_id) {
    const to_update = {
      ...body
    }
    delete to_update._id
    delete to_update.user_id
    const query = {
      _id: new ObjectID(_id)
    }
    t_task.update(
      query, to_update
    ).then(result => {
      res.json({
        success: true,
        _id
      })
    }).catch(error => {
      res.json({
        success: false
      })
    })
  } else {
    t_task.insert({
      ...body,
      user_id
    }).then(({ _id }) => {
      res.json({
        success: true,
        _id
      })
    }).catch(error => {
      res.json({
        success: false
      })
    })
  }
})

task.post('/list', body_parser.json(), ({ body, session }, res) => {
  const { user: { _id: user_id } } = session
  t_task.list({
    user_id,
    is_cleared: false,
    ...body
  }).then(tasks => {
    res.json({
      success: true,
      tasks
    })
  }).catch(error => {
    res.json({
      success: false
    })
  })
})

module.exports = task
