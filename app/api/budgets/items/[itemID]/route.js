import { BudgetItems } from "@/db/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { itemID } = await params;
  try {
    const item = await BudgetItems.findByPk(itemID, {
      attributes: ["json_detailed"],
    });
    if (!item) {
      return NextResponse.json(
        {
          message: "item not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        item,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error_message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const { json_detailed, total } = body;
  const { itemID } = await params;
  try {
    const UpdateItem = await BudgetItems.update(
      { json_detailed, total },
      {
        where: {
          id: itemID,
        },
      },
    );
    return NextResponse.json({ UpdatedInfo: UpdateItem }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error_message: err.message,
      },
      { status: 500 },
    );
  }
}
