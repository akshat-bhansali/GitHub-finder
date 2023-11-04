
import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import { NextResponse } from "next/server";

export async function DELETE(request:any) {
    const id = request.nextUrl.searchParams.get("id");
    await connect();
    await Hackathon.findByIdAndDelete(id);
    return NextResponse.json({ message: "Hacakathon deleted" }, { status: 200 });
  }
