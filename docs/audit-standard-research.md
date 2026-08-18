# Estándar de auditoría adoptado

La auditoría máxima de DUCK ZION Apex combinará controles de aplicación, supply chain y experiencia verificable. No se considerará suficiente una puntuación subjetiva.

## Fuentes primarias

[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) define una base abierta para probar controles técnicos de aplicaciones web y APIs, incluyendo controles contra XSS e inyección. Sus requisitos tienen identificadores versionados, por lo que las evidencias deben conservar la versión y el identificador exactos.

[SLSA](https://slsa.dev/) define un marco de controles para prevenir manipulación, mejorar la integridad y proteger paquetes e infraestructura. Sus niveles evalúan builds, fuentes y dependencias, y sirven como base para exigir hashes, trazabilidad y procedencia.

## Aplicación a las seis dimensiones

| Dimensión  | Criterios de auditoría                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| Backend    | TypeScript sin errores, contratos tRPC, tests, build reproducible, revisión de auth/secretos y evidencia ASVS versionada. |
| Frontend   | Capturas desktop/móvil, rutas, estados de error, accesibilidad, rendimiento y responsive verificados.                     |
| Utilidad   | Flujos reales de proyectos, stems, entregas, comentarios, métricas, portal y asistente, sin fixtures de usuario.          |
| Relevancia | Nombres exactos de presets/scenes, catálogo de 10 plugins, URLs oficiales y validación FL Studio documentada.             |
| Potencial  | Dominio typed, contratos de extensión, observabilidad, auditoría de dependencias/procedencia y carga controlada.          |
| Identidad  | Tema DUCK ZION, tipografía técnica, motion accesible, contraste y consistencia responsive.                                |

La regla operativa es **10/10 simultáneo**: si falta una evidencia, el gate permanece bloqueado. Los estándares aportan criterios; no permiten rellenar evidencias ausentes.

## FL Studio y compatibilidad documental

La documentación oficial de Image-Line confirma que FL Studio Windows soporta VST 1/2, VST3 y CLAP de 32/64 bits, además del formato nativo de Image-Line. También indica que los plugins externos se gestionan desde Options > File settings > Manage plugins y que deben ejecutarse Find installed plugins y Verify plugins para clasificarlos correctamente [3] [4]. Esto permite validar documentalmente la compatibilidad de formatos del catálogo, pero **no sustituye una carga real en FL Studio Windows**.

### Referencias

[3]: https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins_supported.htm "Image-Line Plugin Standards"
[4]: https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/basics_externalplugins.htm "Image-Line Installing Plugins"
