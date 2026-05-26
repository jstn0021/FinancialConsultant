import { Check } from "@/db/models";
import { GetFilterizeVoucher } from "@/functions/vouchers";
import { NextResponse } from "next/server";

//  const isChiefAccountant = role === "Chief Accountant";
//  const isChiefAdministrator = role === "Chief Admin";
export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  return await GetFilterizeVoucher(
    "Chief Accountant",
    searchParams.get("dateStart"),
    searchParams.get("dateEnd"),
    page,
    limit,
  );
}
export async function POST(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const body = await request.json();
    const id = searchParams.get("VRID");
    // FIND
    const voucher = Check.findByPk(id);
    if (!voucher) {
      return NextResponse.json({ error_message: "Record Not Found" });
    }
    //await
    (await voucher).update({ ChiefAccountSignature: body.e_sign });
    return NextResponse.json(
      { message: "Successfully Approved" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error_message: err.message }, { status: 500 });
  }
}
