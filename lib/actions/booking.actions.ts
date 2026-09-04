'use server'

import { connectToDatabase } from "@/lib/mongodb";
import Booking  from "@/database/booking.model";

export const createBooking = async ({ eventId, slug, email}: { eventId: string, slug: string, email: string }) => {
    try{
        await connectToDatabase();

        const booking = await Booking.create({ eventId, slug, email });

        return {success: true, booking};
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, message: "Failed to create booking", error };
    }
}