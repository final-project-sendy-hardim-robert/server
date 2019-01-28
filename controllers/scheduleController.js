const Schedule = require('../models/schedule');
const { getSchedule } = require('../helper/userHelper');
var CronJobManager = require('cron-job-manager');
const manager = new CronJobManager();

class ScheduleController {

  static create(req, res) {
    getSchedule(req.currentUser._id)
      .then(data => {
        if (data) {
          data.startTime = req.body.start
          data.finishTime = req.body.finish
          data.active = req.body.active
          data.save()
          return data
        } else {
          return Schedule.create({
            startTime: req.body.start,
            finishTime: req.body.finish,
            active: false,
            owner: req.currentUser._id
          })
        }
      })
      .then(schedule => {
        const keyStart = JSON.stringify(req.currentUser._id) + '_start'
        const keyStop = JSON.stringify(req.currentUser._id) + '_finish'
        if (manager.exists(keyStart)) {
          manager.stop(keyStart)
          manager.stop(keyStop)
        }
        res.status(201).json({
          info: 'schedule saved',
          data: schedule
        })
      })
      .catch(err => {
        res.status(500).json({
          info: 'Internal Server Error'
        })
      })
  }

  static async getScheduleByOwner(req, res) {
    const data = await getSchedule(req.currentUser._id)
    console.log(data)
    data ? res.status(200).json(data) : res.status(200).json(null)
  }

  static stopTask(req, res) {
    const key = JSON.stringify(req.currentUser._id)
    if (manager.exists(key + '_start')) {
      manager.stop(key + '_start')
      manager.stop(key + '_finish')
    }
    getSchedule(req.currentUser._id)
      .then(data => {
        if (data) {
          data.active = false
          return data.save()
        }
      })
      .then(() => {
        res.status(200).json('task is stoped')
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static startTask(req, res) {
    getSchedule(req.currentUser._id)
      .then(data => {
        let startTime = ['10', '0']
        let finishTime = ['17', '0']
        if (data) {
          startTime = data.startTime.split(':')
          finishTime = data.finishTime.split(':')
          data.active = true
          data.save()
          const key = JSON.stringify(req.currentUser._id)
          manager.add(key + '_start', '* * * * * *', () => {
            console.log('CRON JOB RUNNING', startTime);
          })
          manager.add(key + '_finish', '* * * * * *', () => {
            console.log('CRON JOB RUNNING', finishTime);
          })
          manager.start(key + '_start')
          manager.start(key + '_finish')
          res.status(200).json('task is started')
        } else {
          res.status(200).json('Please save the schedule first')
        }
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(500)
      })
  }

}
module.exports = ScheduleController
