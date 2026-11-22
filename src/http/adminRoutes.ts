import type { IncomingMessage, ServerResponse } from "node:http";
import type { AuthService } from "../authService.js";
import type { AdminCatalogService } from "../adminCatalogService.js";
import type { AccessService } from "../accessService.js";
import { parseJson, sendJson } from "../httpUtils.js";

export interface AdminRouteDependencies {
  auth: Pick<AuthService, "authorize">;
  access: Pick<AccessService, "listPeople" | "save">;
  adminCatalog: Pick<AdminCatalogService, "list" | "saveUnit" | "saveSchedule">;
}

/**
 * Handle the administrator's catalog and access APIs.
 *
 * Dependencies are supplied by the composition root so these routes can be
 * exercised without starting NDI, MediaMTX, or the production application.
 */
export async function handleAdminRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  method: string,
  pathname: string,
  { auth, access, adminCatalog }: AdminRouteDependencies,
): Promise<boolean> {
  if (method === "GET" && pathname === "/api/admin/catalog") {
    auth.authorize(req, "administrator");
    sendJson(res, 200, adminCatalog.list());
    return true;
  }

  if (method === "POST" && pathname === "/api/admin/units") {
    auth.authorize(req, "administrator", { csrfRequired: true });
    sendJson(res, 201, adminCatalog.saveUnit(await parseJson(req)));
    return true;
  }

  const adminUnitMatch = /^\/api\/admin\/units\/([^/]+)$/.exec(pathname);
  if (method === "PUT" && adminUnitMatch) {
    auth.authorize(req, "administrator", { csrfRequired: true });
    sendJson(
      res,
      200,
      adminCatalog.saveUnit(await parseJson(req), decodeURIComponent(adminUnitMatch[1] || "")),
    );
    return true;
  }

  if (method === "POST" && pathname === "/api/admin/schedules") {
    auth.authorize(req, "administrator", { csrfRequired: true });
    sendJson(res, 201, adminCatalog.saveSchedule(await parseJson(req)));
    return true;
  }

  if (method === "GET" && pathname === "/api/admin/access") {
    auth.authorize(req, "administrator");
    sendJson(res, 200, { people: access.listPeople() });
    return true;
  }

  if (method === "POST" && pathname === "/api/admin/people") {
    auth.authorize(req, "administrator", { csrfRequired: true });
    sendJson(res, 201, access.save(await parseJson(req)));
    return true;
  }

  const adminPersonMatch = /^\/api\/admin\/people\/([^/]+)$/.exec(pathname);
  if (method === "PUT" && adminPersonMatch) {
    auth.authorize(req, "administrator", { csrfRequired: true });
    sendJson(
      res,
      200,
      access.save(await parseJson(req), decodeURIComponent(adminPersonMatch[1] || "")),
    );
    return true;
  }

  const adminScheduleMatch = /^\/api\/admin\/schedules\/([^/]+)$/.exec(pathname);
  if (method === "PUT" && adminScheduleMatch) {
    auth.authorize(req, "administrator", { csrfRequired: true });
    sendJson(
      res,
      200,
      adminCatalog.saveSchedule(
        await parseJson(req),
        decodeURIComponent(adminScheduleMatch[1] || ""),
      ),
    );
    return true;
  }

  return false;
}
