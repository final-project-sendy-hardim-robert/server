const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScheduleSchema = new Schema({
  startTime: {
    type: String,
    required: [true, 'Start Schedule time is required']
  },
  finishTime: {
    type: String,
    required: [true, 'Finish Schedule time is required']
  },
  active: Boolean,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Schedule = mongoose.model('Schedule', ScheduleSchema)

module.exports = Schedule