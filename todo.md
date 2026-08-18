# Project TODO

- [x] Establecer identidad DUCK ZION: fondo oscuro, verde neón, tipografía técnica, motion y accesibilidad.
- [x] Construir dashboard de producción con proyectos, estados y actividad.
- [x] Añadir control de versiones de stems con historial por proyecto.
- [x] Añadir presets exactos: Vocal Clean, Pop Gloss, Urban Tight, Funk Brasil Pulse y Stage Lead.
- [x] Persistir parámetros editables de presets vinculados a cada proyecto.
- [x] Añadir catálogo de exactamente 10 plugins con estado, enlaces oficiales y guía FL Studio.
- [x] Añadir escenas exactas: verse, pre-hook, hook, drop, adlib y final lift.
- [x] Vincular escenas de automatización a proyectos y permitir edición.
- [x] Construir portal de cliente con entregas, versiones, comentarios con timestamp y aprobación.
- [x] Integrar asistente LLM de producción con base de conocimientos de mezcla, EQ, dinámica y workflow.
- [x] Implementar auditoría reproducible: SHA-256, inventario, señales de secretos y cambios por proyecto.
- [x] Añadir métricas LUFS, true peak y dinámica con historial por entrega.
- [x] Definir puerta estricta 10/10 con evidencias para backend, frontend, utilidad, relevancia, potencial e identidad.
- [x] Crear flujo de publicación privada en GitHub condicionado a la puerta 10/10.
- [x] Añadir pruebas Vitest de procedimientos y reglas críticas.
- [x] Verificar build, typecheck, lint, tests, rutas y estados de error.
- [x] Verificar visualmente desktop y móvil mediante capturas.
- [x] Crear checkpoint final únicamente cuando todos los elementos entregables estén verificados.

- [x] Configurar tipografía técnica global real y completar motion accesible, focus states, contraste y reduced-motion.
- [x] Implementar actividad real del dashboard desde eventos auditables de proyectos, entregas y revisiones.
- [x] Integrar un asistente LLM funcional mediante backend real, base de conocimiento, estados de carga y errores.
- [x] Implementar la puerta 10/10 con reglas evaluables y evidencias automáticas por dimensión.

- [x] Añadir edición real de parámetros de preset por proyecto con lectura, controles y mutación de actualización.
- [x] Añadir edición real de overrides de automatización por proyecto con lectura y actualización.
- [x] Añadir script lint y ejecutar verificación reproducible de lint, rutas y estados de error.

- [x] Renderizar en el portal las entregas y versiones reales desde projectDetail, cargar deliveryComments y mostrar timestamps persistidos.
- [x] Implementar auditoría masiva real del proyecto con inventario, señales de secretos y hashes generados por servidor.
- [x] Mostrar historial de métricas agrupado por entrega y conectar cada snapshot con una delivery/version real.

- [x] Añadir verificación reproducible de rutas `/` y fallback `/404` con evidencia documentada.
- [x] Cubrir estados de error críticos: fallo del asistente, ausencia de entrega activa, fallo de auditoría y estados vacíos del portal.

- [x] Derivar la puerta 10/10 de evidencias persistidas y artefactos verificables, no de un conjunto hardcodeado en el router.
- [x] Agrupar métricas por entrega y mostrar etiqueta/version legible en cada snapshot.
- [x] Añadir pruebas de evaluación automática de quality gate e historial de métricas por entrega/version.

- [x] Manejar errores de gh en publicación privada: CLI ausente, autenticación, repositorio existente y push fallido.
- [x] Mostrar estados y errores específicos de publishGithub en la interfaz.
- [x] Cubrir camino de publicación abierta y fallo de gh con pruebas reproducibles.
- [x] Cubrir extremo a extremo publishPrivateGithub con gate abierto y fallo operativo de gh mediante mocks reproducibles.

## Auditoría máxima y publicación belentani7

- [x] Definir y documentar el estándar de auditoría exhaustiva aplicado a las seis dimensiones 10/10.
- [x] Ejecutar auditoría reproducible completa de backend, frontend, utilidad, relevancia, potencial e identidad.
- [x] Generar y persistir únicamente evidencias verificables con SHA-256 para el gate.
- [x] Evaluar el gate y bloquear cualquier publicación si alguna dimensión no alcanza 10/10.
- [ ] Crear un repositorio privado nuevo bajo belentani7 solo si el gate está abierto y relevance alcanza 10/10 con validación FL Studio real.
- [ ] Verificar el repositorio remoto, su privacidad y el contenido publicado si la publicación se autoriza.
- [x] Remediar las vulnerabilidades de dependencias detectadas por pnpm audit, incluyendo 3 críticas y 49 altas, y repetir la auditoría sin forzar el gate.
- [x] Endurecer recordQualityEvidence para aceptar solo claves permitidas y hashes calculados/verificados por el servidor, eliminando evidencias arbitrarias del cliente.
- [x] Bloquear claves permitidas sin fuentes server-side mapeadas y probar que project-flow, stem-flow, delivery-flow, audit-flow y fl-studio-validation solo se derivan de flujos reales.
- [x] Hacer que calculateQualityGate valide provenance/sourcePaths server-side y descarte evidencias legacy o hashes dummy ya persistidos.
