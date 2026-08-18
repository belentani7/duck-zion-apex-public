# DUCK ZION Apex — Informe operativo de auditoría y publicación

## Regla de ejecución

La publicación privada bajo `belentani7` solo está permitida cuando **Backend, Frontend, Utility, Relevance, Potential e Identity** alcanzan simultáneamente 10/10 y cada evidencia posee procedencia server-side verificable. El gate ignora hashes legacy sin `payload.sourcePaths` o cuyo digest no coincide con el inventario actual.

`production.runAudit` inventaría recursivamente desde el servidor, calcula SHA-256 por archivo, detecta señales de secretos y persiste un digest canónico. `recordQualityEvidence` solo acepta claves conocidas, fuentes server-side existentes y hashes calculados por el servidor. `calculateQualityGate` valida de nuevo la procedencia y el digest, por lo que no acepta valores dummy ni hashes arbitrarios.

## Resultado de la auditoría

| Dimensión | Resultado | Evidencia                                                    | Estado    |
| --------- | --------: | ------------------------------------------------------------ | --------- |
| Backend   |     10/10 | 4/4: schema, procedimientos tipados, tests y build           | aprobado  |
| Frontend  |     10/10 | 4/4: desktop, móvil, `/404` y accesibilidad                  | aprobado  |
| Utility   |     10/10 | 4/4: proyecto, stem, entrega y auditoría funcional           | aprobado  |
| Relevance |      7/10 | 3/4: presets exactos, escenas exactas y fuentes de plugins   | bloqueado |
| Potential |     10/10 | 4/4: dominio tipado, contratos, observabilidad y carga       | aprobado  |
| Identity  |     10/10 | 4/4: tema DUCK ZION, tipografía técnica, motion y responsive | aprobado  |

Resultado total: **57/60**. El estado es `locked`; la regla no permite redondeo ni publicación parcial. La única falta es `fl-studio-validation`: no existe todavía una ejecución verificable en Windows de instalación, escaneo, `Verify plugins` y carga real de los diez plugins.

## Catálogo de producción

El producto mantiene exactamente diez referencias, solo con enlaces y metadatos; no redistribuye binarios de terceros ni descarga instaladores silenciosamente.

| Plugin                        | Uso principal                      | Fuente oficial                                                                 |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| MAutoPitch                    | Afinación vocal y formantes        | [MeldaProduction](https://www.meldaproduction.com/MAutoPitch)                  |
| TDR Nova                      | EQ dinámico y compresión selectiva | [Tokyo Dawn Records](https://www.tokyodawn.net/tdr-nova/)                      |
| T-De-Esser 2                  | Control de sibilancia              | [Techivation](https://techivation.com/t-de-esser/)                             |
| DC1A                          | Compresión de carácter             | [Klanghelm](https://klanghelm.com/contents/products/DC1A.html)                 |
| IVGI2                         | Saturación armónica                | [Klanghelm](https://klanghelm.com/contents/products/IVGI.html)                 |
| Valhalla Supermassive         | Delay y reverb                     | [Valhalla DSP](https://valhalladsp.com/shop/reverb/valhalla-supermassive/)     |
| Youlean Loudness Meter 2 Free | LUFS, true peak y dinámica         | [Youlean](https://youlean.co/youlean-loudness-meter/)                          |
| Surge XT                      | Síntesis híbrida                   | [Surge Synthesizer](https://surge-synthesizer.github.io/)                      |
| Decent Sampler                | Sampler para Windows               | [Decent Samples](https://www.decentsamples.com/product/decent-sampler-plugin/) |
| Limiter No6                   | Limitación final                   | [Repositorio oficial](https://github.com/losno/limiter6)                       |

Para cada referencia externa, la validación pendiente debe registrar hash, firma, arquitectura, licencia, escaneo y carga en FL Studio. Hasta entonces, `fl-studio-validation` no puede marcarse como aprobada.

## Verificación técnica

`pnpm audit --audit-level=low` termina con `No known vulnerabilities found`. La suite contiene **15 pruebas** y pasa completa; TypeScript, lint, build y `git diff --check` también pasan. `docs/audit-final.json` se conserva únicamente como salida machine-readable de la última evaluación, no como documentación adicional.

## Decisión GitHub

No se creó ni publicó `belentani7/duck-zion-apex-audit-2026-08-18`, porque publicar con Relevance 7/10 violaría la puerta 10/10 solicitada. La mutación `production.publishPrivateGithub` vuelve a calcular el gate en servidor y no ejecuta `gh` si una sola dimensión está bloqueada. Cuando exista la validación real de FL Studio y el gate sea 10/10, el procedimiento podrá crear el repositorio con `gh repo create --private --source <project> --push`.
