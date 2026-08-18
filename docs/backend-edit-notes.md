# Backend edit notes

`server/routers/production.ts` ya expone proyectos, detalle, stems, métricas, comentarios, entregas, bindings de presets y escenas, catálogo y asistente LLM. La puerta de calidad permanece separada y bloqueada. El siguiente cambio añade una mutación `runAudit` con hash canónico de manifiesto y registro `audit.run`.
