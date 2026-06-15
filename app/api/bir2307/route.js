import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// ── TIN DIGIT LAYOUT ─────────────────────────────────────────────────────────
// TIN format: 000-000-000-00000 (digits only after stripping dashes)
// Row 17 cols: N(14)=d0 O(15)=d1 P(16)=d2 Q(17)='-' R(18)=d3 S(19)=d4 T(20)=d5
//              U(21)='-' V(22)=d6 W(23)=d7 X(24)=d8 Y(25)='-'
//              Z(26)=d9 AA(27)=d10 AB(28)=d11 AC(29)=d12 AD(30)=d13
// Same layout for payor TIN in row 33

function fillTIN(ws, row, tinStr) {
  // tinStr e.g. "009-398-816-00000" — keep dashes in place
  const chars = tinStr.padEnd(17, " ").split("");
  const colMap = [
    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];
  // col 17 (Q) and 21 (U) and 25 (Y) = dashes — leave as-is from template
  chars.forEach((ch, i) => {
    ws.getCell(row, colMap[i]).value =
      ch === "-" ? "-" : ch.trim() === "" ? "" : ch;
  });
}

// ── ROUTE ─────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      quarter,
      supplier,
      atcCode,
      atcDescription,
      taxRate,
      month1,
      month2,
      month3,
    } = body;

    const m1 = Number(month1) || 0;
    const m2 = Number(month2) || 0;
    const m3 = Number(month3) || 0;

    // ── Load original BIR form as template ────────────────────────────────────
    const templatePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "bir logo",
      "birform.xlsx",
    );
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(templatePath);
    const ws = wb.getWorksheet("Sheet1");

    // ══════════════════════════════════════════════════════════════════════════
    // 1. PERIOD — AQ13 drives the date MID() formulas in the template
    //    Format: YYYYMMDD  e.g. "20250701"
    //    quarter.from = "MM/DD/YYYY"
    // ══════════════════════════════════════════════════════════════════════════
    const parseDate = (mmddyyyy) => {
      const [mm, dd, yyyy] = (mmddyyyy || "").split("/");
      return yyyy && mm && dd ? `${yyyy}${mm}${dd}` : "";
    };

    ws.getCell("AQ13").value = parseDate(quarter.from);
    // AR13 had a VLOOKUP to Page2 (to-date) — replace with plain value
    ws.getCell("AR13").value = parseDate(quarter.to);

    // Fix the MID formulas that pull from AR13 (to-date digits)
    // AC13=MID(AR13,7,1) AD13=MID(AR13,8... etc — leave them, they still work
    // But AR13's VLOOKUP referenced [1]Page2 (external) — override with string
    // The MID formulas reference AR13 so they'll auto-update with the plain string

    // ══════════════════════════════════════════════════════════════════════════
    // 2. PAYEE TIN (Row 17, cols N–AD)
    // ══════════════════════════════════════════════════════════════════════════
    fillTIN(ws, 17, supplier.supplierTin || "");

    // ══════════════════════════════════════════════════════════════════════════
    // 3. PAYEE NAME (B19 merged B19:AN20)
    // ══════════════════════════════════════════════════════════════════════════
    ws.getCell("B19").value = supplier.supplierName || "";
    // Clear the helper cell AQ19 (had 'z' as sample)
    ws.getCell("AQ19").value = "";

    // ══════════════════════════════════════════════════════════════════════════
    // 4. PAYEE ADDRESS (B23 merged B23:AI25) + ZIP (AK24–AN24)
    // ══════════════════════════════════════════════════════════════════════════
    ws.getCell("B23").value = supplier.supplierAddress || "";
    // Clear the VLOOKUP in AQ23 (referenced broken #REF!)
    ws.getCell("AQ23").value = "";

    const zip = (supplier.zipCode || "").padEnd(4, " ");
    ws.getCell("AK24").value = zip[0].trim() || "";
    ws.getCell("AL24").value = zip[1].trim() || "";
    ws.getCell("AM24").value = zip[2].trim() || "";
    ws.getCell("AN24").value = zip[3].trim() || "";

    // ══════════════════════════════════════════════════════════════════════════
    // 5. FOREIGN ADDRESS — row 28 area (no data in template, just clear)
    // ══════════════════════════════════════════════════════════════════════════
    // Template has no value here — nothing to set unless provided
    // (foreign address field is typically blank)

    // ══════════════════════════════════════════════════════════════════════════
    // 6. ATC CODE (L47) — drives VLOOKUP for description in A47
    //    ATC Description: A47 has VLOOKUP formula from Page2 — override it
    //    with plain text since Page2 external ref may not exist
    // ══════════════════════════════════════════════════════════════════════════
    ws.getCell("L47").value = atcCode || "";
    ws.getCell("A47").value = atcDescription || "";

    // ══════════════════════════════════════════════════════════════════════════
    // 7. AMOUNTS (row 47)
    //    O47:S47  = 1st month (merged, write to O47)
    //    T47:X47  = 2nd month (merged, write to T47)
    //    Y47:AC47 = 3rd month (merged, write to Y47)
    //    AD47 = Total formula (keep as-is)
    //    AQ47 = tax rate (drives AI47 tax formula)
    // ══════════════════════════════════════════════════════════════════════════
    ws.getCell("O47").value = m1;
    ws.getCell("T47").value = m2;
    ws.getCell("Y47").value = m3;
    ws.getCell("AQ47").value = Number(taxRate) || 0;

    // Keep AD47 formula: =IFERROR(ROUND(SUM(O47:AC47),2),"")
    // Keep AI47 formula: =IFERROR(ROUND(AD47*AQ47,2),"")
    // These are already in the template and will calculate correctly.

    // ── OUTPUT ────────────────────────────────────────────────────────────────
    const buffer = await wb.xlsx.writeBuffer();
    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="BIR2307_${supplier.supplierName || "export"}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("BIR2307 Error:", error.message, error.stack);
    return NextResponse.json({ error_message: error.message }, { status: 500 });
  }
}
