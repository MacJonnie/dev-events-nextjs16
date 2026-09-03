import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/database/event.model";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    // Connect to the database before querying the Event model.
    await connectToDatabase();

    const { slug } = await params;

    // Validate that slug exists and is a non-empty string.
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid event slug is required.",
        },
        { status: 400 }
      );
    }

    const eventSlug = slug.trim().toLowerCase();

    // Find the event using its unique slug.
    const event = await Event.findOne({ slug: eventSlug }).lean();

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: `Event with slug "${eventSlug}" not found.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event fetched successfully.",
        event,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/events/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while fetching the event.",
      },
      { status: 500 }
    );
  }
}