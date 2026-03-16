const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
  "want",
  "needs",
  "need",
  "interested",
  "looking",
  "large",
  "small",
  "many",
  "much",
  "more",
  "less",
  "very",
  "really",
  "about",
]);

const WEAK_ENDINGS = ["ing", "ed", "ly"];

const PHRASE_RULES = [
  {
    pattern: /\bsingle consistent energy provider\b/i,
    replace: "Sole Provider",
  },
  { pattern: /\bsingle energy provider\b/i, replace: "Sole Provider" },
  { pattern: /\bconfused about billing\b/i, replace: "Billing Confusion" },
  { pattern: /\bbilling confusion\b/i, replace: "Billing Confusion" },
  { pattern: /\bdon't understand pricing\b/i, replace: "Pricing Clarity" },
  { pattern: /\bpricing confusion\b/i, replace: "Pricing Clarity" },
  { pattern: /\bdelay in permitting\b/i, replace: "Permitting Delay" },
  { pattern: /\bpermitting delays?\b/i, replace: "Permitting Delay" },
];

export function suggestStickyTitle(description, options = {}) {
  for (const rule of PHRASE_RULES) {
    if (rule.pattern.test(description || "")) {
      return rule.replace;
    }
  }

  return shortenStickyTitle(description, options);
}

export function shortenStickyTitle(description, options = {}) {
  const { maxWords = 4, maxChars = 24 } = options;

  if (!description || !description.trim()) return "";

  const originalWords = description
    .replace(/[^\w\s/-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const scored = originalWords.map((word, index) => {
    const lower = word.toLowerCase();
    const normalized = lower.replace(/[^a-z0-9/-]/g, "");
    const isStop = STOP_WORDS.has(normalized);
    const isCapitalized = /^[A-Z]/.test(word);
    const isAllCaps = /^[A-Z0-9]{2,}$/.test(word);
    const isNumber = /^\d+$/.test(normalized);
    const weakEnding = WEAK_ENDINGS.some((ending) =>
      normalized.endsWith(ending),
    );

    let score = 0;
    if (!isStop) score += 3;
    if (isCapitalized) score += 2;
    if (isAllCaps) score += 2;
    if (normalized.length >= 4) score += 2;
    if (normalized.length >= 7) score += 1;
    if (isNumber) score -= 1;
    if (weakEnding) score -= 1;

    return {
      original: word,
      normalized,
      index,
      score,
      isStop,
    };
  });

  const strongWords = scored
    .filter((word) => word.normalized && !word.isStop)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const chosen = [];
  const used = new Set();

  for (const word of strongWords) {
    if (chosen.length >= maxWords) break;
    if (used.has(word.normalized)) continue;
    chosen.push(word);
    used.add(word.normalized);
  }

  chosen.sort((a, b) => a.index - b.index);

  let title = chosen.map((word) => toTitleWord(word.original)).join(" ");

  if (!title) {
    title = originalWords
      .slice(0, maxWords)
      .map((word) => toTitleWord(word))
      .join(" ");
  }

  if (title.length > maxChars) {
    const kept = [];
    for (const word of title.split(/\s+/)) {
      const next = [...kept, word].join(" ");
      if (next.length > maxChars) break;
      kept.push(word);
    }
    title = kept.join(" ");
  }

  return cleanupTitle(title);
}

export function validateStickyTitle(title, options = {}) {
  const { maxWords = 4, maxChars = 24 } = options;
  const clean = String(title || "").trim();
  const words = clean ? clean.split(/\s+/) : [];

  if (!clean) {
    return { valid: false, message: "Enter a short title." };
  }

  if (words.length > maxWords) {
    return {
      valid: false,
      message: `Use ${maxWords} words or fewer.`,
    };
  }

  if (clean.length > maxChars) {
    return {
      valid: false,
      message: `Use ${maxChars} characters or fewer.`,
    };
  }

  return { valid: true, message: "" };
}

export function attachStickyTitleHelpers({
  titleInput,
  descriptionInput,
  suggestionEl,
  validationEl,
  maxWords = 4,
  maxChars = 24,
  autofillWhenBlank = true,
}) {
  if (!titleInput || !descriptionInput) {
    throw new Error("titleInput and descriptionInput are required.");
  }

  function updateSuggestion() {
    const suggestion = suggestStickyTitle(descriptionInput.value, {
      maxWords,
      maxChars,
    });

    if (suggestionEl) {
      suggestionEl.textContent = suggestion
        ? `Suggested title: ${suggestion}`
        : "";
    }

    return suggestion;
  }

  function updateValidation() {
    const result = validateStickyTitle(titleInput.value, {
      maxWords,
      maxChars,
    });

    if (validationEl) {
      validationEl.textContent = result.message;
      validationEl.hidden = result.valid;
    }

    titleInput.setCustomValidity(result.valid ? "" : result.message);
    return result;
  }

  function maybeAutofill() {
    const suggestion = updateSuggestion();
    const titleIsBlank = !titleInput.value.trim();

    if (autofillWhenBlank && titleIsBlank && suggestion) {
      titleInput.value = suggestion;
    }

    updateValidation();
  }

  descriptionInput.addEventListener("input", updateSuggestion);
  descriptionInput.addEventListener("blur", maybeAutofill);
  titleInput.addEventListener("input", updateValidation);
  titleInput.addEventListener("blur", updateValidation);

  updateSuggestion();
  updateValidation();

  return {
    refreshSuggestion: updateSuggestion,
    refreshValidation: updateValidation,
    autofill: maybeAutofill,
  };
}

function toTitleWord(word) {
  const cleaned = String(word).replace(/^[^\w]+|[^\w]+$/g, "");
  if (!cleaned) return "";
  if (/^[A-Z0-9]{2,}$/.test(cleaned)) return cleaned;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

function cleanupTitle(title) {
  return String(title)
    .replace(/\bAnd\b/g, "")
    .replace(/\bOf\b/g, "")
    .replace(/\bThe\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
