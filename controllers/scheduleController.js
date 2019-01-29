const Schedule = require('../models/schedule');
const { getSchedule } = require('../helper/userHelper');
var CronJobManager = require('cron-job-manager');
const firebase = require('../firebase.js');
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
          info: err.message
        })
      })
  }

  static async getScheduleByOwner(req, res) {
    const data = await getSchedule(req.currentUser._id)
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
      // .catch(err => {
      //   res.status(500).json({
      //     error: 'internal server error'
      //   })
      // })
  }

  static startTask(req, res) {
    getSchedule(req.currentUser._id)
      .then(data => {
        let startTime = ''
        let finishTime = ''
        if (data) {
          startTime = data.startTime.split(':')
          finishTime = data.finishTime.split(':')
          data.active = true
          data.save()
          const key = JSON.stringify(req.currentUser._id)
          manager.add(key + '_start', `${startTime[1]} ${startTime[0]} * * *`, () => {
           firebase.database().ref(`Users/${req.currentUser._id}`).update({
             hangNow: true
           }) 
          })
          manager.add(key + '_finish', `${finishTime[1]} ${finishTime[0]} * * *`, () => {
            firebase.database().ref(`Users/${req.currentUser._id}`).update({
              hangNow: false
            })
          })
          manager.start(key + '_start')
          manager.start(key + '_finish')
          res.status(200).json('task is started')
        } else {
          res.status(200).json('Please save the schedule first')
        }
      })
      // .catch(err => {
      //   res.status(500).json({
      //     error: 'internal server error'
      //   })
      // })
  }

}
module.exports = ScheduleController
