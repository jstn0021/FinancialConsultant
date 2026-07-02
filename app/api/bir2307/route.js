import AdmZip from "adm-zip";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// ── XML CELL HELPERS ─────────────────────────────────────────────────────────
function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Sets a cell's value directly in raw sheet XML, preserving existing
 * style ("s=...") attributes. Works for cells that already exist in the
 * template (which is the case for a pre-built form like this).
 */
function setCellValue(sheetXml, cellRef, value, { isString = false } = {}) {
  const cellRegex = new RegExp(
    `<c r="${cellRef}"([^>]*?)(/>|>([\\s\\S]*?)</c>)`,
  );
  const match = sheetXml.match(cellRegex);

  if (!match) {
    console.warn(`Cell ${cellRef} not found in template — skipping`);
    return sheetXml;
  }

  // Preserve existing attributes (like style s="12") but strip old t="..."
  let attrs = match[1].replace(/\s*t="[^"]*"/, "");

  const isEmpty = value === "" || value === null || value === undefined;

  if (isEmpty) {
    return sheetXml.replace(cellRegex, `<c r="${cellRef}"${attrs}/>`);
  }

  if (isString) {
    const inner = `<is><t xml:space="preserve">${escXml(value)}</t></is>`;
    return sheetXml.replace(
      cellRegex,
      `<c r="${cellRef}"${attrs} t="inlineStr">${inner}</c>`,
    );
  }

  // numeric
  const inner = `<v>${escXml(value)}</v>`;
  return sheetXml.replace(cellRegex, `<c r="${cellRef}"${attrs}>${inner}</c>`);
}

// ── TIN DIGIT LAYOUT ─────────────────────────────────────────────────────────
// Row 17 cols: N O P Q(-) R S T U(-) V W X Y(-) Z AA AB AC AD
const TIN_COLS = [
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "AA",
  "AB",
  "AC",
  "AD",
];

function fillTIN(sheetXml, row, tinStr) {
  const chars = (tinStr || "").padEnd(17, " ").split("");
  chars.forEach((ch, i) => {
    const cellRef = `${TIN_COLS[i]}${row}`;
    const val = ch === "-" ? "-" : ch.trim() === "" ? "" : ch;
    sheetXml = setCellValue(sheetXml, cellRef, val, { isString: true });
  });
  return sheetXml;
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

    if (!quarter?.from || !quarter?.to) {
      return NextResponse.json(
        { error_message: "Missing quarter.from or quarter.to in request body" },
        { status: 400 },
      );
    }
    if (!supplier) {
      return NextResponse.json(
        { error_message: "Missing supplier object in request body" },
        { status: 400 },
      );
    }

    const m1 = Number(month1) || 0;
    const m2 = Number(month2) || 0;
    const m3 = Number(month3) || 0;

    const templatePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "bir logo",
      "birform.xlsx",
    );

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error_message: `Template file not found at: ${templatePath}` },
        { status: 500 },
      );
    }

    const zip = new AdmZip(templatePath);

    // Confirm the correct worksheet XML filename.
    // Most single-sheet templates use "sheet1.xml" — adjust if yours differs
    // (check console output below on first run).
    const sheetPath = "xl/worksheets/sheet1.xml";
    const entry = zip.getEntry(sheetPath);

    if (!entry) {
      const allEntries = zip.getEntries().map((e) => e.entryName);
      return NextResponse.json(
        {
          error_message: `${sheetPath} not found in template.`,
          available_entries: allEntries,
        },
        { status: 500 },
      );
    }

    let sheetXml = entry.getData().toString("utf8");

    // ══════════════════════════════════════════════════════════════════════
    // 1. PERIOD (row 13)
    // ══════════════════════════════════════════════════════════════════════
    const parseDate = (mmddyyyy) => {
      const [mm, dd, yyyy] = (mmddyyyy || "").split("/");
      return yyyy && mm && dd ? `${mm}${dd}${yyyy}` : "";
    };

    const fromDate = parseDate(quarter.from);
    const toDate = parseDate(quarter.to);

    const fromCell = ["J", "K", "L", "M", "N", "O", "P", "Q"];
    const toCell = ["AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH"];
    const extractedFrom = fromDate.split("");
    const extractedTo = toDate.split("");

    fromCell.forEach((l, i) => {
      sheetXml = setCellValue(sheetXml, `${l}13`, extractedFrom[i], {
        isString: true,
      });
    });
    toCell.forEach((l, i) => {
      sheetXml = setCellValue(sheetXml, `${l}13`, extractedTo[i], {
        isString: true,
      });
    });

    // ══════════════════════════════════════════════════════════════════════
    // 2. PAYEE TIN (row 17)
    // ══════════════════════════════════════════════════════════════════════
    sheetXml = fillTIN(sheetXml, 17, supplier.supplierTin || "");

    // ══════════════════════════════════════════════════════════════════════
    // 3. PAYEE NAME (B19)
    // ══════════════════════════════════════════════════════════════════════
    sheetXml = setCellValue(sheetXml, "B19", supplier.supplierName || "", {
      isString: true,
    });
    sheetXml = setCellValue(sheetXml, "AQ19", "", { isString: true });

    // ══════════════════════════════════════════════════════════════════════
    // 4. PAYEE ADDRESS (B23) + ZIP (AK24–AN24)
    // ══════════════════════════════════════════════════════════════════════
    sheetXml = setCellValue(sheetXml, "B23", supplier.supplierAddress || "", {
      isString: true,
    });
    sheetXml = setCellValue(sheetXml, "AQ23", "", { isString: true });

    const zipDigits = (supplier.zipCode || "").padEnd(4, " ");
    ["AK24", "AL24", "AM24", "AN24"].forEach((cellRef, i) => {
      sheetXml = setCellValue(sheetXml, cellRef, zipDigits[i].trim() || "", {
        isString: true,
      });
    });

    // ══════════════════════════════════════════════════════════════════════
    // 6. ATC CODE (L47) + DESCRIPTION (A47)
    // ══════════════════════════════════════════════════════════════════════
    sheetXml = setCellValue(sheetXml, "L47", atcCode || "", { isString: true });
    sheetXml = setCellValue(sheetXml, "A47", atcDescription || "", {
      isString: true,
    });

    // ══════════════════════════════════════════════════════════════════════
    // 7. AMOUNTS (row 47) — numeric, formulas AD47/AI47 stay untouched
    // ══════════════════════════════════════════════════════════════════════
    sheetXml = setCellValue(sheetXml, "O47", m1);
    sheetXml = setCellValue(sheetXml, "T47", m2);
    sheetXml = setCellValue(sheetXml, "Y47", m3);
    sheetXml = setCellValue(sheetXml, "AQ47", Number(taxRate) || 0);

    // ── Write modified sheet XML back into the zip, leave everything else ──
    zip.updateFile(sheetPath, Buffer.from(sheetXml, "utf8"));

    // Force Excel to recalculate formulas (AD47, AI47) on open, since we
    // bypassed ExcelJS which normally handles this
    const workbookXmlEntry = zip.getEntry("xl/workbook.xml");
    if (workbookXmlEntry) {
      let workbookXml = workbookXmlEntry.getData().toString("utf8");
      if (!workbookXml.includes("<calcPr")) {
        workbookXml = workbookXml.replace(
          "</workbook>",
          `<calcPr fullCalcOnLoad="1"/></workbook>`,
        );
        zip.updateFile("xl/workbook.xml", Buffer.from(workbookXml, "utf8"));
      }
    }

    const buffer = zip.toBuffer();

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
