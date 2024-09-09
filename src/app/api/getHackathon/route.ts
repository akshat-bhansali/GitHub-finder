import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();
  const hackathons = await Hackathon.find();

  // Create a new response object with cache-control headers set
  const response = NextResponse.json({ hackathons });
  
  // Set headers to disable caching
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');

  return response;
}
