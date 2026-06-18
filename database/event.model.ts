import {
  Schema,
  model,
  models,
  Model,
  Document,
} from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "Agenda must contain at least one item.",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "Tags must contain at least one item.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug and normalize date/time before saving
eventSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  const parsedDate = new Date(this.date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid event date.");
  }

  this.date = parsedDate.toISOString();

  const normalizedTime = this.time.trim().toUpperCase();

  const timeRegex =
    /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/;

  if (!timeRegex.test(normalizedTime)) {
    throw new Error(
      "Time must be in hh:mm AM/PM format."
    );
  }

  this.time = normalizedTime;
});

eventSchema.index({ slug: 1 }, { unique: true });

const Event: Model<IEvent> =
  models.Event || model<IEvent>("Event", eventSchema);

export default Event;
