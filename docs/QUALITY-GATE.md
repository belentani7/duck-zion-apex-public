# DUCK ZION Apex — Quality gate

La publicación privada en GitHub está bloqueada por diseño. El procedimiento `production.qualityGate` solo devuelve `publishable: true` cuando las seis dimensiones alcanzan 10/10 simultáneamente. No existe un conjunto inicial de evidencias aceptadas por defecto: las evidencias estáticas deben registrarse mediante `production.recordQualityEvidence` y conservar un SHA-256 válido en `auditLogs`.

| Dimensión  | Evidencias requeridas                                                     | Estado de esta entrega                                                                                                                           |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Backend    | `schema`, `typed-procedures`, `tests`, `build`                            | Parcial; typecheck, tests y build pasan localmente, pero el gate exige sus artefactos hashados persistidos.                                      |
| Frontend   | `desktop-capture`, `mobile-capture`, `route-404`, `accessibility`         | Parcial; capturas desktop/móvil, `/` y `/404`, contraste, focus states y reduced-motion están documentados.                                      |
| Utilidad   | `project-flow`, `stem-flow`, `delivery-flow`, `audit-flow`                | Parcial; los flujos están integrados y se derivan de datos reales del proyecto, pero requieren actividad persistida por proyecto.                |
| Relevancia | `exact-presets`, `exact-scenes`, `plugin-sources`, `fl-studio-validation` | Parcial; catálogo de diez plugins, presets exactos y escenas exactas se validan desde el catálogo; FL Studio necesita evidencia externa hashada. |
| Potencial  | `typed-domain`, `extension-contracts`, `observability`, `load-test`       | Parcial; la arquitectura typed y modular existe, pero faltan artefactos hashados de observabilidad y carga.                                      |
| Identidad  | `duck-zion-theme`, `technical-type`, `motion`, `responsive`               | Parcial; la identidad DUCK ZION y la verificación visual están implementadas, pero el gate exige evidencias persistidas.                         |

## Reglas de evidencia

El cálculo del gate lee únicamente eventos `quality.evidence.<key>` del proyecto activo cuyo campo `sha256` tenga 64 caracteres hexadecimales. Las comprobaciones operativas de proyecto, stems, entregas, métricas, bindings, catálogo y URLs oficiales se derivan de las filas y constantes reales del sistema; no se rellenan con fixtures ni con claves hardcodeadas.

`production.runAudit` ya no acepta manifiestos del cliente. Ejecuta un inventario recursivo desde el servidor, excluye directorios de dependencias y artefactos de build, calcula SHA-256 por archivo, cuenta señales de secretos por ruta y contenido legible y persiste el digest canónico en `auditLogs`. El límite operativo de inventario es de 5.000 archivos para evitar una ejecución no acotada.

La puerta no debe convertirse en 10/10 por opinión, por un valor forzado de entorno ni por fixtures de test. Requiere artefactos de evidencia, hashes, pruebas y revisión humana. Los plugins permanecen como enlaces y metadatos; no se redistribuyen binarios de terceros.

## Publicación privada en GitHub

La mutación `production.publishPrivateGithub` recibe un repositorio con formato `owner/name` y vuelve a calcular el gate en el servidor antes de cualquier operación. Si una sola dimensión no alcanza 10/10, devuelve `status: locked` sin ejecutar comandos ni crear repositorios. Solo con `publishable: true` ejecuta `gh repo create --private --source <project> --push`, registra el resultado con SHA-256 y muestra el estado en la interfaz. En esta entrega el control permanece bloqueado porque no se deben fabricar evidencias para forzar una publicación.
