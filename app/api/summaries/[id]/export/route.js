import { NextResponse } from "next/server";
import { Summary } from "@/db/models";
import { collectcashbookData } from "@/functions/summaries";
import { buildSummaryWorkbook } from "@/lib/Summaryexport";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const summary = await Summary.findOne({
      where: {
        summary_id: id,
      },
    });

    if (!summary) {
      return NextResponse.json(
        { error_message: "Summary not found" },
        { status: 404 },
      );
    }

    const rs = await collectcashbookData(
      summary.period_start,
      summary.period_end,
    );

    const buffer = await buildSummaryWorkbook({
      ...rs,
      summary: summary.toJSON(),
    });

    // Gamitin ang native Response, hindi NextResponse — mas reliable para sa binary
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="summary-${id}.xlsx"`,
      },
    });
  } catch (err) {
    console.log(err.message);
    return NextResponse.json({ error_message: err.message }, { status: 500 });
  }
}
