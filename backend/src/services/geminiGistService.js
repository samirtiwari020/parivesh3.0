const env = require("../config/env");

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
];

const buildGistPrompt = ({
  projectTitle,
  category,
  location,
  documentText,
}) => {
  return `You are an Environmental Clearance Analyst working for the government review committee.

Your task is to analyze environmental clearance proposal documents submitted by a Project Proponent and generate a structured GIST summary that will be used for committee meetings.

Instructions:

1. Carefully analyze the provided project documents.
2. Extract the most relevant project information.
3. Summarize the project clearly and concisely.
4. Ignore unnecessary or repetitive text.
5. Generate the output in a structured official format.
6. If some information is missing, write "Not Mentioned".
7. Maintain a formal government report style.

Project Information:
Project Title: ${projectTitle || "Not Mentioned"}
Location: ${location || "Not Mentioned"}
Category: ${category || "Not Mentioned"}

Proposal Documents Content:
${documentText || "Not Mentioned"}

Generate the GIST in the following format:

--------------------------------------------------

1. Project Overview
Brief description of the project including location, project type, and purpose.

2. Project Proponent Details
- Name of Proponent
- Organization
- Contact Information (if available)

3. Key Project Details

| Parameter | Details |
|-----------|--------|
| Project Type | |
| Category | |
| Location | |
| Area / Capacity | |
| Mining / Construction Type | |

4. Environmental Impact Summary
Summarize possible environmental impacts such as:
- impact on water
- impact on air
- impact on biodiversity
- nearby villages / forests

5. Mitigation Measures
List proposed environmental protection measures such as:
- plantation
- pollution control
- monitoring systems
- sustainable practices

6. Compliance Status

| Requirement | Status |
|------------|-------|
| Environmental Clearance | |
| Mining Plan Approval | |
| NOC from Local Authority | |
| Environmental Management Plan | |

7. Key Observations
List important points extracted from the documents.

8. Committee Recommendation
Provide a short neutral recommendation for committee discussion.

--------------------------------------------------

Keep the GIST clear, professional, and suitable for use in an official environmental clearance meeting document.`;
};

const buildMoMPrompt = ({
  projectTitle,
  category,
  location,
  gistText,
}) => {
  return `You are drafting an official Minute of Meeting (MoM) for an environmental clearance committee.

Use the edited GIST and convert it into a well-structured, formal, government-style MoM document.

Instructions:
1. Preserve facts from the provided GIST. Do not invent unsupported facts.
2. Use a formal committee minute tone and precise language.
3. Include clear headings and concise paragraphs.
4. Include a section for deliberations, observations, and final decision.
5. Include specific compliance/safeguard directions where relevant.
6. If information is unavailable, write "Not Mentioned".
7. Return plain text only, no markdown code blocks.

Project Information:
Project Title: ${projectTitle || "Not Mentioned"}
Category: ${category || "Not Mentioned"}
Location: ${location || "Not Mentioned"}

Edited GIST Content:
${gistText || "Not Mentioned"}

Return output in this format:

MINUTE OF MEETING (MoM)
1. Meeting Context
2. Project Particulars
3. Summary of Deliberations
4. Environmental and Compliance Observations
5. Committee Decision
6. Conditions / Safeguards
7. Follow-up Actions

Keep the result publication-ready for official records.`;
};

const parseGeminiText = (payload) => {
  const candidates = payload?.candidates;

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return "";
  }

  const parts = candidates[0]?.content?.parts;

  if (!Array.isArray(parts) || parts.length === 0) {
    return "";
  }

  return parts
    .map((part) => part?.text || "")
    .join("\n")
    .trim();
};

const generateGeminiText = async ({ parts, maxOutputTokens = 650, temperature = 0.2 }) => {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const candidateModels = [env.GEMINI_MODEL, ...DEFAULT_MODELS].filter(
    (model, index, values) => model && values.indexOf(model) === index
  );

  let lastError;

  for (const model of candidateModels) {
    const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature,
            maxOutputTokens,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini request failed for ${model} (${response.status}): ${errorText}`);
      }

      const payload = await response.json();
      const text = parseGeminiText(payload);

      if (!text) {
        throw new Error(`Gemini returned empty output for ${model}`);
      }

      return {
        text,
        model,
      };
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Gemini request failed");
};

const extractTextWithGeminiOcr = async ({ buffer, mimeType, fileName }) => {
  const result = await generateGeminiText({
    parts: [
      {
        text: `Extract all readable text from this environmental clearance document. Preserve headings, bullet points, table-like information, measurements, names, places, and compliance terms as plain text. Ignore page numbers or repeated headers where possible. Return only the extracted text for the document ${fileName || "document"}. If the file has no readable text, return NOT_READABLE.`,
      },
      {
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
    ],
    maxOutputTokens: 8192,
    temperature: 0,
  });

  return {
    extractedText: result.text,
    model: result.model,
  };
};

const generateGistFromGemini = async (prompt) => {
  const result = await generateGeminiText({
    parts: [{ text: prompt }],
    maxOutputTokens: 3000,
    temperature: 0.2,
  });

  return {
    gistText: result.text,
    model: result.model,
  };
};

const generateMoMFromGemini = async (prompt) => {
  const result = await generateGeminiText({
    parts: [{ text: prompt }],
    maxOutputTokens: 4000,
    temperature: 0.2,
  });

  return {
    momText: result.text,
    model: result.model,
  };
};

module.exports = {
  buildGistPrompt,
  buildMoMPrompt,
  extractTextWithGeminiOcr,
  generateGistFromGemini,
  generateMoMFromGemini,
};
