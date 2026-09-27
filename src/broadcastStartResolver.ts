import type { BroadcastAssociation, Unit, UpcomingOccurrence } from "./domain.js";

interface AssignmentSource {
  unitIdsFor(email: string): string[];
}

interface UnitStore {
  listUnits(): Unit[];
}

interface OccurrenceSource {
  matching(options: { unitIds: string[]; at: Date; channelId: string }): UpcomingOccurrence[];
}

interface Principal {
  email: string;
  role: "operator" | "administrator";
}

export type StartResolution =
  | { status: "ready"; association: BroadcastAssociation | null }
  | { status: "unit-selection-required"; units: Array<Pick<Unit, "id" | "name" | "type">> };

export class BroadcastStartResolver {
  constructor(
    private readonly store: UnitStore,
    private readonly assignments: AssignmentSource,
    private readonly schedules: OccurrenceSource,
    private readonly channelId: string,
  ) {}

  resolve(principal: Principal, selectedUnitId?: string, at = new Date()): StartResolution {
    const activeUnits = this.store.listUnits().filter((unit) => !unit.archivedAt);
    const assignedIds = this.assignments.unitIdsFor(principal.email);
    const eligible = activeUnits.filter((unit) => assignedIds.includes(unit.id));
    if (activeUnits.length === 0 && principal.role === "administrator")
      return { status: "ready", association: null };
    if (eligible.length === 0) invalid("No active units are assigned to your account", 403);

    if (selectedUnitId && !eligible.some((unit) => unit.id === selectedUnitId))
      invalid("The selected unit is not assigned to your account", 403);
    const considered = selectedUnitId
      ? eligible.filter((unit) => unit.id === selectedUnitId)
      : eligible;
    const occurrences = this.schedules.matching({
      unitIds: considered.map((unit) => unit.id),
      at,
      channelId: this.channelId,
    });

    if (!selectedUnitId) {
      const matchingUnitIds = [...new Set(occurrences.map((entry) => entry.unit.id))];
      if (matchingUnitIds.length > 1)
        return {
          status: "unit-selection-required",
          units: unitChoices(considered, matchingUnitIds),
        };
      if (matchingUnitIds.length === 0 && considered.length > 1)
        return { status: "unit-selection-required", units: unitChoices(considered) };
    }

    const unitId = selectedUnitId || occurrences[0]?.unit.id || considered[0]?.id;
    const unit = considered.find((entry) => entry.id === unitId);
    if (!unit) invalid("An eligible unit could not be selected");
    const occurrence = occurrences.find((entry) => entry.unit.id === unit.id);
    return { status: "ready", association: association(unit, occurrence) };
  }
}

function association(unit: Unit, occurrence?: UpcomingOccurrence): BroadcastAssociation {
  return {
    unitId: unit.id,
    unitName: unit.name,
    title: occurrence?.title || "Meeting broadcast",
    scheduleId: occurrence?.scheduleId || null,
    schedulePublicId: occurrence?.schedulePublicId || null,
    occurrenceKey: occurrence?.key || null,
    localDate: occurrence?.localDate || null,
  };
}

function unitChoices(units: Unit[], ids?: string[]) {
  const allowed = ids ? new Set(ids) : null;
  return units
    .filter((unit) => !allowed || allowed.has(unit.id))
    .map(({ id, name, type }) => ({ id, name, type }));
}

function invalid(message: string, status = 400): never {
  throw Object.assign(new Error(message), { status });
}
