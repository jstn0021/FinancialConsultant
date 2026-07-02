import { Check } from "@/db/models";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { voucherId } = await params;

  // reject
  try {
    await Check.update(
      {
        isRejected: true,
      },
      { where: { id: voucherId } },
    );
    return NextResponse.json({ message: "Voucher Rejected" }, { status: 200 });
  } catch (err) {
    console.log(err.message);
    return NextResponse.json({ error_message: err.message }, { status: 500 });
  }
}
