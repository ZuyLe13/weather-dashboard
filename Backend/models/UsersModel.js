import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  confirmed: { type: Boolean, default: false },
  token: { type: String },
}, { timestamps: true })

const UsersModel = mongoose.model('Users', usersSchema)
export default UsersModel