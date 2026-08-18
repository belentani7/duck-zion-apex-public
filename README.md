# DUCK ZION Apex

DUCK ZION Apex es una plataforma full-stack para producción vocal profesional: organiza proyectos y stems, vincula cadenas de voz y escenas de automatización, registra entregas y métricas, integra un portal de cliente, ofrece asistencia de producción y ejecuta auditorías técnicas reproducibles.

## Estado de calidad

El proyecto usa una puerta estricta de seis dimensiones. La última evaluación reproducible es **57/60**: Backend 10/10, Frontend 10/10, Utility 10/10, Relevance 7/10, Potential 10/10 e Identity 10/10. La publicación automática 10/10 permanece bloqueada porque falta la validación real de instalación, escaneo, `Verify plugins` y carga de los diez plugins en FL Studio sobre Windows. Este repositorio público se publica como snapshot de desarrollo auditado, no como certificación 10/10.

## Verificación local

```bash
pnpm install
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm audit --audit-level=low
```

La auditoría server-side calcula inventarios SHA-256, valida la procedencia de las evidencias y descarta hashes legacy o arbitrarios. La publicación GitHub del producto nunca debe interpretarse como una garantía de compatibilidad de terceros: los plugins se mantienen como referencias y enlaces oficiales, sin redistribuir binarios ni descargar instaladores silenciosamente.

## Producción vocal

Incluye los presets exactos **Vocal Clean**, **Pop Gloss**, **Urban Tight**, **Funk Brasil Pulse** y **Stage Lead**, además de las escenas **verse**, **pre-hook**, **hook**, **drop**, **adlib** y **final lift**. El catálogo contiene diez referencias de plugins y guías orientadas a FL Studio.

## Licencia y terceros

El código de este repositorio pertenece a DUCK ZION Apex. Las marcas, plugins, instaladores y binarios de terceros conservan sus licencias originales. Antes de distribuir cualquier plugin, deben verificarse su licencia, arquitectura, hash, firma y compatibilidad real con el entorno de destino.
