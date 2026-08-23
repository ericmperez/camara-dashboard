# Plan de producto: pizarra de votos conseguibles para el Presidente de la Cámara

Documento de producto para convertir La Cámara (SPA Vite + React, repo `camara-dashboard`) de un directorio público citado en una herramienta de trabajo del **Presidente de la Cámara**. No es un rediseño genérico del directorio ni la continuación de las fichas D38+. El núcleo es **seguir a los funcionarios de quienes el Presidente puede cogerles un voto** (whip / votos conseguibles) en una medida concreta.

**Usuario primario:** el Presidente de la Cámara, hoy Carlos `'Johnny'` Méndez Núñez (PNP, Distrito 36: Culebra, Vieques, Río Grande, Fajardo, Ceiba, Luquillo). El id en el roster es `carlos-johnny-mendez-nunez`. Quien use la pizarra en su nombre (portavoz, vicepresidenta, auxiliar de piso) actúa como operador del mismo trabajo; no es un segundo producto.

**Trabajo (job-to-be-done):** ante un voto que va al hemiciclo —un PC, una RC, una RCC o una RKC con nombre— el Presidente tiene que saber, de los 53 que están sentados ahora, **a quién ya le cogió el voto, a quién todavía se lo puede coger, quién dijo que no, quién está indeciso y a quién no ha contactado**, y si esa cuenta llega a la **mayoría de la Cámara (27 de 53)**.

---

## 1. Usuario, contexto y trabajo

### 1.1 Quién está sentado en la mesa

Composición vigente del directorio (cuatrienio 2025–2028, XX Asamblea):

| Bloque | Escaños | Notas de whip |
| --- | ---: | --- |
| PNP (mayoría) | 36 | El Presidente preside este bloque. En un voto de partido, 36 > 27. El trabajo real aparece cuando **el caucus se parte**, cuando hace falta **cobertura política** de minoría, o cuando un presidente de comisión frena o empuja la medida. |
| PPD | 13 | Minoría popular. El voto se coge persona por persona, no como bloque automático. |
| PIP | 3 | Minoría independentista. Mismo criterio: no se asume “no” de partido como hecho de sala. |
| Proyecto Dignidad | 1 | Un solo voto (Lisie Burgos). Palanca distinta: agenda moral/familiar, no estatus. |
| **Total** | **53** | 40 por distrito + 13 por acumulación (incluye ley de minorías). |

Mesa que el Presidente ya tiene en el roster:

- Presidente: Carlos `'Johnny'` Méndez Núñez (D36)
- Vicepresidenta: Yashira Lebrón Rodríguez (D8)
- Vicepresidente: Ángel R. Peña Ramírez (D33)
- Portavoz PNP: José E. Torres Zamora (acumulación; preside Calendario)
- Portavoz alterno PNP: Wilson J. Román López (D17)
- Portavoz PPD: Héctor E. Ferrer Santiago (acumulación)
- Portavoz alterno PPD: Domingo J. Torres García (D25)
- Portavoz PIP: Denis Márquez Lebrón
- Portavoz alterna PIP: Adriana Gutiérrez Colón (ley de minorías)
- Única PD: Lisie J. Burgos Muñiz

El Distrito 31 no es el electo de noviembre 2024: el titular vigente es Roberto López Román (especial 2025). Cualquier pizarra que “cogiera el voto” de Vimarie Peña Dávila estaría siguiendo a alguien que ya no está sentado.

### 1.2 Qué pregunta responde hoy vs. la que tiene que responder

Hoy la app responde: **¿quién está sentado?** (cara, partido, distrito, pueblo, ficha citada, fuerza 0–100, coautorías).

El Presidente necesita: **en esta medida, ¿a quién le puedo coger el voto y me alcanzan 27?**

Esa pregunta no se responde con un ranking de fuerza ni con un directorio. Se responde con un **estado de whip por representante por medida**, más un **conteo contra la mayoría del cuerpo**.

### 1.3 Qué no es este producto

- No es un mapa de lealtades inventadas ni un score de “cuán PNP es”.
- No es un live feed de votos en sala (ese dato no existe en el repo; se difiere).
- No es terminar las fichas VERIFIED del PR draft #2.
- No es un CRM genérico de 53 contactos sin medida encima.

---

## 2. Inventario de lo que ya existe (nombres de la app)

Todo esto ya se envía en `main` (v1.5.0). La pizarra de votos **reutiliza** estas piezas; no las tira.

### 2.1 Cinco vistas actuales

Definidas en `src/App.tsx` como `ChamberView`: `'caras' | 'hemiciclo' | 'ranking' | 'ficha' | 'conexiones'`.

| Vista | Qué hace hoy | Qué le falta para el trabajo del Presidente |
| --- | --- | --- |
| **Caras** | Grid de fotos (`FaceBoard` + `RepCard` + `PartyBlock`). Filtro por partido, pueblo, distrito 1–40, acumulación vs distrito. | No hay estado de whip sobre la cara. No hay medida activa. |
| **Hemiciclo** | Arco de 53 escaños con foto (`Hemicycle`, filas 8-12-15-18). Tocar un escaño selecciona y hace scroll a `#rep-id`. | El color es de partido, no de posición en el voto. No hay tally de sí contra 27. |
| **Ranking** | Orden por **fuerza** 0–100 (`RankBoard` + `strengthOf`). Desglosa votos CEE, proyectos PC y cargo. Bandas `alto` / `medio` / `bajo` / `sin-voto`. | Fuerza ≠ voto conseguible. Un presidente de comisión con pocos PC puede ser el voto que hay que coger. |
| **Ficha** | Biografía, trayectoria, aspiraciones, comisiones, votos CEE, últimos 4 proyectos SUTRA, fuentes, email/teléfono. **Vacío si no hay fuente citada.** | No hay posición de whip. No hay notas privadas. No hay tablero de una medida. |
| **Conexiones** | Lista + grafo. **HECHO** = línea continua con URL. **INFERENCIA** = línea punteada por solape de pueblos; el copy dice que **no es alianza**. | El solape de pueblos no puede alimentar un score de “me va a votar”. Las coautorías HECHO sí son palanca pública. |

La app es una SPA **sin router**. Cambiar de vista no cambia de URL. Para el Presidente eso es aceptable en iPad (PWA ya está con `vite-plugin-pwa`, `lang: 'es'`, `display: standalone`); para compartir “esta medida” hará falta más adelante una URL o un nombre de pizarra, diferido con el backend.

### 2.2 Roster de 53

`src/data/representatives.ts`: 53 ids únicos, 40 distritos cubiertos una sola vez, 13 acumulación. Fuente: [camara.pr.gov/representante](https://www.camara.pr.gov/representante/). Colofón: «Directorio oficial, agosto 2026».

Prueba canónica (`src/data/representatives.test.ts`): *tiene 53 representantes (40 distrito + 13 acumulación, ley de minorías)* y *compone la Cámara PNP 36 / PPD 13 / PIP 3 / PD 1*.

Cada ficha de roster trae: nombre, partido, distrito o acumulación, municipios, cargo, email, teléfono, foto, URL oficial.

### 2.3 Votos CEE (no son votos en sala)

`src/data/votes.json` + `src/lib/votes.ts`. Hay un `ElectionResult` por cada uno de los 53.

| Evento | Cuántos | Qué significa para whip |
| --- | ---: | --- |
| `generales-2024` | 50 | Hay `votes`, `pct`, `margin`, `runnerUp`. Un margen estrecho es palanca (el titular siente el pueblo). Un holgado no es “voto regalado”. |
| `especial-2025` | 1 | López Román D31. Mandato corto y estrecho; palanca distinta. |
| `ley-de-minorias` | 2 | `votes === null`. **No hay % popular.** No se puede pintar un 0–50 electoral falso. Banda de fuerza `sin-voto`. |

Harvest: `scripts/harvest_votes.py`, corrido el 2026-08-15 (`src/data/harvest-report.json`). Fuentes: XML CEE (D31 + acumulación) y Wikipedia EN del escrutinio. Los XML de distrito 2024 devolvieron 404; el plan no debe tratar el harvest como un feed vivo.

**Hueco de datos:** esto es **voto de urna**, no **voto de hemiciclo**. No hay acta de sala, no hay sí/no por PC en el JSON.

### 2.4 Proyectos SUTRA

`src/data/medidas.json` + `src/lib/measures.ts`. 53 expedientes. Conteos separados: **PC** (proyectos de ley) vs **RC + RCC + RKC** (resoluciones). La ficha muestra los últimos 4 PC y el enlace al legislador en SUTRA. `maxProjectCount` usa solo PC para no inflar productividad con ruido ceremonial.

Hay miles de PC en el harvest (el Presidente solo tiene 237 PC en su expediente SUTRA `M-969-AL`). Eso sirve para **identificar una medida y ver coautorías**, no para saber cómo votó el cuerpo.

### 2.5 Fuerza 0–100

`src/lib/strength.ts`, función `strengthOf`:

- Electoral: `min(50, round(pct CEE))`, o `null` si ley de minorías.
- Actividad: hasta 35 puntos, log del conteo de **PC** relativo al máximo.
- Cargo: Presidente 15, vice 12, portavoz 10, alterno 6.
- Total = electoral (o 0) + actividad + cargo. Banda `sin-voto` si no hay voto popular.

La fuerza es una **señal pública de peso institucional**. No es el estado de whip. Un `total` alto no significa “sí”; un `sin-voto` no significa “no se le puede coger el voto”.

### 2.6 Fichas: solo hechos citados

`src/lib/dossiers.ts` + `src/data/dossiers/`. Hay un `Dossier` por cada uno de los 53. En `main`, `DEEP_IDS.size === 20` (mesa + Aponte, Rivera Ruiz, López Román, Muriel, Ocasio, Hernández D3, Parés, Navarro D5, Morey D6, Pérez Ortiz D7). El resto puede estar vacío a propósito: *«Vacío a propósito: no hay biografía, trayectoria ni comisiones verificadas más allá del directorio oficial.»*

Presidencias de comisión viven en `CHAIRS` (`src/data/dossiers/commissions.ts`), aplicadas con `applyCommissions`. Ejemplo: Torres Zamora preside Calendario; Peña preside Ética; López Román preside Trabajo; Medina preside Región Este.

Regla de producto ya envuelta: **si no hay fuente, el campo queda vacío**. La pizarra de votos no puede rellenar lealtad, “amigo de”, o “me debe un favor” en la capa pública.

### 2.7 Conexiones: HECHO vs INFERENCIA

`connectionsOf` concatena hechos citados del dossier + `townOverlapConnections`. El solape de pueblos lleva `kind: 'inference'`, `sources: []` y la nota *«Inferencia por solape de municipios en el directorio. No implica alianza ni trato.»* El grafo dibuja HECHO continuo e INFERENCIA punteada.

**Regla que este plan conserva:** el solape de pueblos **permanece INFERENCIA, no alianza**. No entra al ranking de “a quién cogerle el voto”. Las coautorías con URL SUTRA sí: son HECHO y palanca legítima (“firmó conmigo el PC 375”).

### 2.8 Lo que la app ya hace bien para este usuario

- Español de interfaz (`lang: 'es'`, copy de vistas, empty states).
- 53 caras reconocibles; foto rota → iniciales, nunca hueco.
- Filtro pueblo → titular vigente (idea 6 de `docs/ideas-valor.md`).
- Alerta estructural del D31 (titular vigente, no el de 2024).
- Ley de minorías sin voto inventado.
- PC vs resoluciones separados.
- PWA instalable.
- Contacto (mailto / tel) en la ficha.

---

## 3. Huecos que bloquean el trabajo del Presidente

Estos huecos no se cierran con más fichas ni con un restyling del directorio.

1. **No hay whip status por miembro.** El tipo `Representative` no tiene posición sobre una medida. No existe `voto que puedo coger / sí / no / indeciso / no contactado`.
2. **No hay tablero por medida.** No se puede fijar “estamos en el PC 1302” y ver a los 53 contra ese PC. SUTRA lista *radicaciones*, no una pizarra de voto.
3. **No hay tally contra la mayoría de los 53.** El único tally en pantalla es PNP 36 / PPD 13 / PIP 3 / PD 1 (composición, no voto). Falta `sí` vs **27**.
4. **No hay notas privadas.** Todo lo que se commitea es público (repo GitHub público). Un “lo vi en el pasillo, está indeciso por AAA” no puede vivir en `verified.ts` ni en JSON versionado.
5. **No hay votos en sala.** `votes.json` es CEE. Tratarlo como acta de hemiciclo sería un error de producto.
6. **No hay capa privada.** SPA estática, sin auth, sin backend. Cualquier estado de whip que se suba al repo se filtra.

Mientras 1–4 no existan, el Presidente sigue usando WhatsApp, papel o memoria. El directorio no le sirve para coger votos.

---

## 4. Resultados de producto comprobables

Cada resultado se puede marcar hecho/no hecho en un review de UI, sin criterio estético.

### 4.1 Unidad de trabajo: una medida

- El Presidente (o su operador) **nombra la medida** con código SUTRA (`PC 1302`, `RC 375`, …) y un título corto opcional.
- La pizarra es **por medida**. Cambiar de medida cambia los 53 estados. No hay un “whip eterno” mezclado entre proyectos.
- Si el código existe en `medidas.json`, se muestran autores/coautores citados y el enlace SUTRA. Si no existe, la pizarra igual funciona: el voto puede ser una moción de piso que SUTRA aún no tiene.

### 4.2 Posición por representante (conjunto cerrado)

Cada uno de los 53 tiene **exactamente un** estado, elegido a mano. El conjunto cerrado es:

| Estado | Significado operativo | Color sugerido (no es partido) |
| --- | --- | --- |
| **no contactado** | Nadie del equipo le ha pedido el voto. Default al abrir una medida nueva. | Gris |
| **voto que puedo coger** | El Presidente cree que **todavía se le puede conseguir** el sí. Es el trabajo activo: hay que hablarle. | Ámbar |
| **indeciso** | Ya se le pidió; no cierra. Hay que volver. | Violeta |
| **sí** | Compromiso de votar a favor. Cuenta para la mayoría. | Verde |
| **no** | Compromiso de votar en contra (o rechazo explícito). | Rojo |

Reglas:

- El default es **no contactado**, nunca **sí** por ser PNP. Autocompletar lealtad de partido violaría la regla de hechos citados y fabricaría un score de lealtad.
- **voto que puedo coger** no cuenta como sí. Es el *pipeline*, no el *cierre*.
- Ausente / en viaje / recusado **no** entra en este conjunto en la primera versión. Si hace falta, se difiere como sexto estado. Hasta entonces, un ausente se deja en `no contactado` o `no` según lo que el Presidente sepa, en nota privada (cuando exista capa privada).
- El Presidente puede cambiar el estado en cualquier momento. El historial de cambios se difiere (requiere backend).

### 4.3 Conteo contra la mayoría de los 53

- **Mayoría del cuerpo = 27.** (floor(53/2)+1).
- La pizarra muestra, siempre visible (no al final de un scroll):

  `Sí N / 27`  
  `Faltan max(0, 27 − N)`  
  desglose: `puedo coger A · indeciso B · no C · no contactado D`  
  con `N + A + B + C + D = 53`.

- Semáforo: `N ≥ 27` = hay mayoría numérica comprometida; `N + A ≥ 27` = la mayoría es alcanzable si se cierran los gettable; `N + A + B < 27` = aunque se convenza a indecisos y gettables, no llega — hay que reabrir `no` o `no contactado`.
- Este tally **no** usa votos CEE ni fuerza. Solo los cinco estados.

Quórum, “mayoría de los presentes” y empates se **diferirán** con el harvest de votos en sala. Hasta entonces el número de producto es 27 de 53, que es lo que el Presidente puede planear *antes* de abrir la sesión.

### 4.4 Palanca pública de “conseguible” (informa, no decide)

El estado lo pone el humano. La app **ordena y explica** con señales que ya existen y están citadas:

| Señal | Fuente en el código | Cómo informa “gettable” | Lo que no puede hacer |
| --- | --- | --- | --- |
| **Partido** | `Representative.party`, `PARTY_META.bloc` | Un PNP en `no contactado` es, por hipótesis de caucus, el primer sitio donde buscar un sí. Un PIP en `voto que puedo coger` es una excepción que el Presidente marcó a propósito. | No auto-marca `sí` a los 36 PNP. |
| **Cargo o presidencia de comisión** | `role`, `CHAIRS` / `applyCommissions` | Quien preside Calendario, Hacienda, lo Jurídico o la comisión de la medida tiene palanca de agenda, no solo un voto. El Presidente 15 pts de fuerza ya modela el cargo; aquí se usa como *quién hay que hablar*. | No convierte una presidencia en alianza. |
| **Margen CEE** | `ElectionResult.margin` / `pct` | Margen estrecho (y el especial D31) = el titular siente el pueblo; palanca de “esto se ve en el distrito”. Holgado = menos miedo electoral, otra conversación. | No inventa % para ley de minorías (`votes === null` → palanca `sin-voto`, texto explícito). |
| **Coautorías citadas** | `DossierConnection` con `kind: 'fact'` y URL SUTRA | “Firmó con X el PC N” es HECHO. Si X es el autor de *esta* medida, esa persona es candidata a `voto que puedo coger`. | No usa firmas de hace un cuatrienio como voto de hoy. |

**Solape de pueblos:** sigue siendo **INFERENCIA**, no alianza. Puede mostrarse en Conexiones como hoy. **No entra** al orden de “a quién cogerle el voto”, **no pinta** el chip de whip, **no suma** al semáforo.

Una cola sugerida (UI, no estado) para el Presidente:

1. `voto que puedo coger` primero (trabajo activo).
2. Dentro de esos, priorizar: misma comisión HECHO o coautoría HECHO de la medida → margen CEE más estrecho → mismo partido aún `no contactado`.
3. Nunca priorizar por pueblos en común.

### 4.5 Criterio de aceptación de la pizarra (cuando se implemente)

Una sesión con el Presidente se considera exitosa si, sin un desarrollador al lado:

1. Abre la app en español.
2. Nombra o elige una medida.
3. Ve 53 caras.
4. Marca a cinco personas `sí`, a tres `voto que puedo coger`, a una `no`.
5. Lee `Sí 5 / 27` y `Faltan 22` (o el aritmético correcto).
6. Abre a un PPD y ve partido, cargo/comisión, margen CEE y coautorías HECHO — y un solape de pueblo etiquetado INFERENCIA, no como “aliado”.
7. No ve un campo de chisme publicado en la ficha pública.

---

## 5. Barra profesional y funcional (sin desarrollador)

La barra no es “se ve bonito”. Es **usable en el hemiciclo, en español, en un iPad, el día del voto**.

### 5.1 Idioma y copy

- Toda la pizarra en español de Puerto Rico: *voto que puedo coger*, *sí*, *no*, *indeciso*, *no contactado*, *faltan N para 27*, *mayoría del cuerpo*.
- Cero jerga de producto (*whip status*, *pipeline*, *CTA*) en la UI. “Whip” puede vivir en este documento, no en el botón.
- Empty states ya existentes se conservan: *Sin biografía verificada*, *Vacío a propósito*, *INFERENCIA: no hay URL de hecho*.

### 5.2 Un día de voto (flujo)

1. **Antes.** El Presidente o el portavoz abre **Pizarra de voto**, escribe `PC 1302`, ve 53 en `no contactado`. Recorre el caucus PNP y marca `sí` a quien ya cerró en el caucus. Marca `voto que puedo coger` a los que hay que buscar en el pasillo. El tally dice si 27 está a la vista.
2. **En el piso.** iPad en la mano. Tocar cara → cambiar estado. El hemiciclo se recolorea por estado (no por partido) mientras la pizarra está activa; un toggle “ver partido / ver voto” evita perder el mapa político.
3. **Cierre.** `Sí ≥ 27` o se baja la medida. No se exige persistencia en la nube en la primera entrega (ver §6).

### 5.3 Densidad y acceso

- Targets grandes (cara + chip de estado). El hemiciclo actual ya es tocable; se reusa.
- El tally de mayoría está **pinneado** (header), no debajo del ranking.
- Buscar por nombre, pueblo o distrito sigue funcionando: “Yauco” sigue trayendo al titular vigente, ahora con su chip de voto.
- Contacto (tel/email) permanece a un toque desde la ficha, porque coger un voto es una llamada, no un gráfico.

### 5.4 Hechos citados se quedan públicos

La capa que ya es pública (roster, CEE, SUTRA, fichas, HECHO/INFERENCIA) **no cambia de regla**. La pizarra añade estado de voto **encima**, no adentro de `verified.ts`. Un campo de ficha pública nunca muestra “me prometió el sí”.

### 5.5 Confidencialidad

El repo es **público**. Notas de whip y estados de voto son material de piso. Publicarlos en GitHub sería un fallo profesional, no un detalle técnico. Ver §6.

---

## 6. Capa pública vs capa privada (decisión de arquitectura)

### 6.1 Qué puede vivir en git

Público, versionado, citado:

- Roster de 53, fotos, cargos, `CHAIRS`.
- `votes.json` (CEE).
- `medidas.json` (SUTRA).
- Dossiers VERIFIED y conexiones HECHO.
- Este plan.

### 6.2 Qué no puede vivir en git

- Estado de whip por medida (`sí` / `no` / …).
- Notas (“lo vi con Ferrer; pide enmienda al Art. 5”).
- Listas de “estos PNP se me van”.

### 6.3 Capa privada requerida para *enviar* la pizarra

Para que el Presidente use la pizarra de verdad hace falta **una capa privada**. Opciones, en orden de coste:

| Opción | Qué es | Cuándo |
| --- | --- | --- |
| **A. Solo este aparato** | `localStorage` / IndexedDB en el iPad del Presidente. Nada se commitea. Aviso claro: “esto vive en este iPad; si lo borras, se acaba.” | Primera entrega funcional. No requiere auth/backend. |
| **B. Cuenta y servidor** | Auth + store privado (un usuario: el Presidente / mesa). Sync entre iPad y teléfono. | Diferido: **auth/backend**. |
| **C. JSON en el repo** | Inválido. | Nunca. |

Este plan **exige A o B** antes de declarar la pizarra “en producción”. **A** es suficiente para “funcional en el hemiciclo”. **B** se lista como diferido, no olvidado. Las **notas privadas** quedan explícitamente **diferidas** hasta que A o B exista; no se diseña un textarea que escriba a `src/data/`.

---

## 7. Cómo se ve (especificación de UI, no mock de código)

Nueva vista sexta, al lado de Caras / Hemiciclo / Ranking / Ficha / Conexiones:

**Etiqueta en español: `Voto`.**

Pantalla:

```
[ PC 1302 ▾  “Oficina de Ayuda Vieques y Culebra” ]
Sí 18 / 27     Faltan 9     puedo coger 7 · indeciso 3 · no 2 · no contactado 23

[ Hemiciclo recoloreado por estado ]     o     [ Caras con chip ]

Al tocar a Gretchen Hau:
  PPD · D… · margen CEE … · preside … o no
  Coautorías HECHO: …
  Pueblos en común con X: INFERENCIA (no alianza)
  Estado: ( no contactado | voto que puedo coger | indeciso | sí | no )
  Nota privada: (oculto / “disponible cuando haya capa privada”)
```

El Hemiciclo y Caras existentes se convierten en *modos de la pizarra* cuando `view === 'voto'`, no se duplican tres grids nuevos.

Ranking en modo voto: opcional, ordenar por cola de §4.4 en vez de fuerza. La fuerza sigue disponible en la vista Ranking original; no se borra.

---

## 8. Modelo conceptual (para cuando se implemente)

No se implementa en este documento. El modelo es el contrato.

```
WhipBoard
  measureCode: string          // "PC1302"
  title: string | null
  updatedAt: string            // ISO, local
  seats: Record<RepId, WhipSeat>

WhipSeat
  status: 'no-contactado' | 'voto-que-puedo-coger' | 'si' | 'no' | 'indeciso'
  note: string | null          // solo capa privada; null mientras esté diferido
```

Derivados (nunca se guardan):

```
majority = 27
yesCount = count(status == 'si')
need = max(0, 27 - yesCount)
reachableIfGettable = yesCount + count('voto-que-puedo-coger') >= 27
```

Señales de palanca (solo lectura, de datos públicos):

```
leverage(rep):
  party, bloc
  role, chairs[]
  cee: { margin, pct } | { kind: 'sin-voto' }
  factCoauthors: DossierConnection[]  // kind === 'fact'
  townOverlap: DossierConnection[]    // kind === 'inference' — display only
```

---

## 9. Relación con `docs/ideas-valor.md`

Varias de las 100 ideas ya están hechas (ficha cruzada CEE+SUTRA, D31, ley de minorías, hemiciclo con foto, ranking desglosado, filtro pueblo, tira 1–40, PC vs RC, banda `sin-voto`, cargo visible, scroll a ficha). Siguen siendo el piso.

Este plan **no las sustituye**. Añade el trabajo que esas ideas no cubren: el voto que se coge hoy. Ideas de valor que se vuelven *input* de palanca (margen vs actividad, enlace al acta CEE, últimos 4 proyectos, coautorías) se reusan en el panel del asiento. Ideas de harvest en vivo, recintos, o video-recap **siguen fuera**.

---

## 10. Diferimientos explícitos (no olvidados)

| Ítem | Por qué se difiere | Cómo se retoma |
| --- | --- | --- |
| **Harvest de votos en sala (live floor-vote)** | El repo tiene CEE y SUTRA de radicación, no actas de votación del hemiciclo. No hay fuente cableada. Inventar un feed sería infeasible. | Cuando exista XML/HTML estable de votaciones de la Cámara o SUTRA de resultado, un harvest aparte. Hasta entonces el sí/no lo pone el Presidente a mano. |
| **Fichas VERIFIED que faltan (D38+ y acumulación pendiente)** | En `main` hay 20 profundas. El PR draft #2 sube a ~30 (D8–D37). Completar fichas no crea whip. | Seguir el pipeline de citas; no bloquea la pizarra. Un asiento con ficha vacía igual recibe estado de voto. |
| **Merge del draft PR #2** (`cursor/ficha-d8-yashira`) | El propio PR dice no mergear. Es trabajo de dossiers, no de pizarra. | Review humano aparte. Este plan no lo mergea ni lo depende. |
| **Auth / backend** | Hace falta para sync entre aparatos y notas privadas duraderas. No hace falta para un iPad del Presidente. | Opción B de §6. Hasta entonces, notas privadas **diferidas**; estados pueden vivir en el aparato (opción A) cuando se implemente la pizarra. |
| **Notas privadas en UI** | Sin capa privada, un textarea se iría a git o se perdería sin aviso. | Se habilitan el día que exista A o B. |
| **Historial de cambios de estado** | Requiere persistencia con timestamp y autor. | Con backend. |
| **Sexto estado “ausente”** | El conjunto cerrado de cinco cubre el trabajo. Ausente se anota después. | Si el Presidente lo pide tras usarlo. |
| **Mayoría de presentes / quórum** | Depende de quién está en sala ese día (live). | Junto al harvest de votos en sala. |
| **Deploy de producción con dominio** | Hoy no hay GitHub Pages ni homepage. | Fuera de este plan de producto; no bloquea el diseño. |
| **Score de lealtad / “quién me traicionó”** | Choca con hechos citados. | No se retoma. Queda fuera a propósito. |

---

## 11. Criterio de “profesional” aplicado a lo que ya existe

Mientras se implementa la vista `Voto`, el directorio actual ya debe sentirse como herramienta de mesa, no como demo:

- Las cinco vistas se quedan; no se esconden.
- Copy de masthead puede pasar de *«Quién está sentado ahora»* a *«Quién está sentado — y de quién puedo coger el voto»* **solo** cuando la sexta vista exista. Antes, no prometer el trabajo.
- Fuerza, CEE y SUTRA se etiquetan con su nombre real en la ficha (*Votos (CEE)*, *Proyectos (SUTRA)*), nunca *“su voto”* a secas, para no confundir urna con sala.
- El colofón del harvest (agosto 2026 / `ranAt` del harvest) se mantiene: el Presidente no debe citar un titular viejo.

---

## 12. Key Decisions

1. **Usuario = Presidente; trabajo = coger votos, no directorio.** Todo feature se evalúa: ¿le ayuda a Johnny a cerrar 27? Si solo embellece Caras, no entra en este plan.
2. **Conjunto cerrado de cinco estados**, con *voto que puedo coger* distinto de *sí*. El pipeline no infla la mayoría.
3. **Mayoría = 27 de 53**, visible siempre. Quórum y presentes se diferirán.
4. **Nada de auto-sí por partido.** El PNP de 36 es contexto, no estado.
5. **Palanca pública = partido + cargo/presidencia + margen CEE + coautorías HECHO.** El solape de pueblos queda INFERENCIA, no alianza.
6. **Hechos citados se quedan.** La pizarra no escribe en `verified.ts`.
7. **Capa privada obligatoria para enviar whip.** Git no guarda estados. Primera vía: aparato local. Auth/backend diferido. Notas privadas diferidas hasta esa capa.
8. **No hay votos en sala en v1.** CEE ≠ hemiciclo. El sí/no lo marca el humano.
9. **PR #2 y fichas restantes no bloquean.** Un asiento vacío de biografía igual se marca `sí`.
10. **Sexta vista `Voto`**, reusando Caras/Hemiciclo, no un app aparte.

---

## 13. PR Plan (implementación futura; no forma parte de este goal)

Este goal entrega el plan, no el código. Cuando se ejecute, el orden realista es:

### PR 1: Modelo de whip y tally 27/53

- **Archivos:** `src/types.ts`, `src/lib/whip.ts` (nuevo), `src/lib/whip.test.ts`.
- **Dependencias:** ninguna.
- **Cambio:** tipos `WhipStatus` / `WhipBoard`, default `no-contactado`, funciones `yesCount`, `needForMajority` (27), `statusBreakdown`. Cero UI. Cero persistencia. No se toca `votes.json`.

### PR 2: Vista `Voto` (pizarra + hemiciclo recoloreado)

- **Archivos:** `src/App.tsx`, `src/components/Hemicycle.tsx`, `src/components/FaceBoard.tsx`, `src/App.css`, tests de App.
- **Dependencias:** PR 1.
- **Cambio:** sexta vista en español. Input de medida. Chips de estado. Tally pinneado `Sí N / 27`. Default todos `no contactado`. Persistencia **solo memoria de sesión** (se pierde al recargar) — suficiente para review, no para el iPad del Presidente.

### PR 3: Palanca pública en el asiento (sin alianza de pueblos)

- **Archivos:** panel al lado de `Ficha.tsx` o componente `WhipLeverage.tsx`, `src/lib/dossiers.ts` (solo lectura), tests.
- **Dependencias:** PR 2.
- **Cambio:** al seleccionar un representante en `Voto`, mostrar partido, cargo/CHAIRS, margen CEE o `sin-voto`, coautorías `kind === 'fact'`. Mostrar solape como INFERENCIA si se muestra. Orden opcional de la cola gettable. **Prohibido** puntuar alianza por municipio.

### PR 4: Persistencia en el aparato (capa privada A)

- **Archivos:** `src/lib/whip-store.ts`, aviso de UI, tests de serialización.
- **Dependencias:** PR 2.
- **Cambio:** guardar tableros por código de medida en `localStorage`. Banner: “Esto vive en este iPad; no se sube al directorio público.” Cero escritura a `src/data/`. Notas privadas pueden habilitarse aquí como string local, o seguir diferidas si se prefiere esperar auth.

### PR 5 (diferido): auth/backend y notas sincronizadas

- **Dependencias:** PR 4.
- **Cambio:** cuenta de mesa, sync, historial. Fuera de la primera entrega profesional-en-un-iPad.

PRs que **no** se abren desde este plan: merge de `cursor/ficha-d8-yashira`, harvest de votos en sala, scores de lealtad.

---

## 14. Riesgos

- **Confundir CEE con sala.** Mitigación: labels *Votos (CEE)* vs *Pizarra de voto*; el tally 27 solo lee estados de whip.
- **Filtrar el whip.** Mitigación: §6; review de PR rechaza JSON de estados en el repo.
- **El caucus de 36 adormece el producto.** Mitigación: el trabajo se explica con votos que parten al PNP (comisiones, distritos costeros, D31 especial), no con “ganar al PIP”.
- **Fichas vacías se leen como “no existe”.** Mitigación: empty state ya existe; el chip de voto vive igual.
- **PWA en iPad con localStorage borrado por Safari.** Mitigación: banner de capa A; auth (PR 5) cuando duela.

---

## 15. Definición de hecho de este documento

Este archivo es el plan de producto. Queda hecho cuando un lector puede:

1. Nombrar al Presidente como usuario y “cogerles un voto” como trabajo.
2. Recitar las cinco vistas de hoy y los huecos (sin whip, sin tablero por medida, sin tally 27, sin notas privadas).
3. Recitar los cinco estados, el 27 de 53, las cuatro palancas públicas y que el pueblo-solape no es alianza.
4. Recitar la barra en español / hechos citados / la lista de diferidos (sala en vivo, fichas que faltan, PR #2, auth/backend, notas privadas).

Implementar la vista `Voto` es un goal aparte, guiado por el PR Plan del §13.
