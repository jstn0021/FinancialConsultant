import { cashbooks } from "@/functions/cashbook";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cash = await cashbooks("CASH PHP");

  return NextResponse.json({ cash }, { status: 200 });
}
