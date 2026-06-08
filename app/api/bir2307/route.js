// import ExcelJS from "exceljs";
// import { NextResponse } from "next/server";

// const PAYOR = {
//   tin: "000-484-418-00000",
//   name: "ORIENTAL CONSULTANTS GLOBAL CO. LTD. - PHILIPPINE BRANCH",
//   address:
//     "UNIT 38C RUFINO PACIFIC TOWER, 6784 AYALA AVE., BRGY. SAN LORENZO, 4TH DIST., MAKATI CITY",
//   zip: "1223",
// };

// const BORDER = {
//   top: { style: "thin" },
//   left: { style: "thin" },
//   bottom: { style: "thin" },
//   right: { style: "thin" },
// };

// const HEADER_FILL = {
//   type: "pattern",
//   pattern: "solid",
//   fgColor: { argb: "FF1F4E79" },
// };

// const SECTION_FILL = {
//   type: "pattern",
//   pattern: "solid",
//   fgColor: { argb: "FFD3D3D3" },
// };

// const AMOUNT_FMT = "#,##0.00";

// function styleCell(
//   cell,
//   {
//     bold = false,
//     align = "left",
//     fill = null,
//     border = true,
//     fontSize = 10,
//   } = {},
// ) {
//   cell.font = { name: "Arial", size: fontSize, bold };
//   cell.alignment = { horizontal: align, vertical: "middle", wrapText: true };
//   if (fill) cell.fill = fill;
//   if (border) cell.border = BORDER;
// }

// function sectionHeader(sheet, ref, value) {
//   const cell = sheet.getCell(ref);
//   cell.value = value;
//   styleCell(cell, {
//     bold: true,
//     align: "center",
//     fill: SECTION_FILL,
//     fontSize: 11,
//   });
// }

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const {
//       quarter,
//       supplier,
//       atcCode,
//       atcDescription,
//       taxRate,
//       month1,
//       month2,
//       month3,
//     } = body;

//     const m1 = Number(month1) || 0;
//     const m2 = Number(month2) || 0;
//     const m3 = Number(month3) || 0;
//     const total = m1 + m2 + m3;
//     const taxWithheld = total * Number(taxRate);

//     const workbook = new ExcelJS.Workbook();
//     workbook.creator = "NSTREN";
//     workbook.created = new Date();

//     const sheet = workbook.addWorksheet("BIR 2307", {
//       pageSetup: {
//         paperSize: 9,
//         orientation: "landscape",
//         fitToPage: true,
//         fitToWidth: 1,
//       },
//     });

//     // Column widths
//     sheet.columns = [
//       { width: 5 }, // A - row num
//       { width: 20 }, // B
//       { width: 20 }, // C
//       { width: 20 }, // D
//       { width: 12 }, // E - ATC
//       { width: 16 }, // F - M1
//       { width: 16 }, // G - M2
//       { width: 16 }, // H - M3
//       { width: 16 }, // I - Total
//       { width: 18 }, // J - Tax Withheld
//     ];

//     // ── HEADER ──────────────────────────────────────────────────
//     sheet.mergeCells("A1:J1");
//     const title1 = sheet.getCell("A1");
//     title1.value =
//       "Republic of the Philippines — Department of Finance — Bureau of Internal Revenue";
//     styleCell(title1, { bold: true, align: "center", fontSize: 11 });

//     sheet.mergeCells("A2:J2");
//     const title2 = sheet.getCell("A2");
//     title2.value = "Certificate of Creditable Tax Withheld at Source";
//     styleCell(title2, { bold: true, align: "center", fontSize: 14 });

//     sheet.mergeCells("A3:J3");
//     const title3 = sheet.getCell("A3");
//     title3.value = "BIR Form No. 2307 — January 2018 (ENCS)";
//     styleCell(title3, { align: "center", fontSize: 10 });

//     sheet.getRow(1).height = 18;
//     sheet.getRow(2).height = 22;
//     sheet.getRow(3).height = 16;

//     // ── PERIOD ───────────────────────────────────────────────────
//     sheet.mergeCells("A5:J5");
//     const period = sheet.getCell("A5");
//     period.value = `1   For the Period   From: ${quarter.from}  (MM/DD/YYYY)     To: ${quarter.to}  (MM/DD/YYYY)`;
//     styleCell(period, { fontSize: 10 });
//     sheet.getRow(5).height = 16;

//     // ── PART I — PAYEE ───────────────────────────────────────────
//     sheet.mergeCells("A7:J7");
//     sectionHeader(sheet, "A7", "Part I – Payee Information");
//     sheet.getRow(7).height = 16;

//     const payeeRows = [
//       [
//         "2",
//         "Taxpayer Identification Number (TIN):",
//         supplier.supplierTin || "",
//       ],
//       ["3", "Payee's Name:", supplier.supplierName || ""],
//       ["4", "Registered Address:", supplier.supplierAddress || ""],
//       ["4A", "ZIP Code:", supplier.zipCode || ""],
//       ["5", "Foreign Address (if applicable):", supplier.foreignAddress || ""],
//     ];

//     let r = 8;
//     for (const [num, label, val] of payeeRows) {
//       sheet.mergeCells(`A${r}:D${r}`);
//       sheet.mergeCells(`E${r}:J${r}`);

//       const labelCell = sheet.getCell(`A${r}`);
//       labelCell.value = `${num}   ${label}`;
//       styleCell(labelCell, { fontSize: 10 });

//       const valCell = sheet.getCell(`E${r}`);
//       valCell.value = val;
//       styleCell(valCell, { bold: true, fontSize: 10 });

//       sheet.getRow(r).height = 16;
//       r++;
//     }

//     // ── PART II — PAYOR ──────────────────────────────────────────
//     r++;
//     sheet.mergeCells(`A${r}:J${r}`);
//     sectionHeader(sheet, `A${r}`, "Part II – Payor Information");
//     sheet.getRow(r).height = 16;
//     r++;

//     const payorRows = [
//       ["6", "Taxpayer Identification Number (TIN):", PAYOR.tin],
//       ["7", "Payor's Name:", PAYOR.name],
//       ["8", "Registered Address:", PAYOR.address],
//       ["8A", "ZIP Code:", PAYOR.zip],
//     ];

//     for (const [num, label, val] of payorRows) {
//       sheet.mergeCells(`A${r}:D${r}`);
//       sheet.mergeCells(`E${r}:J${r}`);

//       const labelCell = sheet.getCell(`A${r}`);
//       labelCell.value = `${num}   ${label}`;
//       styleCell(labelCell, { fontSize: 10 });

//       const valCell = sheet.getCell(`E${r}`);
//       valCell.value = val;
//       styleCell(valCell, { bold: true, fontSize: 10 });

//       sheet.getRow(r).height = 16;
//       r++;
//     }

//     // ── PART III — EWT TABLE ─────────────────────────────────────
//     r++;
//     sheet.mergeCells(`A${r}:J${r}`);
//     sectionHeader(
//       sheet,
//       `A${r}`,
//       "Part III – Details of Monthly Income Payments and Taxes Withheld",
//     );
//     sheet.getRow(r).height = 16;
//     r++;

//     // Sub-header row 1
//     sheet.mergeCells(`A${r}:D${r}`);
//     sheet.mergeCells(`F${r}:I${r}`);
//     const ewt1 = sheet.getCell(`A${r}`);
//     ewt1.value = "Income Payments Subject to Expanded Withholding Tax";
//     styleCell(ewt1, {
//       bold: true,
//       align: "center",
//       fill: HEADER_FILL,
//       fontSize: 10,
//     });
//     ewt1.font = { ...ewt1.font, color: { argb: "FFFFFFFF" } };

//     const atcH = sheet.getCell(`E${r}`);
//     atcH.value = "ATC";
//     styleCell(atcH, {
//       bold: true,
//       align: "center",
//       fill: HEADER_FILL,
//       fontSize: 10,
//     });
//     atcH.font = { ...atcH.font, color: { argb: "FFFFFFFF" } };

//     const amtH = sheet.getCell(`F${r}`);
//     amtH.value = "AMOUNT OF INCOME PAYMENTS";
//     styleCell(amtH, {
//       bold: true,
//       align: "center",
//       fill: HEADER_FILL,
//       fontSize: 10,
//     });
//     amtH.font = { ...amtH.font, color: { argb: "FFFFFFFF" } };

//     const taxH = sheet.getCell(`J${r}`);
//     taxH.value = "Tax Withheld for the Quarter";
//     styleCell(taxH, {
//       bold: true,
//       align: "center",
//       fill: HEADER_FILL,
//       fontSize: 10,
//     });
//     taxH.font = { ...taxH.font, color: { argb: "FFFFFFFF" } };

//     sheet.getRow(r).height = 20;
//     r++;

//     // Sub-header row 2 (month labels)
//     ["A", "B", "C", "D", "E"].forEach((col) => {
//       const c = sheet.getCell(`${col}${r}`);
//       c.value = "";
//       styleCell(c, { fill: HEADER_FILL });
//     });

//     const monthLabels = [
//       ["F", "1st Month of the Quarter"],
//       ["G", "2nd Month of the Quarter"],
//       ["H", "3rd Month of the Quarter"],
//       ["I", "Total"],
//     ];
//     for (const [col, label] of monthLabels) {
//       const c = sheet.getCell(`${col}${r}`);
//       c.value = label;
//       styleCell(c, {
//         bold: true,
//         align: "center",
//         fill: HEADER_FILL,
//         fontSize: 9,
//       });
//       c.font = { ...c.font, color: { argb: "FFFFFFFF" } };
//     }

//     // Repeat Tax Withheld placeholder (already merged above — just border)
//     const taxH2 = sheet.getCell(`J${r}`);
//     taxH2.value = "";
//     styleCell(taxH2, { fill: HEADER_FILL });

//     sheet.getRow(r).height = 28;
//     r++;

//     // Data row
//     sheet.mergeCells(`A${r}:D${r}`);
//     const descCell = sheet.getCell(`A${r}`);
//     descCell.value = atcDescription;
//     styleCell(descCell, { fontSize: 9 });

//     const atcCell = sheet.getCell(`E${r}`);
//     atcCell.value = atcCode;
//     styleCell(atcCell, { align: "center", bold: true, fontSize: 10 });

//     const m1Cell = sheet.getCell(`F${r}`);
//     m1Cell.value = m1;
//     m1Cell.numFmt = AMOUNT_FMT;
//     styleCell(m1Cell, { align: "right", fontSize: 10 });

//     const m2Cell = sheet.getCell(`G${r}`);
//     m2Cell.value = m2;
//     m2Cell.numFmt = AMOUNT_FMT;
//     styleCell(m2Cell, { align: "right", fontSize: 10 });

//     const m3Cell = sheet.getCell(`H${r}`);
//     m3Cell.value = m3;
//     m3Cell.numFmt = AMOUNT_FMT;
//     styleCell(m3Cell, { align: "right", fontSize: 10 });

//     const totCell = sheet.getCell(`I${r}`);
//     totCell.value = { formula: `=F${r}+G${r}+H${r}` };
//     totCell.numFmt = AMOUNT_FMT;
//     styleCell(totCell, { align: "right", bold: true, fontSize: 10 });

//     const taxCell = sheet.getCell(`J${r}`);
//     taxCell.value = { formula: `=I${r}*${taxRate}` };
//     taxCell.numFmt = AMOUNT_FMT;
//     styleCell(taxCell, { align: "right", bold: true, fontSize: 10 });

//     sheet.getRow(r).height = 36;
//     r++;

//     // Empty rows
//     for (let i = 0; i < 11; i++) {
//       sheet.mergeCells(`A${r}:D${r}`);
//       ["A", "E", "F", "G", "H", "I", "J"].forEach((col) => {
//         styleCell(sheet.getCell(`${col}${r}`));
//       });
//       sheet.getRow(r).height = 14;
//       r++;
//     }

//     // Total row
//     const dataStartRow = r - 12;
//     sheet.mergeCells(`A${r}:D${r}`);
//     const totalLabel = sheet.getCell(`A${r}`);
//     totalLabel.value = "Total";
//     styleCell(totalLabel, { bold: true, fontSize: 10 });

//     styleCell(sheet.getCell(`E${r}`));

//     const totM1 = sheet.getCell(`F${r}`);
//     totM1.value = { formula: `=SUM(F${dataStartRow}:F${r - 1})` };
//     totM1.numFmt = AMOUNT_FMT;
//     styleCell(totM1, { align: "right", bold: true, fontSize: 10 });

//     const totM2 = sheet.getCell(`G${r}`);
//     totM2.value = { formula: `=SUM(G${dataStartRow}:G${r - 1})` };
//     totM2.numFmt = AMOUNT_FMT;
//     styleCell(totM2, { align: "right", bold: true, fontSize: 10 });

//     const totM3 = sheet.getCell(`H${r}`);
//     totM3.value = { formula: `=SUM(H${dataStartRow}:H${r - 1})` };
//     totM3.numFmt = AMOUNT_FMT;
//     styleCell(totM3, { align: "right", bold: true, fontSize: 10 });

//     const totAll = sheet.getCell(`I${r}`);
//     totAll.value = { formula: `=SUM(I${dataStartRow}:I${r - 1})` };
//     totAll.numFmt = AMOUNT_FMT;
//     styleCell(totAll, { align: "right", bold: true, fontSize: 10 });

//     const totTax = sheet.getCell(`J${r}`);
//     totTax.value = { formula: `=SUM(J${dataStartRow}:J${r - 1})` };
//     totTax.numFmt = AMOUNT_FMT;
//     styleCell(totTax, { align: "right", bold: true, fontSize: 10 });

//     sheet.getRow(r).height = 16;
//     r++;

//     // ── DECLARATION ──────────────────────────────────────────────
//     r++;
//     sheet.mergeCells(`A${r}:J${r}`);
//     const decl = sheet.getCell(`A${r}`);
//     decl.value =
//       "   We declare under the penalties of perjury that this certificate has been made in good faith, verified by us, and to the best of our knowledge and belief, is true and correct, pursuant to the provisions of the National Internal Revenue Code, as amended, and the regulations issued under authority thereof.";
//     styleCell(decl, { fontSize: 9 });
//     sheet.getRow(r).height = 32;
//     r++;

//     // ── PAYOR SIGNATURE ──────────────────────────────────────────
//     r++;
//     sheet.mergeCells(`A${r}:J${r}`);
//     const sigPayor = sheet.getCell(`A${r}`);
//     sigPayor.value =
//       "ELSA G. OCRETO\nASSISTANT GENERAL MANAGER, FINANCE & ACCOUNTING / TIN 119-839-069";

//     styleCell(sigPayor, { bold: false, fontSize: 10 });
//     sheet.getRow(r).height = 40;
//     r++;

//     sheet.mergeCells(`A${r}:J${r}`);
//     const sigLabel = sheet.getCell(`A${r}`);
//     sigLabel.value =
//       "Signature over Printed Name of Payor/Payor's Authorized Representative/Tax Agent";
//     sigLabel.border = {
//       top: { style: "medium" },
//       left: BORDER.left,
//       right: BORDER.right,
//       bottom: BORDER.bottom,
//     };
//     styleCell(sigLabel, { fontSize: 9 });
//     sheet.getRow(r).height = 14;
//     r++;

//     // ── CONFORME ─────────────────────────────────────────────────
//     r++;
//     sheet.mergeCells(`A${r}:J${r}`);
//     const conf = sheet.getCell(`A${r}`);
//     conf.value = "CONFORME:";
//     styleCell(conf, { bold: true, fontSize: 10 });
//     sheet.getRow(r).height = 14;
//     r++;

//     sheet.mergeCells(`A${r}:J${r}`);
//     styleCell(sheet.getCell(`A${r}`));
//     sheet.getRow(r).height = 50;
//     r++;

//     sheet.mergeCells(`A${r}:J${r}`);
//     const sigPayee = sheet.getCell(`A${r}`);
//     sigPayee.value =
//       "Signature over Printed Name of Payee/Payee's Authorized Representative/Tax Agent";
//     sigPayee.border = {
//       top: { style: "medium" },
//       left: BORDER.left,
//       right: BORDER.right,
//       bottom: BORDER.bottom,
//     };
//     styleCell(sigPayee, { fontSize: 9 });
//     sheet.getRow(r).height = 14;
//     r++;

//     // ── FOOTER NOTE ──────────────────────────────────────────────
//     r++;
//     sheet.mergeCells(`A${r}:J${r}`);
//     const note = sheet.getCell(`A${r}`);
//     note.value =
//       "*NOTE: The BIR Data Privacy is in the BIR website (www.bir.gov.ph)";
//     note.font = { name: "Arial", size: 9, italic: true };
//     note.alignment = { horizontal: "left" };

//     const buffer = await workbook.xlsx.writeBuffer();

//     return new Response(buffer, {
//       headers: {
//         "Content-Type":
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": `attachment; filename="BIR2307_${supplier.supplierName || "export"}.xlsx"`,
//       },
//     });
//   } catch (error) {
//     console.error("BIR2307 Error:", error.message);
//     return NextResponse.json({ error_message: error.message }, { status: 500 });
//   }
// }
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

const PAYOR = {
  tin: "000-484-418-00000",
  name: "ORIENTAL CONSULTANTS GLOBAL CO. LTD. - PHILIPPINE BRANCH",
  address:
    "UNIT 38C RUFINO PACIFIC TOWER, 6784 AYALA AVE., BRGY. SAN LORENZO, 4TH DIST., MAKATI CITY",
  zip: "1223",
};

// ── STYLES ────────────────────────────────────────────────────────────────────
const THIN = { style: "thin", color: { argb: "FF888888" } };
const MEDIUM = { style: "medium", color: { argb: "FF000000" } };
const B_ALL = { top: THIN, left: THIN, bottom: THIN, right: THIN };

const FONT_SM = { name: "Arial Narrow", size: 8 };
const FONT_BASE = { name: "Arial Narrow", size: 9 };
const FONT_BOLD = { name: "Arial Narrow", size: 9, bold: true };
const FONT_TITL = { name: "Arial Narrow", size: 11, bold: true };
const FONT_FORM = { name: "Arial Narrow", size: 14, bold: true };
const FONT_WHT = (size = 9) => ({
  name: "Arial Narrow",
  size,
  bold: true,
  color: { argb: "FFFFFFFF" },
});

const FILL_HDRGRAY = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD6D6D6" },
};
const FILL_DKBLUE = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F4E79" },
};
const FILL_LTGRAY = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF5F5F5" },
};

const AMT_FMT = "#,##0.00";

// ── HELPERS ───────────────────────────────────────────────────────────────────
function ms(ws, r1, c1, r2, c2, value, opts = {}) {
  if (r1 !== r2 || c1 !== c2) ws.mergeCells(r1, c1, r2, c2);
  const cell = ws.getCell(r1, c1);
  cell.value = value ?? "";
  cell.font = opts.font ?? FONT_BASE;
  cell.alignment = {
    horizontal: opts.align ?? "left",
    vertical: "middle",
    wrapText: opts.wrap ?? true,
  };
  cell.border = opts.border ?? B_ALL;
  if (opts.fill) cell.fill = opts.fill;
  if (opts.numFmt) cell.numFmt = opts.numFmt;
  return cell;
}

function blueHdr(ws, r1, c1, r2, c2, value) {
  return ms(ws, r1, c1, r2, c2, value, {
    font: {
      name: "Arial Narrow",
      size: 9,
      bold: true,
      color: { argb: "FF000000" },
    },
    align: "center",
    fill: FILL_HDRGRAY,
    border: B_ALL,
    wrap: true,
  });
}

function sectionBar(ws, R, label) {
  ms(ws, R, 1, R, 10, label, {
    font: FONT_BOLD,
    align: "center",
    fill: FILL_HDRGRAY,
  });
  ws.getRow(R).height = 14;
}

function amtCell(ws, R, col, formula, bold = false) {
  const cell = ws.getCell(R, col);
  cell.value = { formula };
  cell.numFmt = AMT_FMT;
  cell.font = bold ? FONT_BOLD : FONT_BASE;
  cell.alignment = { horizontal: "right", vertical: "middle" };
  cell.border = B_ALL;
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

    const wb = new ExcelJS.Workbook();
    wb.creator = "NSTREN";
    wb.created = new Date();

    const ws = wb.addWorksheet("BIR 2307", {
      pageSetup: {
        paperSize: 9,
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          left: 0.5,
          right: 0.5,
          top: 0.5,
          bottom: 0.5,
          header: 0.3,
          footer: 0.3,
        },
      },
    });

    // 10-column layout (mirrors HTML colSpan=10 grid)
    [3, 14, 14, 14, 10, 14, 14, 14, 14, 16].forEach((w, i) => {
      ws.getColumn(i + 1).width = w;
    });

    let R = 1;

    // ── HEADER ────────────────────────────────────────────────────────────────
    ms(ws, R, 1, R, 1, "BCS/\nItem:", { font: FONT_SM });
    ms(
      ws,
      R,
      2,
      R,
      8,
      "Republic of the Philippines\nDepartment of Finance\nBureau of Internal Revenue",
      { font: FONT_TITL, align: "center" },
    );
    ms(ws, R, 9, R, 10, "2307 01/18ENCS", { font: FONT_SM, align: "right" });
    ws.getRow(R).height = 36;
    R++;

    ms(ws, R, 1, R, 4, "BIR Form No.\n2307\nJanuary 2018 (ENCS)", {
      font: FONT_BASE,
      align: "center",
    });
    ms(ws, R, 5, R, 10, "Certificate of Creditable Tax\nWithheld at Source", {
      font: FONT_FORM,
      align: "center",
    });
    ws.getRow(R).height = 42;
    R++;

    ms(
      ws,
      R,
      1,
      R,
      10,
      'Fill in all applicable spaces. Mark all appropriate boxes with an "X".',
      { font: FONT_SM },
    );
    ws.getRow(R).height = 12;
    R++;

    // ── PERIOD ────────────────────────────────────────────────────────────────
    ms(ws, R, 1, R, 1, "1", { font: FONT_BOLD });
    ms(
      ws,
      R,
      2,
      R,
      10,
      `For the Period   From: ${quarter.from}  (MM/DD/YYYY)     To: ${quarter.to}  (MM/DD/YYYY)`,
      { font: FONT_BASE },
    );
    ws.getRow(R).height = 14;
    R++;

    // ── PART I — PAYEE ────────────────────────────────────────────────────────
    sectionBar(ws, R, "Part I – Payee Information");
    R++;

    // Item 2 — TIN
    ms(ws, R, 1, R, 1, "2", { font: FONT_BOLD });
    ms(ws, R, 2, R, 10, "Taxpayer Identification Number (TIN)", {
      font: FONT_SM,
    });
    ws.getRow(R).height = 12;
    R++;
    ms(ws, R, 1, R, 10, supplier.supplierTin || "", { font: FONT_BASE });
    ws.getRow(R).height = 14;
    R++;

    // Item 3 — Payee Name
    ms(ws, R, 1, R, 1, "3", { font: FONT_BOLD });
    ms(
      ws,
      R,
      2,
      R,
      10,
      "Payee's Name (Last Name, First Name, Middle Name for Individual OR Registered Name for Non-Individual)",
      { font: FONT_SM },
    );
    ws.getRow(R).height = 12;
    R++;
    ms(ws, R, 1, R, 10, supplier.supplierName || "", { font: FONT_BOLD });
    ws.getRow(R).height = 14;
    R++;

    // Item 4 — Address
    ms(ws, R, 1, R, 1, "4", { font: FONT_BOLD });
    ms(ws, R, 2, R, 8, "Registered Address", { font: FONT_SM });
    ms(ws, R, 9, R, 10, "4A ZIP Code", { font: FONT_SM });
    ws.getRow(R).height = 12;
    R++;
    ms(ws, R, 1, R, 8, supplier.supplierAddress || "", { font: FONT_BASE });
    ms(ws, R, 9, R, 10, supplier.zipCode || "", {
      font: FONT_BASE,
      align: "center",
    });
    ws.getRow(R).height = 14;
    R++;

    // Item 5 — Foreign Address
    ms(ws, R, 1, R, 1, "5", { font: FONT_BOLD });
    ms(ws, R, 2, R, 10, "Foreign Address, if applicable", { font: FONT_SM });
    ws.getRow(R).height = 12;
    R++;
    ms(ws, R, 1, R, 10, supplier.foreignAddress || "", { font: FONT_BASE });
    ws.getRow(R).height = 14;
    R++;

    // ── PART II — PAYOR ───────────────────────────────────────────────────────
    sectionBar(ws, R, "Part II – Payor Information");
    R++;

    ms(ws, R, 1, R, 1, "6", { font: FONT_BOLD });
    ms(ws, R, 2, R, 10, "Taxpayer Identification Number (TIN)", {
      font: FONT_SM,
    });
    ws.getRow(R).height = 12;
    R++;
    ms(ws, R, 1, R, 10, PAYOR.tin, { font: FONT_BOLD });
    ws.getRow(R).height = 14;
    R++;

    ms(ws, R, 1, R, 1, "7", { font: FONT_BOLD });
    ms(
      ws,
      R,
      2,
      R,
      10,
      "Payor's Name (Last Name, First Name, Middle Name for Individual OR Registered Name for Non-Individual)",
      { font: FONT_SM },
    );
    ws.getRow(R).height = 12;
    R++;
    ms(ws, R, 1, R, 10, PAYOR.name, { font: FONT_BOLD });
    ws.getRow(R).height = 14;
    R++;

    ms(ws, R, 1, R, 1, "8", { font: FONT_BOLD });
    ms(ws, R, 2, R, 8, "Registered Address", { font: FONT_SM });
    ms(ws, R, 9, R, 10, "8A ZIP Code", { font: FONT_SM });
    ws.getRow(R).height = 12;
    R++;
    ms(ws, R, 1, R, 8, PAYOR.address, { font: FONT_BASE });
    ms(ws, R, 9, R, 10, PAYOR.zip, { font: FONT_BOLD, align: "center" });
    ws.getRow(R).height = 14;
    R++;

    // ── PART III — EWT TABLE ──────────────────────────────────────────────────
    sectionBar(
      ws,
      R,
      "Part III – Details of Monthly Income Payments and Taxes Withheld",
    );
    R++;

    // Header row 1
    blueHdr(
      ws,
      R,
      1,
      R + 1,
      4,
      "Income Payments Subject to Expanded Withholding Tax",
    );
    blueHdr(ws, R, 5, R + 1, 5, "ATC");
    blueHdr(ws, R, 6, R, 9, "AMOUNT OF INCOME PAYMENTS");
    blueHdr(ws, R, 10, R + 1, 10, "Tax Withheld for the Quarter");
    ws.getRow(R).height = 20;
    R++;

    // Header row 2
    blueHdr(ws, R, 6, R, 6, "1st Month\nof the Quarter");
    blueHdr(ws, R, 7, R, 7, "2nd Month\nof the Quarter");
    blueHdr(ws, R, 8, R, 8, "3rd Month\nof the Quarter");
    blueHdr(ws, R, 9, R, 9, "Total");
    ws.getRow(R).height = 26;
    R++;

    // Data row
    const DR = R;
    ms(ws, R, 1, R, 4, atcDescription, { font: FONT_SM });
    ms(ws, R, 5, R, 5, atcCode, { font: FONT_BOLD, align: "center" });

    const setAmt = (col, val) => {
      const cell = ws.getCell(R, col);
      cell.value = val;
      cell.numFmt = AMT_FMT;
      cell.font = FONT_BASE;
      cell.alignment = { horizontal: "right", vertical: "middle" };
      cell.border = B_ALL;
    };
    setAmt(6, m1);
    setAmt(7, m2);
    setAmt(8, m3);

    amtCell(ws, R, 9, `F${R}+G${R}+H${R}`, true);
    amtCell(ws, R, 10, `I${R}*${taxRate}`, true);
    ws.getRow(R).height = 40;
    R++;

    // 11 empty EWT rows
    for (let i = 0; i < 11; i++) {
      ms(ws, R, 1, R, 4, "");
      [5, 6, 7, 8, 9, 10].forEach((col) => {
        const cell = ws.getCell(R, col);
        cell.border = B_ALL;
        cell.value = "";
      });
      ws.getRow(R).height = 12;
      R++;
    }

    // EWT Total row
    ms(ws, R, 1, R, 4, "Total", { font: FONT_BOLD, fill: FILL_LTGRAY });
    ws.getCell(R, 5).border = B_ALL;
    ws.getCell(R, 5).fill = FILL_LTGRAY;
    [
      [6, "F"],
      [7, "G"],
      [8, "H"],
      [9, "I"],
      [10, "J"],
    ].forEach(([col, L]) => {
      amtCell(ws, R, col, `SUM(${L}${DR}:${L}${R - 1})`, true);
      ws.getCell(R, col).fill = FILL_LTGRAY;
    });
    ws.getRow(R).height = 14;
    R++;

    // // ── BUSINESS TAX TABLE ────────────────────────────────────────────────────
    // blueHdr(
    //   ws,
    //   R,
    //   1,
    //   R + 1,
    //   4,
    //   "Money Payments Subject to Withholding of Business Tax (Government & Private)",
    // );
    // blueHdr(ws, R, 5, R + 1, 5, "ATC");
    // blueHdr(ws, R, 6, R, 9, "AMOUNT OF MONEY PAYMENTS");
    // blueHdr(ws, R, 10, R + 1, 10, "Tax Withheld for the Quarter");
    // ws.getRow(R).height = 20;
    // R++;

    // blueHdr(ws, R, 6, R, 6, "1st Month\nof the Quarter");
    // blueHdr(ws, R, 7, R, 7, "2nd Month\nof the Quarter");
    // blueHdr(ws, R, 8, R, 8, "3rd Month\nof the Quarter");
    // blueHdr(ws, R, 9, R, 9, "Total");
    // ws.getRow(R).height = 26;
    // R++;

    // for (let i = 0; i < 3; i++) {
    //   ms(ws, R, 1, R, 4, "");
    //   [5, 6, 7, 8, 9, 10].forEach((col) => {
    //     ws.getCell(R, col).border = B_ALL;
    //     ws.getCell(R, col).value = "";
    //   });
    //   ws.getRow(R).height = 12;
    //   R++;
    // }

    // ms(ws, R, 1, R, 4, "Total", { font: FONT_BOLD, fill: FILL_LTGRAY });
    // [5, 6, 7, 8, 9, 10].forEach((col) => {
    //   ws.getCell(R, col).border = B_ALL;
    //   ws.getCell(R, col).fill = FILL_LTGRAY;
    // });
    // ws.getRow(R).height = 14;
    // R++;

    // ── DECLARATION ───────────────────────────────────────────────────────────
    ms(
      ws,
      R,
      1,
      R,
      10,
      "   We declare under the penalties of perjury that this certificate has been made in good faith, verified by us, and to the best of our knowledge and belief, is true and correct, pursuant to the provisions of the National Internal Revenue Code, as amended, and the regulations issued under authority thereof. Further, we give our consent to the processing of our information as contemplated under the Data Privacy Act of 2012 (R.A. No. 10173) for legitimate and lawful purposes.",
      { font: FONT_SM },
    );
    ws.getRow(R).height = 36;
    R++;

    // ── PAYOR SIGNATURE ───────────────────────────────────────────────────────
    ms(
      ws,
      R,
      1,
      R,
      10,
      "ELSA G. OCRETO\nASSISTANT GENERAL MANAGER, FINANCE & ACCOUNTING / TIN 119-839-069",
      { font: FONT_BASE },
    );
    ws.getRow(R).height = 40;
    R++;

    const sp = ms(
      ws,
      R,
      1,
      R,
      10,
      "Signature over Printed Name of Payor/Payor's Authorized Representative/Tax Agent",
      { font: FONT_SM, border: null },
    );
    sp.border = { top: MEDIUM, left: THIN, right: THIN, bottom: THIN };
    ws.getRow(R).height = 12;
    R++;

    ms(ws, R, 1, R, 10, "(Indicate Title/Designation and TIN)", {
      font: FONT_SM,
    });
    ws.getRow(R).height = 12;
    R++;

    ms(ws, R, 1, R, 4, "Tax Agent Accreditation No./", { font: FONT_SM });
    ms(ws, R, 5, R, 7, "Date of Issue\n(MM/DD/YYYY)", {
      font: FONT_SM,
      align: "center",
    });
    ms(ws, R, 8, R, 10, "Date of Expiry\n(MM/DD/YYYY)", {
      font: FONT_SM,
      align: "center",
    });
    ws.getRow(R).height = 22;
    R++;

    ms(ws, R, 1, R, 10, "Attorney's Roll No. (if applicable)", {
      font: FONT_SM,
    });
    ws.getRow(R).height = 12;
    R++;

    // ── CONFORME ──────────────────────────────────────────────────────────────
    ms(ws, R, 1, R, 10, "CONFORME:", { font: FONT_BOLD });
    ws.getRow(R).height = 12;
    R++;

    ms(ws, R, 1, R, 10, "");
    ws.getRow(R).height = 50;
    R++;

    const sc = ms(
      ws,
      R,
      1,
      R,
      10,
      "Signature over Printed Name of Payee/Payee's Authorized Representative/Tax Agent",
      { font: FONT_SM, border: null },
    );
    sc.border = { top: MEDIUM, left: THIN, right: THIN, bottom: THIN };
    ws.getRow(R).height = 12;
    R++;

    ms(ws, R, 1, R, 10, "(Indicate Title/Designation and TIN)", {
      font: FONT_SM,
    });
    ws.getRow(R).height = 12;
    R++;

    ms(ws, R, 1, R, 4, "Tax Agent Accreditation No./", { font: FONT_SM });
    ms(ws, R, 5, R, 7, "Date of Issue\n(MM/DD/YYYY)", {
      font: FONT_SM,
      align: "center",
    });
    ms(ws, R, 8, R, 10, "Date of Expiry\n(MM/DD/YYYY)", {
      font: FONT_SM,
      align: "center",
    });
    ws.getRow(R).height = 22;
    R++;

    ms(ws, R, 1, R, 10, "Attorney's Roll No. (if applicable)", {
      font: FONT_SM,
    });
    ws.getRow(R).height = 12;
    R++;

    // ── FOOTER ────────────────────────────────────────────────────────────────
    R++;
    const note = ws.getCell(R, 1);
    ws.mergeCells(R, 1, R, 10);
    note.value =
      "*NOTE: The BIR Data Privacy is in the BIR website (www.bir.gov.ph)";
    note.font = { name: "Arial Narrow", size: 8, italic: true };
    note.alignment = { horizontal: "left" };

    const buffer = await wb.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="BIR2307_${supplier.supplierName || "export"}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("BIR2307 Error:", error.message);
    return NextResponse.json({ error_message: error.message }, { status: 500 });
  }
}
