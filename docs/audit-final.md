# Auditoría máxima — DUCK ZION Apex

## Regla de publicación

La publicación privada bajo `belentani7` solo está permitida cuando **Backend, Frontend, Utility, Relevance, Potential e Identity** alcanzan simultáneamente 10/10 y cada evidencia posee procedencia server-side verificable. La auditoría ignora hashes legacy sin `payload.sourcePaths` o cuyo digest no coincide con el inventario actual.

## Resultado reproducible de esta ejecución

| Dimensión | Resultado | Evidencia                                                           | Estado    |
| --------- | --------: | ------------------------------------------------------------------- | --------- |
| Backend   |     10/10 | 4/4 checks; build, procedimientos tipados, tests y esquema          | aprobado  |
| Frontend  |     10/10 | 4/4 checks; capturas, 404, accesibilidad y responsive               | aprobado  |
| Utility   |     10/10 | 4/4 checks; proyecto, stem, entrega y auditoría funcional           | aprobado  |
| Relevance |      7/10 | 3/4 checks; presets, escenas y fuentes de plugins aprobados         | bloqueado |
| Potential |     10/10 | 4/4 checks; dominio tipado, contratos, observabilidad y carga       | aprobado  |
| Identity  |     10/10 | 4/4 checks; tema DUCK ZION, tipografía técnica, motion y responsive | aprobado  |

La puntuación total es **57/60**, pero el estado correcto es `locked` porque la regla exige 10/10 simultáneo. El faltante es `fl-studio-validation`: el catálogo documenta formatos compatibles y enlaces oficiales, pero todavía no existe una ejecución verificable de instalación, escaneo, `Verify plugins` y carga real de los diez plugins dentro de FL Studio Windows.

## Seguridad y reproducibilidad

`pnpm audit --audit-level=low` termina con `No known vulnerabilities found`. La suite contiene **15 pruebas**, todas pasan; TypeScript, lint, build y `git diff --check` pasan. `recordQualityEvidence` calcula hashes en el servidor, exige claves conocidas y rechaza claves de flujo sin artefactos mapeados. `calculateQualityGate` valida además la procedencia y el digest contra el inventario actual, por lo que no acepta el hash legacy `bbbb...` ni cualquier hash hexadecimal arbitrario.

## Decisión de GitHub

No se intentó crear ni publicar `belentani7/duck-zion-apex-audit-2026-08-18`. La decisión es deliberada y obligatoria: publicar con Relevance 7/10 violaría la puerta 10/10 solicitada. El siguiente artefacto necesario es un informe de ejecución en Windows con hashes, arquitectura, licencia, escaneo de FL Studio y carga real de cada plugin.

## Fuentes técnicas

La base metodológica combina controles de verificación de aplicación de OWASP ASVS, procedencia de supply chain de SLSA y documentación oficial de Image-Line sobre formatos soportados y `Manage plugins > Find installed plugins + Verify plugins`. Véase `docs/audit-standard-research.md`.
