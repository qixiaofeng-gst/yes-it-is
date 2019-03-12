const express = require('express')
const bp = require('body-parser')
const fs = require('fs')

const working_state = {
  working: true,
  temp: true,
}
for (const k in working_state) {
  working_state[k] = k
}
const file_suffix = '.txt'
const file_name = `${working_state.working}${file_suffix}`

const app = express()
const app_port = 8001

const nums = {
  increment: 0,
}

app.post('/', bp.json(), (req, res) => {
  const { body: { text } } = req
  
  if (text) {
    nums.increment += text.length
    fs.appendFileSync(file_name, text)
  }
  
  const stats = fs.statSync(file_name, { bigint: false })
  console.log(`Access YII at ${new Date().toLocaleString()}`)
  res.json({
    nums,
    stats,
    state: working_state.working,
  })
})

app.listen(app_port, () => {
  console.log(`Server listening ${app_port}. Start at ${new Date().toLocaleString()}`)
})
