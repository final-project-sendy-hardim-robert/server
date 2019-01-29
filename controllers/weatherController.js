const axios = require('axios');
const redis = require("redis"),
    client = redis.createClient();
module.exports = {
  getWeatherData(req, res) {
    client.get('weathers' + req.currentUser._id, (err, reply) => {
      if (reply) {
        console.log('masuk sini ga cui')
        res.status(200).json({
          info: 'Successfully get weather data',
          data: JSON.parse(reply)
        })
      } else {
        const {latitude, longitude } = req.query;
        console.log(latitude, longitude, 'masuk ga coi')
        axios({
          method: 'get',
          url: `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=e585a530fc2f3c6a2dca7e7cf53b1b06`
        })
          .then(({ data }) => {
            client.set('weathers' + req.currentUser._id, JSON.stringify(data.list), 'EX', 600)
            res.status(200).json({
              info: 'Successfully get weather data',
              data: data.list
            })
          })
          .catch((err) => {
            console.log(err)
            res.status(500).json({
              info: 'failed to get data',
              err: err
            })
          })
      }
    })
  },

  getWeatherNow(req, res) {
    client.get('weatherNow' + req.currentUser._id, (err, reply) => {
      if (reply) {
        res.status(200).json({
          info: 'Successfully get weather data',
          data: JSON.parse(reply)
        })
      } else {
        const {latitude, longitude } = req.query;
        axios({
          method: 'get',
          url: `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=e585a530fc2f3c6a2dca7e7cf53b1b06`
        })
          .then(({ data }) => {
            client.set('weatherNow' + req.currentUser._id, JSON.stringify(data), 'EX', 600)
            res.status(200).json({
              info: 'Successfully get weather data',
              data: data
            })
          })
          .catch((err) => {
            res.status(500).json({
              info: 'failed to get data',
              err: err
            })
          })
      }
    })
  }
}