import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { connectToDatabase } from "@/lib/mongodb";
import Event  from "@/database/event.model";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});
// console.log("Cloudinary config:", cloudinary.config());
// console.log("CLOUDINARY_URL exists:", !!process.env.CLOUDINARY_URL);

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();
        console.log("Connected successfully.");
        

        const formData = await request.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries()); // Convert FormData to a plain object.
        } catch (error) {
            console.error("Error parsing form data:", error);
            return NextResponse.json({message: 'Invalid form data'}, {status: 400});
        }

        const file = formData.get('image') as File;
        console.log("Image:", file);
        console.log("Constructor:", file?.constructor?.name);
        console.log("instanceof File:", file instanceof File);

        if(!file) {
            return NextResponse.json({message: 'Image file is required'}, {status: 400});
        }

const tagsValue = formData.get("tags");
const agendaValue = formData.get("agenda");

if (typeof tagsValue !== "string" || typeof agendaValue !== "string") {
  return NextResponse.json(
    { message: "Tags and agenda are required." },
    { status: 400 }
  );
}

const tags = JSON.parse(tagsValue);
const agenda = JSON.parse(agendaValue);

if (!Array.isArray(tags) || !Array.isArray(agenda)) {
  return NextResponse.json(
    { message: "Tags and agenda must be arrays." },
    { status: 400 }
  );
}

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvents' }, (error, result) => {
                console.log("Cloudinary Error:", error);
                console.log("Cloudinary Result:", result);
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        });
        
       event.image = (uploadResult as {secure_url: string}).secure_url; // Assign the uploaded image URL to the event object.

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({message: 'Event created successfully', event: createdEvent}, {status: 201});

    } 

    catch (error) {
  console.error("FULL ERROR:", error);
  console.error("TYPE:", typeof error);
  console.error("STRING:", String(error));

  return NextResponse.json(
    {
      message: "Event creation failed",
      error,
    },
    { status: 500 }
  );
}
}

export async function GET () {
    try{
        await connectToDatabase()
        // console.log("Connected successfully.");

        const events = await Event.find().sort({ createdAt: -1})

        return NextResponse.json({ message: 'Events Fetched Successfully', events: events }, { status: 200 })
    } catch(error) {
        console.log(error)
        return NextResponse.json({ message: 'Fetching Events Failed', error: error }, { status: 500 });
    }
}

