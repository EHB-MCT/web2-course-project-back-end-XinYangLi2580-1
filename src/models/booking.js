import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    planetKey: { type: String, required: true },
    planetName: { type: String, required: true },

    travelDate: { type: String, required: true }, // "YYYY-MM-DD"

    seatType: { type: String, required: true }, // e.g. "Economy"
    extras: { type: [String], default: [] }, // e.g. ["Oxygen tank", "Window seat"]

    totalPriceEUR: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', BookingSchema)
