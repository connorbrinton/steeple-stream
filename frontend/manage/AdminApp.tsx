import { createContext, useContext, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { getJson, sendJson } from "../shared/api.ts";

type UnitType = "ward" | "branch" | "stake" | "other";
type BroadcastKind = "sacrament-meeting" | "stake-conference" | "other";
type Recurrence = "weekly" | "once";

interface Unit {
  id: string;
  slug: string;
  name: string;
  type: UnitType;
  parentUnitId: string | null;
  archivedAt: string | null;
}

interface Schedule {
  id: string;
  publicId: string;
  unitId: string;
  title: string;
  kind: BroadcastKind;
  timeZone: string;
  recurrence: Recurrence;
  weekday: number | null;
  localDate: string | null;
  localStartTime: string;
  durationMinutes: number;
  enabled: boolean;
}

interface Session {
  email: string;
  csrfToken: string;
}
interface PersonAccess {
  email: string;
  role: "broadcaster" | "administrator";
  unitIds: string[];
  enabled: boolean;
  source: "configuration" | "managed";
}
interface Catalog {
  channelId: string;
  units: Unit[];
  schedules: Schedule[];
}
interface AdminState extends Catalog {
  session: Session;
  reload(): Promise<void>;
}

const Context = createContext<AdminState | null>(null);

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [catalog, setCatalog] = useState<Catalog>({ channelId: "", units: [], schedules: [] });
  const [error, setError] = useState("");
  const reload = async () => setCatalog(await getJson<Catalog>("/api/admin/catalog"));
  useEffect(() => {
    Promise.all([getJson<Session>("/api/session"), getJson<Catalog>("/api/admin/catalog")])
      .then(([nextSession, nextCatalog]) => {
        setSession(nextSession);
        setCatalog(nextCatalog);
      })
      .catch((reason: unknown) => setError(message(reason)));
  }, []);

  if (error)
    return (
      <main className="admin-load">
        <h1>Administration unavailable</h1>
        <p>{error}</p>
      </main>
    );
  if (!session)
    return (
      <main className="admin-load">
        <p>Loading administration…</p>
      </main>
    );

  return (
    <Context.Provider value={{ ...catalog, session, reload }}>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <a className="admin-brand" href="/">
            Steeple Stream
          </a>
          <nav aria-label="Administration">
            <NavItem to="/admin" end>
              Overview
            </NavItem>
            <a href={`/broadcasts/${encodeURIComponent(catalog.channelId)}/admin`}>
              Video &amp; cameras
            </a>
            <NavItem to="/admin/units">Units</NavItem>
            <NavItem to="/admin/schedules">Schedules</NavItem>
            <NavItem to="/admin/people">People &amp; access</NavItem>
          </nav>
          <div className="admin-account">
            <span>{session.email}</span>
            <a href="/broadcaster">Broadcaster view</a>
          </div>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </Context.Provider>
  );
}

function NavItem({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
      {children}
    </NavLink>
  );
}

export function Overview() {
  const { channelId, units, schedules } = useAdmin();
  return (
    <Page
      title="Administration"
      intro="Manage the organizations and schedules that power upcoming broadcasts."
    >
      <div className="admin-stats">
        <Stat value={units.length} label="Units" />
        <Stat value={schedules.filter((item) => item.enabled).length} label="Active schedules" />
      </div>
      <section className="admin-panel">
        <h2>Broadcast controls</h2>
        <p>
          Camera, source, and live broadcast controls remain in the existing control room while
          administration moves here.
        </p>
        <a className="button primary" href={`/broadcasts/${encodeURIComponent(channelId)}/admin`}>
          Open video &amp; cameras
        </a>
      </section>
    </Page>
  );
}

function Stat({ value, label: text }: { value: number; label: string }) {
  return (
    <div className="admin-stat">
      <strong>{value}</strong>
      <span>{text}</span>
    </div>
  );
}

export function Units() {
  const { units, session, reload } = useAdmin();
  const [editing, setEditing] = useState<Unit | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <Page
      title="Units"
      intro="Create wards, branches, stakes, and other organizations used to identify broadcasts."
    >
      <button
        className="button primary"
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
      >
        Add unit
      </button>
      <div className="admin-list">
        {units.map((unit) => (
          <article className="admin-row" key={unit.id}>
            <div>
              <h2>{unit.name}</h2>
              <p>
                {label(unit.type)} · /{unit.slug}
              </p>
            </div>
            <button
              className="button"
              onClick={() => {
                setEditing(unit);
                setOpen(true);
              }}
            >
              Edit
            </button>
          </article>
        ))}
      </div>
      {open && (
        <UnitForm
          unit={editing}
          units={units}
          csrf={session.csrfToken}
          close={() => setOpen(false)}
          saved={reload}
        />
      )}
    </Page>
  );
}

function UnitForm({
  unit,
  units,
  csrf,
  close,
  saved,
}: {
  unit: Unit | null;
  units: Unit[];
  csrf: string;
  close(): void;
  saved(): Promise<void>;
}) {
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await sendJson(
        unit ? `/api/admin/units/${unit.id}` : "/api/admin/units",
        unit ? "PUT" : "POST",
        Object.fromEntries(data),
        csrf,
      );
      await saved();
      close();
    } catch (reason) {
      setError(message(reason));
    }
  };
  return (
    <Dialog title={unit ? "Edit unit" : "Add unit"} close={close}>
      <form className="admin-form" onSubmit={submit}>
        <Field label="Name">
          <input name="name" required maxLength={80} defaultValue={unit?.name} />
        </Field>
        <Field label="URL slug">
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={unit?.slug}
            placeholder="harris-lake"
          />
        </Field>
        <Field label="Type">
          <select name="type" defaultValue={unit?.type || "ward"}>
            <option value="ward">Ward</option>
            <option value="branch">Branch</option>
            <option value="stake">Stake</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Parent unit">
          <select name="parentUnitId" defaultValue={unit?.parentUnitId || ""}>
            <option value="">None</option>
            {units
              .filter((item) => item.id !== unit?.id)
              .map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </Field>
        <FormActions error={error} close={close} />
      </form>
    </Dialog>
  );
}

export function Schedules() {
  const { schedules, units, session, reload } = useAdmin();
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <Page
      title="Schedules"
      intro="Define recurring and one-time broadcasts. Upcoming cards are derived automatically from these rules."
    >
      <button
        className="button primary"
        disabled={!units.length}
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
      >
        Add schedule
      </button>
      {!units.length && <p className="admin-hint">Add a unit before creating a schedule.</p>}
      <div className="admin-list">
        {schedules.map((schedule) => (
          <article className="admin-row" key={schedule.id}>
            <div>
              <h2>{schedule.title}</h2>
              <p>
                {units.find((unit) => unit.id === schedule.unitId)?.name || "Unknown unit"} ·{" "}
                {scheduleSummary(schedule)}
              </p>
            </div>
            <div className={schedule.enabled ? "status-chip" : "status-chip muted"}>
              {schedule.enabled ? "Active" : "Disabled"}
            </div>
            <button
              className="button"
              onClick={() => {
                setEditing(schedule);
                setOpen(true);
              }}
            >
              Edit
            </button>
          </article>
        ))}
      </div>
      {open && (
        <ScheduleForm
          schedule={editing}
          units={units}
          csrf={session.csrfToken}
          close={() => setOpen(false)}
          saved={reload}
        />
      )}
    </Page>
  );
}

function ScheduleForm({
  schedule,
  units,
  csrf,
  close,
  saved,
}: {
  schedule: Schedule | null;
  units: Unit[];
  csrf: string;
  close(): void;
  saved(): Promise<void>;
}) {
  const [recurrence, setRecurrence] = useState<Recurrence>(schedule?.recurrence || "weekly");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const body: Record<string, unknown> = Object.fromEntries(data);
    body.durationMinutes = Number(body.durationMinutes);
    body.weekday = Number(body.weekday);
    body.enabled = data.has("enabled");
    try {
      await sendJson(
        schedule ? `/api/admin/schedules/${schedule.id}` : "/api/admin/schedules",
        schedule ? "PUT" : "POST",
        body,
        csrf,
      );
      await saved();
      close();
    } catch (reason) {
      setError(message(reason));
    }
  };
  return (
    <Dialog title={schedule ? "Edit schedule" : "Add schedule"} close={close}>
      <form className="admin-form" onSubmit={submit}>
        <Field label="Unit">
          <select name="unitId" required defaultValue={schedule?.unitId}>
            {units.map((unit) => (
              <option value={unit.id} key={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Title">
          <input
            name="title"
            required
            maxLength={120}
            defaultValue={schedule?.title || "Sacrament Meeting"}
          />
        </Field>
        <Field label="Kind">
          <select name="kind" defaultValue={schedule?.kind || "sacrament-meeting"}>
            <option value="sacrament-meeting">Sacrament meeting</option>
            <option value="stake-conference">Stake conference</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Recurrence">
          <select
            name="recurrence"
            value={recurrence}
            onChange={(event) => setRecurrence(event.target.value as Recurrence)}
          >
            <option value="weekly">Weekly</option>
            <option value="once">One time</option>
          </select>
        </Field>
        {recurrence === "weekly" ? (
          <Field label="Day">
            <select name="weekday" defaultValue={schedule?.weekday ?? 0}>
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                (day, index) => (
                  <option value={index} key={day}>
                    {day}
                  </option>
                ),
              )}
            </select>
          </Field>
        ) : (
          <Field label="Date">
            <input type="date" name="localDate" required defaultValue={schedule?.localDate || ""} />
          </Field>
        )}
        <Field label="Start time">
          <input
            type="time"
            name="localStartTime"
            required
            defaultValue={schedule?.localStartTime || "11:00"}
          />
        </Field>
        <Field label="Duration (minutes)">
          <input
            type="number"
            name="durationMinutes"
            min="1"
            max="720"
            required
            defaultValue={schedule?.durationMinutes || 90}
          />
        </Field>
        <Field label="Time zone">
          <input
            name="timeZone"
            required
            defaultValue={schedule?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone}
          />
        </Field>
        <label className="check">
          <input type="checkbox" name="enabled" defaultChecked={schedule?.enabled ?? true} /> Show
          upcoming occurrences
        </label>
        <FormActions error={error} close={close} />
      </form>
    </Dialog>
  );
}

export function People() {
  const { units, session } = useAdmin();
  const [people, setPeople] = useState<PersonAccess[] | null>(null);
  const [editing, setEditing] = useState<PersonAccess | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const reload = async () => {
    const result = await getJson<{ people: PersonAccess[] }>("/api/admin/access");
    setPeople(result.people);
  };
  useEffect(() => {
    void reload().catch((reason: unknown) => setError(message(reason)));
  }, []);
  return (
    <Page
      title="People & access"
      intro="Associate broadcasters with one or more units and manage administrator access."
    >
      <button
        className="button primary"
        disabled={!units.length}
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
      >
        Add person
      </button>
      {!units.length && <p className="admin-hint">Add a unit before inviting a broadcaster.</p>}
      {error && <p className="form-error">{error}</p>}
      {people === null && !error ? (
        <p className="admin-hint">Loading people…</p>
      ) : (
        <div className="admin-list">
          {people?.map((person) => (
            <article className="admin-row" key={person.email}>
              <div>
                <h2>{person.email}</h2>
                <p>
                  {person.role === "administrator" ? "Administrator" : "Broadcaster"} ·{" "}
                  {unitNames(person.unitIds, units)}
                </p>
              </div>
              <div className={person.enabled ? "status-chip" : "status-chip muted"}>
                {person.enabled ? "Active" : "Disabled"}
              </div>
              <button
                className="button"
                onClick={() => {
                  setEditing(person);
                  setOpen(true);
                }}
              >
                Edit
              </button>
            </article>
          ))}
        </div>
      )}
      {open && (
        <PersonForm
          person={editing}
          units={units}
          csrf={session.csrfToken}
          close={() => setOpen(false)}
          saved={reload}
        />
      )}
    </Page>
  );
}

function PersonForm({
  person,
  units,
  csrf,
  close,
  saved,
}: {
  person: PersonAccess | null;
  units: Unit[];
  csrf: string;
  close(): void;
  saved(): Promise<void>;
}) {
  const [error, setError] = useState("");
  const configured = person?.source === "configuration";
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const body = {
      email: String(data.get("email") || ""),
      role: String(data.get("role") || "broadcaster"),
      unitIds: data.getAll("unitIds").map(String),
      enabled: data.has("enabled"),
    };
    try {
      await sendJson<PersonAccess>(
        person ? `/api/admin/people/${encodeURIComponent(person.email)}` : "/api/admin/people",
        person ? "PUT" : "POST",
        body,
        csrf,
      );
      await saved();
      close();
    } catch (reason) {
      setError(message(reason));
    }
  };
  return (
    <Dialog title={person ? "Edit access" : "Add person"} close={close}>
      <form className="admin-form" onSubmit={submit}>
        <Field label="Google account email">
          <input
            name="email"
            type="email"
            required
            readOnly={Boolean(person)}
            defaultValue={person?.email}
            autoComplete="off"
          />
        </Field>
        <Field label="Role">
          <select name="role" defaultValue={person?.role || "broadcaster"} disabled={configured}>
            <option value="broadcaster">Broadcaster</option>
            <option value="administrator">Administrator</option>
          </select>
          {configured && <input type="hidden" name="role" value={person.role} />}
        </Field>
        <fieldset className="unit-picker">
          <legend>Units</legend>
          {units.map((unit) => (
            <label className="check" key={unit.id}>
              <input
                type="checkbox"
                name="unitIds"
                value={unit.id}
                defaultChecked={person?.unitIds.includes(unit.id)}
              />
              {unit.name}
            </label>
          ))}
        </fieldset>
        <label className="check">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={person?.enabled ?? true}
            disabled={configured}
          />
          Access enabled
        </label>
        {configured && <input type="hidden" name="enabled" value="on" />}
        {configured && (
          <p className="admin-hint">
            This person’s role and access are required by server configuration. Unit assignments can
            still be changed here.
          </p>
        )}
        <FormActions error={error} close={close} />
      </form>
    </Dialog>
  );
}
function Page({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <header className="admin-page-header">
        <p>Steeple Stream</p>
        <h1>{title}</h1>
        <span>{intro}</span>
      </header>
      {children}
    </>
  );
}
function Dialog({ title, close, children }: { title: string; close(): void; children: ReactNode }) {
  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        className="admin-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="dialog-title">
          <h2 id="dialog-title">{title}</h2>
          <button aria-label="Close" onClick={close}>
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
function Field({ label: text, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{text}</span>
      {children}
    </label>
  );
}
function FormActions({ error, close }: { error: string; close(): void }) {
  return (
    <>
      <div className="form-error" role="alert">
        {error}
      </div>
      <div className="form-actions">
        <button type="button" className="button" onClick={close}>
          Cancel
        </button>
        <button className="button primary">Save</button>
      </div>
    </>
  );
}
function useAdmin() {
  const value = useContext(Context);
  if (!value) throw new Error("Admin context is unavailable");
  return value;
}
function label(value: string) {
  return value.replaceAll("-", " ").replace(/^./, (letter) => letter.toUpperCase());
}
function scheduleSummary(schedule: Schedule) {
  const day =
    schedule.recurrence === "weekly"
      ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
          schedule.weekday || 0
        ]
      : schedule.localDate;
  return `${day} at ${schedule.localStartTime} · ${schedule.durationMinutes} min`;
}
function unitNames(unitIds: string[], units: Unit[]) {
  const names = unitIds.map((id) => units.find((unit) => unit.id === id)?.name).filter(Boolean);
  return names.length ? names.join(", ") : "No units assigned";
}
function message(value: unknown) {
  return value instanceof Error ? value.message : "Something went wrong";
}
