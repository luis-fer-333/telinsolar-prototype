/*
 * CONFIGURACIÓN DEL WEB
 *
 * Formulario de contacto: las solicitudes se envían a un servicio externo que las reenvía por email.
 * Mientras `endpoint` esté vacío, el formulario funciona en modo demostración (no envía nada).
 *
 *  - Formspree (https://formspree.io): crea un formulario y copia su URL:
 *        endpoint: 'https://formspree.io/f/XXXXXXXX', accessKey: ''
 *  - Web3Forms (https://web3forms.com): pide una "access key" con el email de destino:
 *        endpoint: 'https://api.web3forms.com/submit', accessKey: 'xxxxxxxx-xxxx-...'
 */
window.TELINSOLAR_CONFIG = {
    form: {
        endpoint: '',
        accessKey: '',
    },
};
