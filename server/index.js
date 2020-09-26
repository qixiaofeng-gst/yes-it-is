const express = require('express')
const path = require('path')
const bp = require('body-parser')
const fs = require('fs')

const working_state = {
    working: true,
    temp: true,
}
for (const k in working_state) {
    working_state[k] = `${k}.txt`
}

const load_working_path = () => {
    // 1. Search specific path, check existance.
    const link_file_path = path.normalize(path.join(__dirname, '../working_path_link.txt'))
    try {
        // 3. Use the content as path if exists.
        const loaded_working_path = fs.readFileSync(link_file_path).toString('utf-8')
        fs.accessSync(path.dirname(loaded_working_path))
        working_state.working = loaded_working_path
    } catch (e) {
        // 2. Warning if does not exist.
        console.log(e.message)
        console.log('Failed to load/use link file. Use default working.txt.')
        console.log('You might create a working_path_link.txt file to specify a valid working file.')
    }
}
load_working_path()

const file_name = working_state.working

const app = express()
const app_port = 8001

const nums = {
    increment: 0,
}

// noinspection JSUnresolvedFunction for post
app.post('/s', bp.json(), (req, res) => {
    const {body: {text}} = req

    if (text) {
        nums.increment += text.length
        fs.appendFileSync(file_name, text)
    }

    const stats = fs.statSync(file_name, {bigint: false})
    console.log(`Access YII at ${new Date().toLocaleString()}`)
    res.json({
        nums,
        stats,
        state: working_state.working,
    })
})

const clientPath = path.normalize(path.join(__dirname, '../client'))
app.use('/write', express.static(clientPath))

app.listen(app_port, () => {
    console.log(`Server listening ${app_port}. Start at ${new Date().toLocaleString()}`)
    console.log(`Client path: ${clientPath}`)
})
