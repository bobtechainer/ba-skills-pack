/**
 * verify_docx.js — Tự động kiểm tra .docx có Word comments không
 * Usage: node verify_docx.js <path-to-docx> [expected-comment-count]
 *
 * - Nếu KHÔNG có expected count → báo cáo số comments (PASS dù = 0)
 * - Nếu CÓ expected count → FAIL nếu actual < expected
 *
 * Không mở Word, không mở browser. Hoàn toàn tự động.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

function verify(docxPath, expectedMin) {
  if (!fs.existsSync(docxPath)) {
    console.log("FAIL: File not found: " + docxPath);
    process.exit(1);
  }

  const tmpDir = path.join(os.tmpdir(), "docx_verify_" + Date.now());
  const zipCopy = path.join(os.tmpdir(), "docx_verify_" + Date.now() + ".zip");

  try {
    fs.copyFileSync(docxPath, zipCopy);
    const cmd = `Expand-Archive -LiteralPath "${zipCopy}" -DestinationPath "${tmpDir}" -Force`;
    execSync(`powershell -Command "${cmd}"`, { stdio: "pipe" });

    const commentsXml = path.join(tmpDir, "word", "comments.xml");
    const documentXml = path.join(tmpDir, "word", "document.xml");

    let commentCount = 0;
    let highlightCount = 0;

    if (fs.existsSync(commentsXml)) {
      const content = fs.readFileSync(commentsXml, "utf8");
      const matches = content.match(/<w:comment /g) || [];
      commentCount = matches.length;
    }

    if (fs.existsSync(documentXml)) {
      const content = fs.readFileSync(documentXml, "utf8");
      const matches = content.match(/<w:highlight /g) || [];
      highlightCount = matches.length;
    }

    // Report
    console.log("");
    console.log("=== POST-EXPORT VERIFICATION ===");
    console.log("File: " + path.basename(docxPath));
    console.log("Size: " + (fs.statSync(docxPath).size / 1024).toFixed(1) + " KB");
    console.log("Comments: " + commentCount);
    console.log("Highlights: " + highlightCount);

    // Logic:
    // - Nếu có expected count → FAIL nếu actual < expected
    // - Nếu KHÔNG có expected count → PASS (v1 = 0 comments là hợp lệ)
    if (expectedMin != null && expectedMin > 0) {
      if (commentCount < expectedMin) {
        console.log("");
        console.log("FAIL: Expected >= " + expectedMin + " comments, got " + commentCount);
        console.log("  -> Kiem tra: .md files co [CHANGED: ...] tags khong?");
        console.log("  -> Kiem tra: export script co parseAnnotation() + CommentRangeStart khong?");
        process.exit(1);
      }
      console.log("");
      console.log("PASS: " + commentCount + " comments + " + highlightCount + " highlights verified (expected >= " + expectedMin + ").");
    } else {
      // No expected count — just report
      if (commentCount > 0) {
        console.log("");
        console.log("PASS: " + commentCount + " comments + " + highlightCount + " highlights verified.");
      } else {
        console.log("");
        console.log("PASS: 0 comments (v1 — no [CHANGED] tags expected).");
      }
    }

    process.exit(0);

  } catch (err) {
    console.log("ERROR: " + err.message);
    process.exit(1);
  } finally {
    try { fs.unlinkSync(zipCopy); } catch (e) {}
    try {
      execSync(`powershell -Command "Remove-Item -LiteralPath '${tmpDir}' -Recurse -Force -ErrorAction SilentlyContinue"`, { stdio: "pipe" });
    } catch (e) {}
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node verify_docx.js <path-to-docx> [expected-min-comments]");
  console.log("");
  console.log("  v1 (first version):  node verify_docx.js output.docx");
  console.log("  v2+ (has edits):     node verify_docx.js output.docx 5");
  process.exit(1);
}

verify(args[0], args[1] ? parseInt(args[1]) : null);
