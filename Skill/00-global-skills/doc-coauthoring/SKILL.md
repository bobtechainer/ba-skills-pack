---
name: doc-coauthoring
description: Use when co-authoring, polishing, proofreading, reader-testing, or doing a final quality review for structured documents before sharing them with users or stakeholders.
metadata:
  category: writing
  triggers: co-author, coauthoring, proofread, spelling, grammar, chính tả, soát lỗi, reader test, reader-test, final review, final verification, verify cuối, trước khi xuất output
---

# Doc Coauthoring — Thin Alias for Collaborative Document Review

This skill is a compatibility wrapper for `document-suite` with `mode=collab`.
Do not duplicate the document-suite workflow here. Open and follow `Skill/00-global-skills/document-suite/SKILL.md`, then use `mode=collab`.

## When to Use

Use this skill when the user wants to write **with** the agent, or when a document needs one final human-facing review before output:

- refine wording, structure, and clarity with the user
- check spelling, grammar, terminology, and Vietnamese naturalness
- catch ambiguity, missing context, or reader confusion
- run a blind reader test before sending `.md`, `.html`, `.docx`, or `.pdf`
- verify final output after generation/export but before reporting it as done

## Required Flow

1. **Context Gathering** — confirm audience, purpose, source docs, tone, and what the reader must do after reading.
2. **Refinement & Structure** — review section by section; edit only with clear rationale.
3. **Proofread Pass** — check chính tả, grammar, punctuation, formatting consistency, glossary terms, and repeated/awkward phrasing.
4. **Reader Testing** — dispatch a fresh agent with no session context. Give it only the candidate document/output and ask it to summarize, list questions, and flag confusing passages.
5. **Fix & Re-test** — address real issues and re-run reader testing until no blocking ambiguity remains.

## Final Verification Checklist

Before returning output to the user:

- [ ] `document-suite mode=collab` was used or its collab stages were followed.
- [ ] Spelling/chính tả and grammar pass completed.
- [ ] Terminology is consistent with glossary/domain conventions.
- [ ] No unresolved placeholders, `TODO`, `[MANUAL]` without explanation, or raw `[CROSS-REF]` remain.
- [ ] Reader-test feedback was addressed or explicitly reported as accepted risk.
- [ ] Final file path/output is concrete and ready for the user.

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Treating this as a separate generator | Use `document-suite mode=collab`; this skill is only an alias and quality gate. |
| Proofreading only spelling | Also check ambiguity, terminology, structure, and reader interpretation. |
| Skipping fresh reader test | Dispatch a no-context reader; self-review misses blind spots. |
| Returning output with unresolved flags | Resolve them or report them explicitly before completion. |
