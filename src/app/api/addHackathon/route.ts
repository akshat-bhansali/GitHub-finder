
import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import { NextResponse } from "next/server";

export async function POST(request:any) {
  const { deadline, link,description,name } = await request.json();
  await connect();
  await Hackathon.create({ deadline:deadline, link:link,description:description,name:name });
  return NextResponse.json({ message: "Hackathon Created" }, { status: 201 });
}

// export async function GET() {
//   await connect();
//   const hackathons = await Hackathon.find();
//   return NextResponse.json({ hackathons });
// }

// export async function DELETE(request:any) {
//   const id = request.nextUrl.searchParams.get("id");
//   await connect();
//   await Hackathon.findByIdAndDelete(id);
//   return NextResponse.json({ message: "Hackathon deleted" }, { status: 200 });
// }