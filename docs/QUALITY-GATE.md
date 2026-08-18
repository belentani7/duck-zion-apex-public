# DUCK ZION Apex — Quality gate

La publicación privada en GitHub está bloqueada por diseño. El procedimiento `production.qualityGate` solo devuelve `publishable: false` y el botón de publicación permanece deshabilitado mientras no existan evidencias reproducibles de 10/10 en las seis dimensiones.

| Dimensión | Estado de esta entrega | Evidencia |
|---|---|---|
| Backend | Validado parcialmente | `pnpm check`, `pnpm test`, build y persistencia Drizzle/tRPC. Falta cobertura de integración DB con datos reales no simulados. |
| Frontend | Validado parcialmente | Capturas desktop/móvil, `/` y `/404`, foco visible, contraste y reduced-motion. |
| Utilidad | En progreso | Proyectos, bindings, portal, auditoría, métricas y chat están integrados; faltan flujos de stems/versiones completos. |
| Relevancia | En progreso | Catálogo de diez plugins, presets exactos y escenas exactas están integrados; falta validación profesional con FL Studio. |
| Potencial | En progreso | Arquitectura modular y API typed. Falta CI, observabilidad y pruebas de carga. |
| Identidad | Validada visualmente | DUCK ZION oscuro, verde neón, Space Grotesk/DM Mono y motion accesible. |

La puerta no debe convertirse en 10/10 por opinión, por un valor forzado de entorno ni por fixtures de test. Requiere artefactos de evidencia, hashes, pruebas y revisión humana. Los plugins permanecen como enlaces y metadatos; no se redistribuyen binarios de terceros.
