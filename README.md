# @pipe0/ai-sdk

**GTM data for agents.** [pipe0](https://www.pipe0.com) tools for the [Vercel AI SDK](https://ai-sdk.dev): find people and enrich them with verified work emails, phone numbers, profiles, and firmographics from dozens of data providers.

Each tool runs a pipe0 **waterfall**: providers are tried in order until one finds the value, so your agent gets the best available coverage from one call and one API key.

| Tool | What it does |
| --- | --- |
| `findPeople` | Search for prospects by job title, employer, seniority, job function, company size, and location. |
| `enrichPerson` | Find a person's work email, mobile number, and profile from a LinkedIn URL, an email, or name + company domain. |
| `enrichCompany` | Get firmographics for a company domain: description, industry, headcount, revenue, founding year. |

## Install

```bash
npm install @pipe0/ai-sdk
```

Get an API key at [app.pipe0.com](https://app.pipe0.com) and set it as `PIPE0_API_KEY`. New accounts include free credits.

## Usage

```ts
import { generateText, isStepCount } from "ai";
import { pipe0Tools } from "@pipe0/ai-sdk";

const { text } = await generateText({
  model: "openai/gpt-5-mini",
  prompt: "Find the CTO of Linear and get their work email.",
  tools: pipe0Tools(),
  stopWhen: isStepCount(10),
});

console.log(text);
```

Or pick individual tools:

```ts
import { enrichPerson, findPeople } from "@pipe0/ai-sdk";

const tools = {
  findPeople: findPeople(),
  enrichPerson: enrichPerson(),
};
```

## Options

Every tool (and `pipe0Tools`) accepts the same options:

```ts
pipe0Tools({
  apiKey: "...",           // defaults to process.env.PIPE0_API_KEY
  environment: "sandbox",  // "production" (default) or "sandbox": free placeholder data for development
});
```

You can also pass a configured `client` from [`@pipe0/client`](https://www.npmjs.com/package/@pipe0/client).

## Approve calls before they run

Every call spends credits in production. In agents where users trigger the calls, ask for approval with the AI SDK's `toolApproval`:

```ts
const result = await generateText({
  model: "openai/gpt-5-mini",
  prompt: "Get the work email of the CTO of Linear.",
  tools: pipe0Tools(),
  toolApproval: {
    enrichPerson: "user-approval",
  },
  stopWhen: isStepCount(10),
});
```

On AI SDK 5 and 6, which have no `toolApproval`, pass `needsApproval: true` to the tools instead. It is deprecated on AI SDK 7.

## Credits

Tool calls run in `production` by default and spend pipe0 credits: roughly 0.1 credits per `findPeople` result and from 0.5 credits per value found by `enrichPerson`. Use `environment: "sandbox"` while building. See [pricing](https://www.pipe0.com/pricing).

## Security and personal data

Run the tools on your server and keep `PIPE0_API_KEY` out of client bundles. Anyone with the key can spend your credits.

`findPeople` and `enrichPerson` return personal contact data. Make sure your use complies with the privacy and marketing rules that apply to you (for example GDPR or CAN-SPAM), and only show results to users allowed to see them.

## Beyond these tools

pipe0 covers much more than search and enrichment: buying signals (job changes, funding, new hires), routing leads to HubSpot, Salesforce, Attio, or Slack, and scheduled lead lists in pipe0 sheets. Use the [REST API and `@pipe0/client`](https://www.pipe0.com/docs) for the full catalog, or connect the [pipe0 MCP server](https://www.pipe0.com/docs/sdks/mcp) to an agent.

## License

MIT
