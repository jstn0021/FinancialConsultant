/**
 * app/api/checks/[voucherId]/export/route.js
 *
 * GET /api/checks/:voucherId/export
 *
 * 1. Loads the Check + its top-level CheckItems (parent_id: null) via Sequelize
 * 2. Computes:
 *      - amount  -> Check.checkAmount    (maps to CHECK PREP!B4 and !I7)
 *      - title   -> items[0].title       (maps to CHECK PREP!B7, overwriting its "=B12" formula)
 *      - words   -> spelled-out amount   (maps to CHECK PREP!B9, overwriting its "=SpellNumber(I7)" formula)
 *                   uses "USD" instead of "Pesos" when items[0].voucherType === "BANK PHP"
 * 3. Patches /public/uploads/Check-Preparation_Template-2.xls(m)
 * 4. Streams the resulting file back to the client as a download
 *
 * No layout or other formulas/macros/pivot data are touched -- only the
 * four raw cell values noted above (B4, B7, I7, B9). B12 itself is left
 * untouched.
 */

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";
import { patchCheckPrepTemplate } from "@/lib/checkPrepPatcher";
import { Check, CheckItem } from "@/db/models"; // adjust import to your Sequelize models index

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "uploads",
  "Check-Preparation_Template-2.xlsm", // change to .xlsm if that's the real extension on disk
);

export async function GET(req, { params }) {
  const { voucherId } = await params;

  if (!voucherId) {
    return NextResponse.json(
      { error: "voucherId is required" },
      { status: 400 },
    );
  }

  try {
    const specificCheck = await Check.findOne({
      where: { id: voucherId },
      include: [
        {
          model: CheckItem,
          as: "items",
          where: { parent_id: null },
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

    // return NextResponse.json({ checkData }, { status: 200 });
    const checkData = specificCheck.toJSON();

    const amount = parseFloat(checkData.checkAmount);
    if (Number.isNaN(amount)) {
      return NextResponse.json(
        { error: "checkAmount on this check is not a valid number" },
        { status: 422 },
      );
    }

    const firstItem = (checkData.items || [])[0];
    if (!firstItem || !firstItem.title) {
      return NextResponse.json(
        { error: "Check has no items[0].title to use as supplier name" },
        { status: 422 },
      );
    }
    const supplierName = firstItem.title;
    const voucherType = firstItem.voucherType; // "BANK PHP" => spelled-out amount uses "USD" instead of "Pesos"

    if (!fs.existsSync(TEMPLATE_PATH)) {
      return NextResponse.json(
        { error: `Template not found at ${TEMPLATE_PATH}` },
        { status: 500 },
      );
    }

    // Write to a temp file, then stream it -- avoids partial-write race conditions
    // if multiple exports happen concurrently.
    const tmpOutputPath = path.join(
      os.tmpdir(),
      `check-prep-${voucherId}-${Date.now()}.xlsm`,
    );

    patchCheckPrepTemplate(TEMPLATE_PATH, tmpOutputPath, {
      amount,
      supplierName,
      voucherType,
    });

    const fileBuffer = fs.readFileSync(tmpOutputPath);
    const downloadName = `Check-Preparation-${checkData.checkId || voucherId}.xlsm`;
    fs.unlinkSync(tmpOutputPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.ms-excel.sheet.macroEnabled.12",
        "Content-Disposition": `attachment; filename="${downloadName}"`,
      },
    });
  } catch (err) {
    console.error("Check export failed:", err);
    return NextResponse.json(
      {
        error: "Failed to generate check preparation file",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
