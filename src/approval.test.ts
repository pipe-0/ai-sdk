import type { Pipe0 } from "@pipe0/client";
import { generateText } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it, vi } from "vitest";
import { pipe0Tools } from "./index.js";

const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 1, text: 1, reasoning: 0 },
};

function modelCalling(toolName: string, input: unknown) {
  return new MockLanguageModelV4({
    doGenerate: async () => ({
      content: [
        { type: "tool-call", toolCallId: "call-1", toolName, input: JSON.stringify(input) },
      ],
      finishReason: { unified: "tool-calls", raw: undefined },
      usage,
      warnings: [],
    }),
  });
}

describe("toolApproval", () => {
  it("stops a call that needs user approval before it reaches pipe0", async () => {
    const client = new Proxy({} as Pipe0, {
      get: () => vi.fn(() => Promise.reject(new Error("pipe0 must not be called"))),
    });

    const result = await generateText({
      model: modelCalling("enrichPerson", {
        profileUrl: "https://linkedin.com/in/jane",
        find: ["work_email"],
      }),
      prompt: "Get Jane's work email.",
      tools: pipe0Tools({ client }),
      toolApproval: { enrichPerson: "user-approval" },
    });

    expect(result.content.map((part) => part.type)).toContain("tool-approval-request");
    expect(result.toolResults).toEqual([]);
  });
});
