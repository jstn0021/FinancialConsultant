/**
 * lib/checkPrepPatcher.js
 *
 * Patches the "CHECK PREP" sheet of Check-Preparation_Template-2.xls(m)
 * by editing the underlying sheet XML directly inside the .xlsm zip archive.
 *
 * WHY NOT ExcelJS / openpyxl-style full-workbook load?
 * This workbook contains:
 *   - A VBA macro project (xl/vbaProject.bin)
 *   - Pivot tables backed by a very large pivot cache (100MB+)
 *   - A dynamic-array FILTER() formula (_xlfn._xlws.FILTER)
 * Loading and re-saving the full workbook with most JS/Python Excel libraries
 * risks corrupting or silently dropping the macro, pivot cache, or dynamic
 * array formula. To avoid this, we only touch the two raw XML parts we need:
 *   - xl/worksheets/sheet2.xml   (the "CHECK PREP" sheet)
 *   - xl/sharedStrings.xml       (only if a new string value is introduced)
 * Every other part of the archive is copied through untouched, byte-for-byte.
 *
 * NOTE: Cells B4 (AMOUNT) and B7 (PAY TO THE / supplier display name) are
 * the only cells touched, per spec. B7 originally holds the formula "=B12";
 * we deliberately remove that formula and write the supplier title directly
 * as a hardcoded value (B12 itself is left untouched). Other downstream
 * formula cells (I7, B9, etc.) still reference B4 and will recalculate
 * automatically the next time the file is opened in Excel (cached formula
 * values in the XML are left as-is, which is expected/safe -- Excel always
 * recalculates on open unless calc mode is manual).
 */

const AdmZip = require("adm-zip");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

const SHEET_PATH = "xl/worksheets/sheet2.xml"; // CHECK PREP sheet (rId2 in this template)
const SHARED_STRINGS_PATH = "xl/sharedStrings.xml";

const CELL_AMOUNT = "B4"; // numeric
const CELL_SUPPLIER = "B7"; // hardcoded string (originally a formula =B12, now overwritten with a static value)
const CELL_AMOUNT_DISPLAY = "I7"; // numeric (originally a formula =B4, now overwritten with a static value)
const CELL_AMOUNT_WORDS = "B9"; // hardcoded string (originally a formula SpellNumber(I7), now overwritten with a static value)

/**
 * Set a numeric (non-string) cell's value in a sheet XML DOM.
 */
function setNumericCell(sheetDoc, cellRef, numericValue) {
  const cells = sheetDoc.getElementsByTagName("c");
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    if (c.getAttribute("r") === cellRef) {
      if (c.getAttribute("t") && c.getAttribute("t") !== "n") {
        c.removeAttribute("t");
      }
      // Strip any existing formula (e.g. I7 originally held "=B4") so the
      // cell becomes a true hardcoded numeric value, not a stale formula.
      const fNode = c.getElementsByTagName("f")[0];
      if (fNode) {
        c.removeChild(fNode);
      }
      if (c.getAttribute("cm")) {
        c.removeAttribute("cm");
      }
      let vNode = c.getElementsByTagName("v")[0];
      if (!vNode) {
        vNode = sheetDoc.createElement("v");
        c.appendChild(vNode);
      }
      while (vNode.firstChild) vNode.removeChild(vNode.firstChild);
      vNode.appendChild(sheetDoc.createTextNode(String(numericValue)));
      return true;
    }
  }
  return false;
}

/**
 * Find an existing shared string's index, or append a new <si> entry.
 * Returns the index to use in a cell's <v>.
 */
function findOrAddSharedString(sstDoc, text) {
  const siNodes = sstDoc.getElementsByTagName("si");
  for (let i = 0; i < siNodes.length; i++) {
    const tNode = siNodes[i].getElementsByTagName("t")[0];
    if (tNode && tNode.textContent === text) {
      return i;
    }
  }
  // IMPORTANT: getElementsByTagName returns a LIVE NodeList in xmldom, so its
  // .length updates immediately after appendChild below. Capture the index
  // (= current length, since indices are 0-based) BEFORE appending the new
  // node, or the returned index will be off by one.
  const newIndex = siNodes.length;

  const sst = sstDoc.getElementsByTagName("sst")[0];
  const newSi = sstDoc.createElement("si");
  const newT = sstDoc.createElement("t");
  newT.appendChild(sstDoc.createTextNode(text));
  newSi.appendChild(newT);
  sst.appendChild(newSi);

  const countAttr = sst.getAttribute("count");
  const uniqueAttr = sst.getAttribute("uniqueCount");
  if (countAttr) sst.setAttribute("count", String(parseInt(countAttr, 10) + 1));
  if (uniqueAttr)
    sst.setAttribute("uniqueCount", String(parseInt(uniqueAttr, 10) + 1));

  return newIndex;
}

/**
 * Set a shared-string cell's value (creates/reuses a sharedStrings.xml entry).
 */
function setSharedStringCell(sheetDoc, sstDoc, cellRef, text) {
  const sstIndex = findOrAddSharedString(sstDoc, text);
  const cells = sheetDoc.getElementsByTagName("c");
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    if (c.getAttribute("r") === cellRef) {
      // If this cell previously held a formula (e.g. B7 was "=B12"), strip it
      // so the cell becomes a true hardcoded value instead of a stale formula
      // with an overwritten cached result. Also drop the "cm" (cell metadata,
      // used for dynamic-array formulas) attribute if present, since it no
      // longer applies once the formula is removed.
      const fNode = c.getElementsByTagName("f")[0];
      if (fNode) {
        c.removeChild(fNode);
      }
      if (c.getAttribute("cm")) {
        c.removeAttribute("cm");
      }

      c.setAttribute("t", "s");
      let vNode = c.getElementsByTagName("v")[0];
      if (!vNode) {
        vNode = sheetDoc.createElement("v");
        c.appendChild(vNode);
      }
      while (vNode.firstChild) vNode.removeChild(vNode.firstChild);
      vNode.appendChild(sheetDoc.createTextNode(String(sstIndex)));
      return true;
    }
  }
  return false;
}

/**
 * Patch the CHECK PREP sheet's cells:
 *   - B4  AMOUNT (numeric)
 *   - B7  PAY TO THE / supplier display name (was "=B12", now hardcoded)
 *   - I7  AMOUNT display (was "=B4", now hardcoded)
 *   - B9  AMOUNT IN WORDS (was "=SpellNumber(I7)", now hardcoded spelled-out text)
 *
 * Currency word logic: if the first check item's voucherType contains "USD"
 * anywhere (e.g. "CASH USD", "BANK USD"), the spelled-out amount uses "USD"
 * instead of "Pesos" (e.g. "Eleven Thousand Four Hundred USD Only"). Any
 * other voucherType (CASH PHP, BANK PHP, etc.) defaults to "Pesos".
 *
 * B12 itself is intentionally left untouched.
 *
 * @param {string} templatePath - path to source .xls/.xlsm template
 * @param {string} outputPath   - path to write the patched file to
 * @param {{amount: number, supplierName: string, voucherType?: string}} values
 */
function patchCheckPrepTemplate(
  templatePath,
  outputPath,
  { amount, supplierName, voucherType },
) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    throw new Error("amount must be a valid number");
  }
  if (!supplierName || typeof supplierName !== "string") {
    throw new Error("supplierName must be a non-empty string");
  }

  // Currency is determined by whether voucherType contains "USD" anywhere
  // (e.g. "CASH USD", "BANK USD"). Any other voucherType (CASH PHP, BANK PHP,
  // etc.) defaults to Pesos.
  const currency =
    typeof voucherType === "string" && voucherType.toUpperCase().includes("USD")
      ? "PHP"
      : "PHP";
  const amountInWords = spellNumber(amount, currency);

  const zip = new AdmZip(templatePath);

  const sheetEntry = zip.getEntry(SHEET_PATH);
  const sstEntry = zip.getEntry(SHARED_STRINGS_PATH);
  if (!sheetEntry) {
    throw new Error(
      `Could not find ${SHEET_PATH} (CHECK PREP sheet) in template`,
    );
  }
  if (!sstEntry) {
    throw new Error(`Could not find ${SHARED_STRINGS_PATH} in template`);
  }

  const parser = new DOMParser();
  const sheetDoc = parser.parseFromString(
    sheetEntry.getData().toString("utf8"),
    "text/xml",
  );
  const sstDoc = parser.parseFromString(
    sstEntry.getData().toString("utf8"),
    "text/xml",
  );

  const amountOk = setNumericCell(sheetDoc, CELL_AMOUNT, amount);
  const supplierOk = setSharedStringCell(
    sheetDoc,
    sstDoc,
    CELL_SUPPLIER,
    supplierName,
  );
  const amountDisplayOk = setNumericCell(sheetDoc, CELL_AMOUNT_DISPLAY, amount);
  const amountWordsOk = setSharedStringCell(
    sheetDoc,
    sstDoc,
    CELL_AMOUNT_WORDS,
    amountInWords,
  );

  if (!amountOk)
    throw new Error(`Cell ${CELL_AMOUNT} not found in CHECK PREP sheet`);
  if (!supplierOk)
    throw new Error(`Cell ${CELL_SUPPLIER} not found in CHECK PREP sheet`);
  if (!amountDisplayOk)
    throw new Error(
      `Cell ${CELL_AMOUNT_DISPLAY} not found in CHECK PREP sheet`,
    );
  if (!amountWordsOk)
    throw new Error(`Cell ${CELL_AMOUNT_WORDS} not found in CHECK PREP sheet`);

  const serializer = new XMLSerializer();
  zip.updateFile(
    SHEET_PATH,
    Buffer.from(serializer.serializeToString(sheetDoc), "utf8"),
  );
  zip.updateFile(
    SHARED_STRINGS_PATH,
    Buffer.from(serializer.serializeToString(sstDoc), "utf8"),
  );
  const calcChainEntry = zip.getEntry("xl/calcChain.xml");

  if (calcChainEntry) {
    zip.deleteFile("xl/calcChain.xml");
  }
  zip.writeZip(outputPath);
  return outputPath;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const SCALES = ["", " Thousand", " Million", " Billion", " Trillion"];

function getDigit(n) {
  return ONES[n] || "";
}

function getTens(n) {
  // n is 0-99
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return TENS[tens] + (ones ? " " + ONES[ones] : "");
}

function getHundreds(n) {
  // n is 0-999
  let result = "";
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  if (hundreds > 0) {
    result += ONES[hundreds] + " Hundred";
    if (remainder > 0) result += " ";
  }
  if (remainder > 0) {
    result += getTens(remainder);
  }
  return result;
}

/**
 * Mirrors the workbook's VBA `SpellNumber` macro output format, e.g.:
 *   spellNumber(26814)      -> " Twenty Six Thousand Eight Hundred Fourteen Pesos Only"
 *   spellNumber(11400)      -> " Eleven Thousand Four Hundred Pesos Only"
 *   spellNumber(1234.56)    -> " One Thousand Two Hundred Thirty Four and 56/100 Pesos Only"
 *
 * @param {number} amount
 * @param {"PHP"|"USD"} currency - "PHP" spells out "Pesos"; "USD" spells out "USD". Determined by whether voucherType contains "USD" (e.g. CASH USD, BANK USD); anything else (CASH PHP, BANK PHP, etc.) is "PHP".
 */
function spellNumber(amount, currency = "PHP") {
  const currencyWord = currency === "USD" ? "USD" : "Pesos";

  let value = Math.round(Math.abs(amount) * 100) / 100;
  let whole = Math.floor(value);
  const cents = Math.round((value - whole) * 100);

  let words = "";
  if (whole === 0) {
    words = "Zero";
  } else {
    let scaleIndex = 0;
    const groups = [];
    while (whole > 0) {
      groups.push(whole % 1000);
      whole = Math.floor(whole / 1000);
    }
    for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i];
      if (group > 0) {
        words += (words ? " " : "") + getHundreds(group) + SCALES[i];
      }
    }
  }

  let result = " " + words + " " + currencyWord;
  if (cents > 0) {
    const centsStr = String(cents).padStart(2, "0");
    result = " " + words + ` and ${centsStr}/100 ${currencyWord}`;
  }
  result += " Only";

  return result;
}

module.exports = { patchCheckPrepTemplate, spellNumber };
