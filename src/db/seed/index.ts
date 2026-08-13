import "dotenv/config";
import { db, pool } from "../index.js";
import { organization } from "../schema/organization.js";
import { users } from "../schema/users.js";
import { projects } from "../schema/projects.js";

async function main() {
  console.log("Seeding projects...");

  const [existingOrganization] = await db
    .select()
    .from(organization)
    .limit(1);
  const [manager] = await db.select().from(users).limit(1);

  if (!existingOrganization) {
    throw new Error(
      "No organization found. Create at least one organization before seeding projects."
    );
  }

  await db.insert(projects).values([
    {
      companyId: existingOrganization.id,
      projectManagerId: manager?.id ?? null,
      name: "Website Redesign",
      code: "WEB-001",
      description: "Revamp the marketing website with the new brand identity.",
      status: "active",
      priority: "high",
      startDate: "2026-06-01",
      dueDate: "2026-09-30",
      budgetAmount: "45000.00",
      progressPercent: 35,
    },
    {
      companyId: existingOrganization.id,
      projectManagerId: manager?.id ?? null,
      name: "Mobile App Launch",
      code: "MOB-002",
      description: "Ship v1 of the iOS and Android apps.",
      status: "planned",
      priority: "critical",
      startDate: "2026-09-01",
      dueDate: "2027-01-15",
      budgetAmount: "120000.00",
      progressPercent: 0,
    },
    {
      companyId: existingOrganization.id,
      projectManagerId: manager?.id ?? null,
      name: "Internal Tooling Cleanup",
      code: "OPS-003",
      description: "Consolidate internal scripts and dashboards.",
      status: "on_hold",
      priority: "low",
      startDate: "2026-03-01",
      dueDate: "2026-05-01",
      budgetAmount: "8000.00",
      progressPercent: 60,
    },
  ]);

  console.log("Seed complete: 3 sample projects created.");
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});