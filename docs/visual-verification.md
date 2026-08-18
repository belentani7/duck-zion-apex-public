# Visual verification

La preview tras reiniciar el servidor corresponde al proyecto DUCK ZION Apex y ya no al proceso antiguo. La vista desktop muestra un dashboard oscuro de alto contraste con acento verde neón, marca DUCK ZION, CTA `New project`, CTA `Run audit`, cuatro métricas superiores, navegación por pestañas y tarjetas de proyectos/delivery.

El primer intento de captura mostró una pantalla vacía y después una experiencia antigua; la causa fue que el servidor gestionado estaba apuntando a un proceso anterior mientras el puerto 3000 estaba ocupado. Tras reiniciar, la preview quedó corregida.

La captura final confirma jerarquía visible, contraste suficiente en la pantalla principal, bordes de foco visual, tarjetas con estados y una identidad consistente. Aún falta capturar móvil y revisar personalmente keyboard focus/reduced motion antes de marcar la verificación visual completa.

La captura móvil 390x844 confirma que el header, jerarquía de marca, CTA de proyecto/auditoría y tarjetas métricas se adaptan sin desbordamiento horizontal visible. Las pestañas continúan en una fila desplazable. El tercer indicador queda parcialmente fuera del viewport por el scroll natural, no por overflow roto; requiere scroll vertical esperado.

La captura desktop 1280x900 posterior a las últimas integraciones confirma que la marca, el header, los CTA, las cuatro métricas, tabs, proyectos, delivery pulse, puerta privada y feed `audit.run` mantienen jerarquía y contraste. El feed muestra dos auditorías reproducibles generadas por el test/flujo actual; la puerta continúa bloqueada, como exige el criterio 10/10.

La captura móvil final mantiene el layout responsive, el header compacto, CTAs accesibles y tarjetas sin desbordamiento horizontal después de añadir auditoría y portal dinámico. Las vistas de cliente y vocal lab quedan por debajo del primer viewport y se acceden mediante tabs/scroll, comportamiento esperado.

La verificación de rutas capturó `/` con el dashboard DUCK ZION y `/404` con el fallback visual del scaffold. La ruta principal muestra estado vacío seguro para proyectos y el fallback ofrece botón Go Home. El flujo de la interfaz conserva estados de ausencia de proyecto, ausencia de entrega activa, ausencia de comentarios y puerta bloqueada.

## Verificación final 2026-08-18

La vista desktop a 1280x720 mantiene la identidad oscura/neón, el encabezado de comandos, las tarjetas métricas, el estado bloqueado del Quality Gate, el feed de auditoría y la cuadrícula responsive sin desbordamiento visible. El botón de auditoría queda expuesto junto a la creación de proyecto y el gate explica que la publicación privada exige evidencia reproducible 10/10.

La vista móvil a 375x812 apila el dashboard en una sola columna legible. Las acciones primarias permanecen visibles, las tarjetas no se recortan, la barra de pestañas queda contenida y el feed de actividad conserva legibilidad. El estado vacío de proyectos y la advertencia del gate mantienen contraste y rutas de salida claras.

Durante la captura no se observaron errores TypeScript; únicamente apareció una advertencia no bloqueante sobre la antigüedad de `baseline-browser-mapping`.

La captura desktop posterior al flujo GitHub mantiene el Quality Gate visible como `LOCKED`, el CTA `Run audit`, el feed de auditoría y el mensaje de que la publicación permanece deshabilitada hasta reunir 10/10 reproducible en las seis dimensiones. El control de repositorio y los estados de publicación se encuentran en el panel Quality gate de la pestaña inferior correspondiente.
