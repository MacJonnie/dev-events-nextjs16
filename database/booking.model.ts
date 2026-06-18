import {
  Schema,
  model,
  models,
  Model,
  Document,
  Types,
} from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index eventId to improve lookup performance
bookingSchema.index({ eventId: 1 });

// Validate event existence and email format
bookingSchema.pre("save", async function () {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(this.email)) {
    throw new Error("Invalid email address.");
  }

  const eventExists = await Event.exists({
    _id: this.eventId,
  });

  if (!eventExists) {
    throw new Error("Referenced event does not exist.");
  }

});

const Booking: Model<IBooking> =
  models.Booking ||
  model<IBooking>("Booking", bookingSchema);

export default Booking;
