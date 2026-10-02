// The README / registry example, run for real.
import { generateText, isStepCount } from "ai";
import { pipe0Tools } from "../src/index.js";

const { text, steps } = await generateText({
  model: "openai/gpt-5-mini",
  prompt: "Find the CTO of Linear and get their work email.",
  tools: pipe0Tools(),
  stopWhen: isStepCount(10),
});

for (const step of steps) {
  for (const call of step.toolCalls) console.log("CALL", call.toolName, JSON.stringify(call.input));
  for (const result of step.toolResults) console.log("RESULT", result.toolName, JSON.stringify(result.output).slice(0, 600));
}
console.log("\nTEXT:\n" + text);
