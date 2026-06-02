import { CashBooks } from "@/db/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { dateRangeStart, dateRangeEnd, category, currency } = body;
  try {
    const cashbooks = await CashBooks.create({
      dateRangeStart,
      dateRangeEnd,
      currency,
      category,
    });

    return NextResponse.json({ message: cashbooks }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error_message }, { status: 500 });
  }
}
