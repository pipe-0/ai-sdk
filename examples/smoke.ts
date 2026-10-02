// Runs every tool once against the live API. Defaults to sandbox (free):
//   PIPE0_API_KEY=... npx tsx examples/smoke.ts
//   PIPE0_ENV=production PIPE0_API_KEY=... npx tsx examples/smoke.ts
import { pipe0Tools } from "../src/index.js";

const environment = (process.env.PIPE0_ENV ?? "sandbox") as "sandbox" | "production";
const tools = pipe0Tools({ environment });
const opts = { toolCallId: "smoke", messages: [], context: {} } as never;

const run = async (label: string, fn: () => unknown) => {
  const started = Date.now();
  try {
    const result = await fn();
    console.log(`\n# ${label} (${Date.now() - started}ms)`);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`# ${label} FAILED`, err);
    process.exitCode = 1;
  }
};

console.log(`environment: ${environment}`);
await run("enrichCompany", () => tools.enrichCompany.execute!({ domain: "stripe.com" }, opts));
await run("enrichPerson (name + domain)", () =>
  tools.enrichPerson.execute!(
    { name: "Patrick Collison", companyDomain: "stripe.com", find: ["work_email", "profile"] },
    opts,
  ),
);
await run("enrichPerson (profile URL)", () =>
  tools.enrichPerson.execute!(
    { profileUrl: "https://www.linkedin.com/in/patrickcollison", find: ["work_email", "mobile", "profile"] },
    opts,
  ),
);
await run("findPeople", () =>
  tools.findPeople.execute!(
    { jobTitles: ["Head of Sales"], locations: ["Berlin, Germany"], limit: 3 },
    opts,
  ),
);
