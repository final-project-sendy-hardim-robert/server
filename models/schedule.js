const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScheduleSchema = new Schema({
  startTime: String,
  finishTime: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Schedule = mongoose.model('Schedule', ScheduleSchema)

module.exports = Schedule