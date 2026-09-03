'use server';

import { connectToDatabase } from "@/lib/mongodb";
import Event  from "@/database/event.model";



export const getSimilarEventsBySlug = async(slug: string) =>{
    try{
        await connectToDatabase();

        const event = await Event.findOne({slug}).lean();

        if(!event) return [];

        const similarEvents = await Event.find({ _id: { $ne: event._id}, tags: {$in: event.tags}, }).lean();

        return similarEvents.map((event) => ({
            ...event,
            _id: event._id.toString(),
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }));
    } catch(error) {
        console.error("Error fetching similar events:", error);
        return [];
    }
}