const server = require('./Routes/notes')
const port = process.env.PORT || 3000
const {warning, success, info} = require('./Utils/logger')


server.notes.listen(port, () => {
    success(`Server now running on port ${port}`)
})

