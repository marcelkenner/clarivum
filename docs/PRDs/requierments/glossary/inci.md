INCI normalization & tokenization

normalize_inci(text: string) → list[str]

Lowercase.

Strip diacritics.

Replace separators ; / | • · → ,.

Collapse multiple spaces.

Remove enclosing brackets () [] {} but keep inner text.

Split by ,.

Trim each token; discard empty tokens.

De‑duplicate while preserving order (first mention wins).

Return list.