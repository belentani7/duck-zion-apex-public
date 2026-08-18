import {
  listDeliveries,
  listMetrics,
  listProjectAudit,
  listPresetBindings,
  listProjects,
  listSceneBindings,
  listStems,
} from "../server/db.ts";

const projects = await listProjects(1);
const project = projects[0];
const result = {
  project: project ? { id: project.id, ownerId: project.ownerId } : null,
  audit: project
    ? (await listProjectAudit(project.id, 1)).slice(0, 5).map(item => ({
        eventType: item.eventType,
        sha256: item.sha256,
        actorId: item.actorId,
      }))
    : [],
  stems: project ? (await listStems(project.id)).length : 0,
  deliveries: project ? (await listDeliveries(project.id)).length : 0,
  metrics: project ? (await listMetrics(project.id)).length : 0,
  presetBindings: project ? (await listPresetBindings(project.id)).length : 0,
  sceneBindings: project ? (await listSceneBindings(project.id)).length : 0,
};
console.log(JSON.stringify(result, null, 2));
