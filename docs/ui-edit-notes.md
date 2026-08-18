# UI edit notes

Home.tsx ya está formateado por Prettier. El estado local incluye `presetDraft` y `sceneDraft`; la API ya expone `projectDetail`, `updatePreset` y `updateScene`. El portal de cliente mantiene aún botones y textarea sin mutaciones, por lo que la próxima modificación debe conectar `addComment` y `updateDelivery` con el `activeDelivery` del detalle.
