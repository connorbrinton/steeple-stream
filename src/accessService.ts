import type { AccessRole, PersonAccess, Unit } from "./domain.js";

interface AccessStore {
  listUnits(): Unit[];
  listManagedPeople(): PersonAccess[];
  saveManagedPerson(person: Omit<PersonAccess, "source">): PersonAccess;
}

interface AccessConfig {
  adminEmails: Set<string>;
  operatorEmails: Set<string>;
}

export class AccessService {
  constructor(
    private readonly store: AccessStore,
    private readonly config: AccessConfig,
  ) {}

  listPeople(): PersonAccess[] {
    const people = new Map(
      this.store.listManagedPeople().map((person) => [person.email.toLowerCase(), person]),
    );
    for (const email of this.config.operatorEmails) {
      if (!people.has(email))
        people.set(email, {
          email,
          role: "broadcaster",
          unitIds: [],
          enabled: true,
          source: "configuration",
        });
    }
    for (const email of this.config.adminEmails) {
      const existing = people.get(email);
      people.set(email, {
        email,
        role: "administrator",
        unitIds: existing?.unitIds || [],
        enabled: true,
        source: "configuration",
      });
    }
    return [...people.values()].toSorted((left, right) => left.email.localeCompare(right.email));
  }

  roleFor(email: string): "operator" | "administrator" | null {
    const normalized = email.trim().toLowerCase();
    if (this.config.adminEmails.has(normalized)) return "administrator";
    if (this.config.operatorEmails.has(normalized)) return "operator";
    const person = this.store
      .listManagedPeople()
      .find((entry) => entry.email.toLowerCase() === normalized && entry.enabled);
    if (!person) return null;
    return person.role === "administrator" ? "administrator" : "operator";
  }

  unitIdsFor(email: string): string[] {
    return this.listPeople().find((person) => person.email === email.toLowerCase())?.unitIds || [];
  }

  save(input: Record<string, unknown>, originalEmail?: string): PersonAccess {
    const email = String(input.email || "")
      .trim()
      .toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid("A valid email address is required");
    const role = input.role;
    if (role !== "broadcaster" && role !== "administrator") invalid("Access role is invalid");
    const unitIds = Array.isArray(input.unitIds)
      ? [...new Set(input.unitIds.filter((value): value is string => typeof value === "string"))]
      : [];
    const activeUnitIds = new Set(
      this.store
        .listUnits()
        .filter((unit) => !unit.archivedAt)
        .map((unit) => unit.id),
    );
    if (unitIds.some((unitId) => !activeUnitIds.has(unitId)))
      invalid("One or more units were not found");
    if (unitIds.length === 0) invalid("Assign at least one unit");
    if (originalEmail && originalEmail.toLowerCase() !== email)
      invalid("Email addresses cannot be changed; disable the old entry and add a new one");
    if (this.config.adminEmails.has(email) && (role !== "administrator" || input.enabled === false))
      invalid("Administrators configured by the server cannot be demoted or disabled", 409);
    if (
      this.config.operatorEmails.has(email) &&
      (role !== "broadcaster" || input.enabled === false)
    )
      invalid("Broadcasters configured by the server cannot be promoted or disabled", 409);
    return this.store.saveManagedPerson({
      email,
      role: role as AccessRole,
      unitIds,
      enabled: input.enabled !== false,
    });
  }
}

function invalid(message: string, status = 400): never {
  throw Object.assign(new Error(message), { status });
}
