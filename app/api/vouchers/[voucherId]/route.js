import { Check, CheckItem } from "@/db/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { voucherId } = await params;
  try {
    const specificCheck = await Check.findOne({
      where: { checkId: voucherId },
      include: [
        {
          model: CheckItem,
          as: "items",
          where: {
            parent_id: null,
          },
          required: false,
          include: [
            {
              model: CheckItem,
              as: "children",
            },
          ],
        },
      ],
    });
    return NextResponse.json({ specificCheck }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error_message: err.message }, { status: 500 });
  }
}
