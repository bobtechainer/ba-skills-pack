#!/usr/bin/env bash
# Build all Tier-1 documents: render diagrams → DOCX → PDF → verify → RTM
#
# Usage: ./build_all.sh [docs-root]
#
# Default docs-root: ../../docs/ (relative to skills/domain-docs/)

set -e  # exit on first error, except where handled

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_ROOT="${1:-${SKILL_DIR}/../../docs}"

cd "$SKILL_DIR"

echo "==============================================================="
echo "  Domain Docs — Build All"
echo "  Skill: $SKILL_DIR"
echo "  Docs:  $DOCS_ROOT"
echo "==============================================================="

# Ensure dependencies installed
if [ ! -d node_modules/docx ]; then
  echo ">> Installing npm dependencies..."
  npm install --silent
fi

# ----------------------------------------------------------------
# Step 1: Render Mermaid diagrams
# ----------------------------------------------------------------
echo ""
echo ">> Step 1: Rendering Mermaid diagrams..."
node scripts/render_diagrams.js "$DOCS_ROOT" || echo "  (some diagrams failed — continuing)"

# ----------------------------------------------------------------
# Step 2: Build DOCX for each Tier-1 doc folder
# ----------------------------------------------------------------
echo ""
echo ">> Step 2: Building DOCX files..."
DOCS=(
  "02_analysis/01_brd"
  "02_analysis/02_srs"
  "03_design/01_hld"
  "03_design/05_security_plan"
  "04_testing/01_test_plan"
  "05_deployment/03_user_manual"
)

BUILD_OK=0
BUILD_FAIL=0
for doc in "${DOCS[@]}"; do
  DOC_DIR="$DOCS_ROOT/$doc"
  if [ ! -d "$DOC_DIR" ]; then
    echo "  [skip] $doc (folder missing)"
    continue
  fi
  MD_COUNT=$(find "$DOC_DIR" -maxdepth 1 -name '*.md' ! -name '_*' | wc -l | tr -d ' ')
  if [ "$MD_COUNT" = "0" ]; then
    echo "  [skip] $doc (no .md files)"
    continue
  fi
  echo "  > $doc ($MD_COUNT chapters)"
  if node scripts/build_doc.js "$DOC_DIR" 2>&1 | sed 's/^/    /'; then
    BUILD_OK=$((BUILD_OK + 1))
  else
    BUILD_FAIL=$((BUILD_FAIL + 1))
  fi
done
echo "  DOCX: $BUILD_OK ok, $BUILD_FAIL failed"

# ----------------------------------------------------------------
# Step 3: Convert DOCX → PDF
# ----------------------------------------------------------------
echo ""
echo ">> Step 3: Converting DOCX to PDF..."
PDF_OK=0
PDF_FAIL=0
for doc in "${DOCS[@]}"; do
  DOC_DIR="$DOCS_ROOT/$doc"
  [ ! -d "$DOC_DIR" ] && continue
  DOCX_FILES=$(find "$DOC_DIR" -maxdepth 1 -name '*.docx' 2>/dev/null)
  if [ -z "$DOCX_FILES" ]; then
    continue
  fi
  for docx in $DOCX_FILES; do
    if node scripts/generate_pdf.js "$docx" 2>&1 | sed 's/^/    /'; then
      PDF_OK=$((PDF_OK + 1))
    else
      PDF_FAIL=$((PDF_FAIL + 1))
    fi
  done
done
echo "  PDF: $PDF_OK ok, $PDF_FAIL failed"

# ----------------------------------------------------------------
# Step 4: HTML preview (optional — dev aid)
# ----------------------------------------------------------------
echo ""
echo ">> Step 4: Generating HTML previews..."
HTML_OK=0
for doc in "${DOCS[@]}"; do
  DOC_DIR="$DOCS_ROOT/$doc"
  [ ! -d "$DOC_DIR" ] && continue
  MD_COUNT=$(find "$DOC_DIR" -maxdepth 1 -name '*.md' ! -name '_*' | wc -l | tr -d ' ')
  [ "$MD_COUNT" = "0" ] && continue
  if node scripts/generate_html.js "$DOC_DIR" 2>&1 | sed 's/^/    /'; then
    HTML_OK=$((HTML_OK + 1))
  fi
done
echo "  HTML: $HTML_OK ok"

# ----------------------------------------------------------------
# Step 5: Cross-doc verification
# ----------------------------------------------------------------
echo ""
echo ">> Step 5: Cross-doc verification..."
node scripts/verify_docs.js "$DOCS_ROOT" 2>&1 | sed 's/^/  /' || echo "  (verification warnings — review above)"

# ----------------------------------------------------------------
# Step 6: RTM generation
# ----------------------------------------------------------------
echo ""
echo ">> Step 6: Generating RTM..."
node scripts/generate_rtm.js "$DOCS_ROOT" --allow-orphans 2>&1 | sed 's/^/  /' || true

# ----------------------------------------------------------------
# Summary
# ----------------------------------------------------------------
echo ""
echo "==============================================================="
echo "  Build complete."
echo "  DOCX: $BUILD_OK/$((BUILD_OK + BUILD_FAIL))  PDF: $PDF_OK/$((PDF_OK + PDF_FAIL))  HTML: $HTML_OK"
echo "==============================================================="
echo ""
echo "Output files:"
find "$DOCS_ROOT" -maxdepth 3 -name '*.docx' -o -name '*.pdf' 2>/dev/null | sort
