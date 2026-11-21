# Web de TELinSOLAR

Web estática (HTML + CSS + JavaScript, sin frameworks) en castellano y catalán, publicada con GitHub Pages.
Las instalaciones de la sección «Nuestros proyectos» se gestionan desde un panel web (Pages CMS), sin tocar código.

## Cómo funciona

```
Lluís edita en Pages CMS ──► commit en GitHub (data/projects/*.json, media/projectes/*)
                                   │
                                   ▼
            GitHub Actions: npm run dist  (une los proyectos + optimiza fotos)
                                   │
                                   ▼
                   GitHub Pages publica la web (1-2 minutos)
```

| Archivo / carpeta | Qué contiene |
|---|---|
| `index.html` | La página. El texto en castellano está aquí. |
| `i18n.js` | Traducciones al catalán y textos generados por JavaScript (es/ca). |
| `styles.css` · `script.js` | Diseño y lógica (idioma, fichas de proyecto, filtros, formulario). |
| `config.js` | Configuración del formulario de contacto. |
| `data/projects/*.json` | **Una instalación por archivo.** Es lo que edita el panel. |
| `media/projectes/` · `docs/projectes/` | Fotos y PDF de los proyectos. |
| `.pages.yml` | Definición del formulario del panel (Pages CMS). |
| `scripts/build.mjs` | Une los proyectos en `data/projects-index.js` y prepara `_site/` con las fotos optimizadas. |
| `.github/workflows/deploy.yml` | Publicación automática en cada cambio en `main`. |
| `.github/workflows/clean-images.yml` · `scripts/clean-images.mjs` | Quita el GPS y demás metadatos de cada foto subida (p. ej. desde el panel) y reduce las de más de 2000 px. |

## Ver la web en local

```bash
npm install          # solo la primera vez
npm run build        # genera data/projects-index.js
# y abre index.html en el navegador
```

`npm run dist` genera además la carpeta `_site/` exactamente como se publica.

---

## Puesta en marcha (una sola vez)

### 1. Publicar desde `main`
1. Fusiona la rama de desarrollo en `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Comprueba en la pestaña **Actions** que el despliegue termina en verde y abre la URL que indica.

### 2. Que el repositorio sea de TELinSOLAR
Recomendado para la entrega: crea una cuenta u organización de GitHub de TELinSOLAR y transfiere el repositorio
(**Settings → General → Danger Zone → Transfer ownership**). Tú puedes seguir como colaborador para dar soporte.
GitHub Pages gratuito necesita que el repositorio sea **público** (el contenido de la web ya es público de todos modos).

### 3. Panel de edición para Lluís (Pages CMS)
1. Entra en **https://app.pagescms.org** con la cuenta de GitHub propietaria del repositorio.
2. Instala la app de Pages CMS en GitHub cuando lo pida y dale acceso **solo a este repositorio**.
3. Abre el repositorio en Pages CMS, rama `main`. Debe aparecer el apartado **«Instal·lacions»**.
4. En **Collaborators**, invita a Lluís **por email**: recibirá un enlace y entrará con un código que le llega al correo.
   **No necesita cuenta de GitHub.**
5. Pásale la guía [`docs/guia-panell.md`](docs/guia-panell.md) (en catalán).

### 4. Formulario de contacto
El formulario envía a Formspree (`https://formspree.io/f/mrpqyznv`, configurado en `config.js`).

1. Crea una cuenta gratuita en **[Formspree](https://formspree.io)** con el email donde deben llegar las solicitudes
   y crea un formulario. Copia su URL (`https://formspree.io/f/XXXXXXXX`).
   *(Alternativa: [Web3Forms](https://web3forms.com), endpoint `https://api.web3forms.com/submit` + access key.)*
2. Pégala en `config.js`:
   ```js
   form: { endpoint: 'https://formspree.io/f/XXXXXXXX', accessKey: '' },
   ```
3. Haz una prueba real desde la web publicada y confirma el email (Formspree lo pide la primera vez).

El email que llega incluye nombre, teléfono, dirección, tipo de instalación, necesidades e idioma.
Lleva un campo trampa oculto para frenar el spam de robots.

### 5. Dominio propio (`telinsolar.com`)
1. **Settings → Pages → Custom domain**: escribe `www.telinsolar.com` (o `telinsolar.com`) y guarda.
2. En el proveedor del dominio, añade:
   - `CNAME` `www` → `<cuenta-propietaria>.github.io`
   - Registros `A` para `telinsolar.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Cuando GitHub lo valide, marca **Enforce HTTPS**.

⚠️ **No toques los registros `MX`**: son los del correo `@telinsolar.com`.

---

## Antes de publicar: pendientes de contenido
- [x] Teléfono real (611 603 902).
- [ ] Datos definitivos de **Casa Dolors** (la nota y el estudio no coinciden: 6,6 vs 9,84 kWp, 5 vs 12 kW, 10,2 vs 16 kWh).
- [ ] Permiso por escrito de los clientes para publicar fotos de su casa.
- [ ] Completar los proyectos «Exemple 1-11» (fotos reales, datos ESTIMADOS: nombre, comarca, ficha) y quitarles la marca de ejemplo.
- [ ] Página de política de privacidad (RGPD) enlazada desde el formulario.
