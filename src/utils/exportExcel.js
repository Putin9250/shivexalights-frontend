import * as XLSX from "xlsx";

const productColumns = [
  "Title", "Description", "Price", "Old Price", "Stock", "Categories",
  "Image 1 URL", "Image 2 URL", "Image 3 URL", "Image 4 URL", "Sizes",
  "New Arrival", "Featured", "Trending", "Recommended Products (IDs or titles)",
];

const getCell = (row, names) => {
  const entries = Object.entries(row || {});
  const match = entries.find(([key]) => names.includes(String(key).trim().toLowerCase()));
  return match ? match[1] : "";
};

const asNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) return fallback;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asBoolean = (value) => ["true", "yes", "y", "1"].includes(String(value ?? "").trim().toLowerCase());
const splitValues = (value) => String(value || "").split(/[|,]/).map(item => item.trim()).filter(Boolean);

export const downloadProductImportTemplate = () => {
  const workbook = XLSX.utils.book_new();
  const templateRows = [
    {
      Title: "Example Crystal Chandelier",
      Description: "Premium chandelier with warm ambient lighting.",
      Price: 24999,
      "Old Price": 28999,
      Stock: 12,
      Categories: "Chandelier, Luxury Lighting",
      "Image 1 URL": "https://example.com/product-main.jpg",
      "Image 2 URL": "https://example.com/product-hover.jpg",
      "Image 3 URL": "",
      "Image 4 URL": "",
      Sizes: "Small:24999:5, Large:28999:7",
      "New Arrival": "TRUE",
      Featured: "TRUE",
      Trending: "FALSE",
      "Recommended Products (IDs or titles)": "Example Pendant Light",
    },
    {
      Title: "Example Pendant Light",
      Description: "A matching pendant light for the same collection.",
      Price: 12999,
      "Old Price": "",
      Stock: 8,
      Categories: "Pendant Light",
      "Image 1 URL": "https://example.com/pendant-main.jpg",
      "Image 2 URL": "",
      "Image 3 URL": "",
      "Image 4 URL": "",
      Sizes: "Standard:12999:8",
      "New Arrival": "FALSE",
      Featured: "FALSE",
      Trending: "TRUE",
      "Recommended Products (IDs or titles)": "Example Crystal Chandelier",
    },
  ];
  const templateSheet = XLSX.utils.json_to_sheet(templateRows, { header: productColumns });
  templateSheet["!cols"] = productColumns.map((column) => ({ wch: Math.min(Math.max(column.length + 4, 16), 42) }));
  XLSX.utils.book_append_sheet(workbook, templateSheet, "Products");

  const guideRows = [
    ["Product import format"],
    ["Column", "How to fill it"],
    ["Title", "Required. Product name."],
    ["Description", "Optional product description."],
    ["Price", "Required. Numeric price, without currency symbols preferred."],
    ["Old Price", "Optional original price."],
    ["Stock", "Whole-product stock. Use 0 when unavailable."],
    ["Categories", "Separate categories with commas."],
    ["Image 1 URL to Image 4 URL", "Public image URLs. Image 1 is the main image."],
    ["Sizes", "Optional. Format each size as Name:Price:Stock. Separate sizes with commas."],
    ["New Arrival, Featured, Trending", "Use TRUE/FALSE, YES/NO, or 1/0."],
    ["Recommended Products (IDs or titles)", "Optional. Separate up to 8 product titles or product IDs with |. Imported rows can reference each other by title."],
  ];
  const guideSheet = XLSX.utils.aoa_to_sheet(guideRows);
  guideSheet["!cols"] = [{ wch: 38 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(workbook, guideSheet, "Instructions");
  XLSX.writeFile(workbook, "shivexa-product-import-template.xlsx");
};

export const readProductImportFile = async (file) => {
  const bytes = await file.arrayBuffer();
  const workbook = XLSX.read(bytes, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error("The workbook does not contain a Products sheet");
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { defval: "" });
  if (!rows.length) throw new Error("The first worksheet has no product rows");

  const errors = [];
  const products = rows.map((row, index) => {
    const title = String(getCell(row, ["title", "product"]) || "").trim();
    const priceRaw = getCell(row, ["price"]);
    const price = asNumber(priceRaw, NaN);
    if (!title) errors.push(`Row ${index + 2}: Title is required`);
    if (!Number.isFinite(price) || price < 0) errors.push(`Row ${index + 2}: Price must be a valid number`);
    const sizes = String(getCell(row, ["sizes"]) || "").split(/[,|]/).map((entry) => {
      const [name, sizePrice, sizeStock] = entry.trim().split(":");
      if (!name || !Number.isFinite(asNumber(sizePrice, NaN))) return null;
      return { name: name.trim(), price: asNumber(sizePrice), ...(sizeStock !== undefined && sizeStock !== "" ? { stock: asNumber(sizeStock) } : {}) };
    }).filter(Boolean);
    return {
      payload: {
        title,
        description: String(getCell(row, ["description"]) || "").trim(),
        price,
        oldPrice: (() => { const value = getCell(row, ["old price", "oldprice"]); return value === "" ? undefined : asNumber(value); })(),
        stock: asNumber(getCell(row, ["stock"])),
        categories: splitValues(getCell(row, ["categories", "category"])),
        img: String(getCell(row, ["image 1 url", "img", "image 1"]) || "").trim(),
        img2: String(getCell(row, ["image 2 url", "img2", "image 2"]) || "").trim(),
        img3: String(getCell(row, ["image 3 url", "img3", "image 3"]) || "").trim(),
        img4: String(getCell(row, ["image 4 url", "img4", "image 4"]) || "").trim(),
        sizes,
        isNew: asBoolean(getCell(row, ["new arrival", "new", "isnew"])),
        isFeatured: asBoolean(getCell(row, ["featured", "isfeatured"])),
        isTrending: asBoolean(getCell(row, ["trending", "istrending"])),
      },
      recommendations: splitValues(getCell(row, ["recommended products (ids or titles)", "recommended products", "recommendations"])),
      rowNumber: index + 2,
    };
  });
  if (errors.length) throw new Error(errors.slice(0, 6).join(". "));
  return products;
};

const safeFilePart = (value) => String(value || "export")
  .trim()
  .replace(/[^a-z0-9_-]+/gi, "-")
  .replace(/^-+|-+$/g, "");

export const exportRowsToExcel = ({ fileName, sheetName, rows }) => {
  if (!rows?.length) return false;

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const headers = Object.keys(rows[0]);
  worksheet["!cols"] = headers.map((header) => {
    const widestValue = rows.reduce(
      (widest, row) => Math.max(widest, String(row[header] ?? "").length),
      header.length
    );
    return { wch: Math.min(Math.max(widestValue + 2, 12), 48) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, `${safeFilePart(fileName)}.xlsx`);
  return true;
};
