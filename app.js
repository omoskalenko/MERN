const express = require('express')
const config  = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true}))
app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5001

async function start() {
  try {
     //подключение к бд
    await  mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
  } catch(error) {
    console.log('Server error', error.message)
    process.exit(1)
  }
}

start()


