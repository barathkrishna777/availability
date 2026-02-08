import Anthropic from "@anthropic-ai/sdk";
import { ExtractionResult } from "./types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

const client = new Anthropic();

function parseJSON(text: string): ExtractionResult {
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch {
    // ignore
  }

  // Try extracting from code fence
  const codeFenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeFenceMatch) {
    try {
      return JSON.parse(codeFenceMatch[1]);
    } catch {
      // ignore
    }
  }

  // Try first-{ to last-} substring
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    } catch {
      // ignore
    }
  }

  throw new Error("Failed to parse Claude response as JSON");
}

export async function extractEvents(
  base64Images: string[]
): Promise<ExtractionResult> {
  const content: Anthropic.Messages.ContentBlockParam[] = [];

  for (let i = 0; i < base64Images.length; i++) {
    if (base64Images.length > 1) {
      content.push({ type: "text", text: `Screenshot ${i + 1}:` });
    }

    const base64 = base64Images[i];
    // Detect media type from base64 header or default to png
    let mediaType: "image/png" | "image/jpeg" | "image/gif" | "image/webp" =
      "image/png";
    if (base64.startsWith("/9j/")) mediaType = "image/jpeg";
    else if (base64.startsWith("R0lGOD")) mediaType = "image/gif";
    else if (base64.startsWith("UklGR")) mediaType = "image/webp";

    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType,
        data: base64,
      },
    });
  }

  content.push({
    type: "text",
    text: buildUserPrompt(base64Images.length),
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return parseJSON(textBlock.text);
}
