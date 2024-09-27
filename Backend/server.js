import 'dotenv/config'
import cors from 'cors'
import crypto from 'crypto'
import cron from 'node-cron'
import express from 'express'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import UsersModel from './models/UsersModel.js'

const app = express()
const port = 3000
const baseApi = "http://api.weatherapi.com/v1"
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@weather-dashboard.rxcnf.mongodb.net/?retryWrites=true&w=majority&appName=weather-dashboard`

app.use(express.json(), cors())

// Tạo transporter để gửi email qua gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
})

// [GET] /api/forecast
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city
  const url = `${baseApi}/forecast.json?key=${process.env.API_KEY}&q=${city}&days=6&aqi=no&alerts=no`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// [POST] /api/register
app.post('/api/register', async (req, res) => {
  const { email } = req.body;

  // Kiểm tra xem email có tồn tại chưa
  try {
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Tạo token, user mới và lưu vào DB
    const token = crypto.randomBytes(20).toString('hex')
    const newUser = new UsersModel({
      email,
      confirmed: false,
      token,
    })
    await newUser.save();

    // Tạo URL xác nhận email
    const confirmationUrl = `http://localhost:3000/api/confirm-email?token=${token}&email=${email}`
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Confirm your subscription',
      html: `<h3>Please confirm your subscription by clicking the following link:<br/>${confirmationUrl}</h3>`
    }

    // Gửi email xác nhận
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send confirmation email' })
      }
      res.status(200).json({ message: 'Confirmation email sent' })
    })

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
})

// [GET] /api/confirm-email
app.get('/api/confirm-email', async (req, res) => {
  const { token, email } = req.query;

  try {
    // Tìm kiếm user có khớp với email và token không
    const user = await UsersModel.findOne({ email, token })
    if (!user) {
      return res.status(400).send('Invalid confirmation link.')
    }

    // Khi xác nhận email thì chuyển confirmed thành true
    user.confirmed = true
    await user.save()
    res.send('Email confirmed! You are now subscribed to daily weather updates.')

  } catch (error) {
    return res.status(500).send('Server error')
  }
})

// [DELETE] /api/unsubscribe
app.delete('/api/unsubscribe', async (req, res) => {
  const { email } = req.body;

  await UsersModel.deleteOne({ email });
  res.status(200).send('You have been unsubscribed.')
})

// Gửi email dự báo thời tiết cho user
async function sendWeatherForecast() {
  const url = `${baseApi}/current.json?key=${process.env.API_KEY}&q=VietNam&aqi=no`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    // Lấy dữ liệu thời tiết hiện tại và gửi cho tất cả user đã xác nhận email
    const data = await response.json()
    const users = await UsersModel.find({ confirmed: true })

    users.forEach(user => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email || process.env.EMAIL,
        subject: 'Daily Weather Forecast',
        html: `
        <h3>Today's weather in ${data.location.name}:</h3>
        <p>
        Last updated: ${data.current.last_updated}
        <br/>Temperature: ${data.current.temp_c}°C
        <br/>Wind: ${data.current.wind_kph} Km/h
        <br/>Humidity: ${data.current.humidity}%
        <br/>Have a great day ❤️.
        </p>
        `
      }

      // Gửi mail cho người dùng
      transporter.sendMail(mailOptions)
    })

  } catch (error) {
    console.log(error)
  }
}

// Set time gửi email vào 8:00AM hằng ngày
cron.schedule('0 7 * * *', () => {
  sendWeatherForecast()
});

// Connect DB
mongoose.set('strictQuery', false)
mongoose
  .connect(URI)
  .then(async () => {
    console.log('🚀 Successfully connected to MongoDB!')
    await new Promise(() => app.listen(port))
  })
  .catch((error) => console.error('MongoDB connection error:', error))