/*
 * PROYECTOS — un bloque { ... } por instalación.
 * El orden de esta lista es el orden en que aparecen en la web.
 *
 * Campos:
 *   name            Nombre del proyecto. Texto, o { es: '...', ca: '...' } si cambia según el idioma.
 *   location        Comarca o población.
 *   type            'aillada' (aislada) o 'connectada' (conectada a red).
 *   example         true = datos de ejemplo (se muestra la etiqueta «Ejemplo»). Quitar al poner datos reales.
 *   panelsKwp       Potencia de paneles, en kWp.
 *   panels          Número de paneles.
 *   optimizers      true / false.
 *   inverterKw      Potencia del inversor, en kW (null si no hay).
 *   microinverterKw Potencia de los microinversores, en kW (null si no hay).
 *   storageKwh      Capacidad de baterías, en kWh (0 si no hay).
 *   batteries       Número de baterías.
 *   consumptionKwh  Consumo anual, en kWh.
 *   loads           Consumos destacados: [{ key, detail }]. Claves disponibles:
 *                   pool (piscina), ev (cargador coche), aerothermal (aerotermia), ac (aire acondicionado),
 *                   pump (bomba de agua / pozo), machinery (maquinaria), common (zonas comunes), lift (ascensor).
 *   productionKwh   Producción anual, en kWh.
 *   paybackYears    Amortización, en años.
 *   costEur         Coste aproximado, en euros.
 *   illustration    Dibujo si no hay foto: 'house', 'house-bat', 'nave', 'campo', 'edificio'.
 *   media           Fotos y/o vídeos (opcional). Un elemento o una lista; con varios se muestran
 *                   en un carrusel con flechas. Ejemplos:
 *                     { type: 'image', src: 'media/casa-dolors-1.jpg', alt: { es: '...', ca: '...' } }
 *                     { type: 'video', src: 'media/casa-dolors.mp4', poster: 'media/casa-dolors-1.jpg' }
 *   document        PDF con la ficha o la propuesta (opcional), p. ej. 'docs/casa-dolors.pdf'.
 */
window.TELINSOLAR_PROJECTS = [
    {
        name: 'Casa Dolors',
        location: 'Ripollès',
        type: 'aillada',
        example: false,
        panelsKwp: 6.6,
        panels: 16,
        optimizers: false,
        inverterKw: 5,
        microinverterKw: null,
        storageKwh: 10.2,
        batteries: 2,
        consumptionKwh: 3000,
        loads: [
            { key: 'pool', detail: '3/4 CV' },
            { key: 'ev', detail: '16 kW' },
            { key: 'aerothermal', detail: '8 kW' },
        ],
        productionKwh: 2500,
        paybackYears: 3.5,
        costEur: 12000,
        illustration: 'house-bat',
        media: [
            {
                type: 'image',
                src: 'media/casa-dolors-1.jpg',
                alt: {
                    es: 'Vista aérea de Casa Dolors con 16 placas solares sobre el tejado del porche',
                    ca: 'Vista aèria de Casa Dolors amb 16 plaques solars sobre la teulada del porxo',
                },
            },
            {
                type: 'image',
                src: 'media/casa-dolors-2.jpg',
                alt: {
                    es: 'Casa Dolors, masía de piedra en el Ripollès, con la instalación solar entre el bosque',
                    ca: 'Casa Dolors, masia de pedra al Ripollès, amb la instal·lació solar enmig del bosc',
                },
            },
        ],
        document: null,
    },

    // ---- A partir de aquí, DATOS DE EJEMPLO: sustituir por proyectos reales ----
    {
        name: { es: 'Vivienda en el Maresme', ca: 'Habitatge al Maresme' },
        location: 'Maresme',
        type: 'connectada',
        example: true,
        panelsKwp: 4.5,
        panels: 10,
        optimizers: true,
        inverterKw: 4,
        microinverterKw: null,
        storageKwh: 5,
        batteries: 1,
        consumptionKwh: 4500,
        loads: [
            { key: 'ev', detail: '7,4 kW' },
            { key: 'ac' },
        ],
        productionKwh: 6700,
        paybackYears: 6,
        costEur: 7500,
        illustration: 'house-bat',
        media: null,
        document: null,
    },
    {
        name: { es: 'Masía aislada', ca: 'Masia aïllada' },
        location: 'Garrotxa',
        type: 'aillada',
        example: true,
        panelsKwp: 8,
        panels: 18,
        optimizers: false,
        inverterKw: 6,
        microinverterKw: null,
        storageKwh: 15,
        batteries: 3,
        consumptionKwh: 5000,
        loads: [
            { key: 'pump', detail: '1,5 CV' },
            { key: 'aerothermal', detail: '6 kW' },
        ],
        productionKwh: 5200,
        paybackYears: 7,
        costEur: 16000,
        illustration: 'campo',
        media: null,
        document: null,
    },
    {
        name: { es: 'Comunidad de vecinos', ca: 'Comunitat de veïns' },
        location: 'Vallès Oriental',
        type: 'connectada',
        example: true,
        panelsKwp: 15,
        panels: 34,
        optimizers: false,
        inverterKw: 15,
        microinverterKw: null,
        storageKwh: 0,
        batteries: 0,
        consumptionKwh: 30000,
        loads: [
            { key: 'lift' },
            { key: 'common' },
        ],
        productionKwh: 22500,
        paybackYears: 6,
        costEur: 18000,
        illustration: 'edificio',
        media: null,
        document: null,
    },
    {
        name: { es: 'Nave industrial', ca: 'Nau industrial' },
        location: 'Vallès Occidental',
        type: 'connectada',
        example: true,
        panelsKwp: 100,
        panels: 222,
        optimizers: false,
        inverterKw: 100,
        microinverterKw: null,
        storageKwh: 0,
        batteries: 0,
        consumptionKwh: 180000,
        loads: [
            { key: 'machinery' },
            { key: 'ac' },
        ],
        productionKwh: 150000,
        paybackYears: 5,
        costEur: 85000,
        illustration: 'nave',
        media: null,
        document: null,
    },
];
