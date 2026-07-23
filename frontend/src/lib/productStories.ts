import type { Callout } from '@/components/motion/ScrollStory';

/** Per-product callouts for the scroll-story section on the product page. */
export const productStories: Record<string, Callout[]> = {
    'tweeter-jnb-3': [
        { x: 50, y: 42, title: 'Cúpula de alta definición', text: 'Reproduce agudos cristalinos sin distorsión, incluso a volumen alto.', side: 'right' },
        { x: 24, y: 26, title: 'Marco en aluminio', text: 'Mecanizado con precisión: disipa el calor y protege la bobina.', side: 'left' },
        { x: 50, y: 66, title: 'Garantía JNB', text: 'Cada unidad pasa control de calidad antes de salir de fábrica.', side: 'right' },
    ],
    'tweeter-jnb-caja-sonido': [
        { x: 50, y: 40, title: 'Cúpula reforzada', text: 'Diseñada para instalación angular en caja de sonido personalizada.', side: 'right' },
        { x: 26, y: 55, title: 'Montaje angular', text: 'Se adapta a instalaciones donde el espacio recto no alcanza.', side: 'left' },
        { x: 55, y: 78, title: 'Terminales plug & play', text: 'Compatible con la mayoría de crossovers del mercado.', side: 'right' },
    ],
    'tercer-stop-led-fortuner': [
        { x: 45, y: 45, title: 'Barra LED secuencial', text: 'Encendido progresivo estilo OEM: mayor visibilidad al frenar.', side: 'right' },
        { x: 25, y: 30, title: 'Diseño estilo OEM', text: 'Se ve como una pieza de fábrica, no como un accesorio agregado.', side: 'left' },
        { x: 68, y: 58, title: 'Instalación plug & play', text: 'Sin modificar el cableado original del vehículo.', side: 'right' },
    ],
    'timon-corolla-cross-gr': [
        { x: 50, y: 46, title: 'Airbag original', text: 'Componente de seguridad 100% original de fábrica.', side: 'right' },
        { x: 22, y: 42, title: 'Paletas de cambio', text: 'Cambios secuenciales sin soltar el volante.', side: 'left' },
        { x: 50, y: 74, title: 'Insignia GR', text: 'Línea deportiva Gazoo Racing de Toyota.', side: 'right' },
    ],
    'timon-lexus-carbono': [
        { x: 50, y: 16, title: 'Fibra de carbono real', text: 'Textura tejida auténtica, no vinilo ni calcomanía.', side: 'right' },
        { x: 50, y: 46, title: 'Controles multifunción', text: 'Música, llamadas y crucero sin soltar el volante.', side: 'left' },
        { x: 50, y: 76, title: 'Línea F Sport', text: 'Acabado deportivo de la línea de alto rendimiento Lexus.', side: 'right' },
    ],
    'timon-palo-rosa-toyota': [
        { x: 26, y: 18, title: 'Acabado en palo rosa', text: 'Combina la calidez de la madera con la practicidad del cuero.', side: 'left' },
        { x: 50, y: 47, title: 'Controles integrados', text: 'Multimedia y velocidad crucero al alcance de tus dedos.', side: 'right' },
        { x: 24, y: 76, title: 'Cuero premium', text: 'Costura reforzada para un agarre firme y duradero.', side: 'left' },
    ],
    'camara-reversa-hd': [
        { x: 68, y: 38, title: '8 LED de alta luminosidad', text: 'Visión nocturna nítida incluso en parqueaderos sin luz.', side: 'right' },
        { x: 30, y: 55, title: 'Lente gran angular', text: 'Cubre todo el área trasera, sin puntos ciegos.', side: 'left' },
        { x: 55, y: 75, title: 'Carcasa sellada', text: 'Metálica y resistente al agua — hecha para el día a día.', side: 'right' },
    ],
    'radio-9-2din': [
        { x: 30, y: 30, title: 'Pantalla de 9" con guía de estacionamiento', text: 'Líneas de referencia en vivo para calcular la distancia al reversar.', side: 'left' },
        { x: 72, y: 55, title: 'Cámara de reversa incluida', text: 'Se conecta directo al radio — no tienes que comprarla aparte.', side: 'right' },
        { x: 45, y: 78, title: 'Aviso de seguridad en pantalla', text: '"Revisa el entorno" — un recordatorio visual cada vez que reversas.', side: 'left' },
    ],
    'carplay-inalambrico-2en1': [
        { x: 78, y: 30, title: 'Plug & Play', text: 'Se conecta una sola vez al puerto USB original de tu radio.', side: 'right' },
        { x: 25, y: 45, title: 'CarPlay + Android Auto', text: 'Un solo adaptador para los dos sistemas, sin cambiar de accesorio.', side: 'left' },
        { x: 70, y: 68, title: 'WiFi estable', text: 'Conexión rápida y sin cortes, con actualizaciones OTA.', side: 'right' },
    ],
    'subwoofer-jnb-caja': [
        { x: 35, y: 45, title: 'Woofer + tweeter integrados', text: 'Graves profundos y agudos definidos en un solo panel frontal.', side: 'left' },
        { x: 72, y: 25, title: 'Caja sellada reforzada', text: 'Enchapado texturizado resistente a golpes y vibración del baúl.', side: 'right' },
        { x: 75, y: 80, title: 'Kit de cableado incluido', text: 'Poder, tierra, RCA y fusible listos para conectar al amplificador.', side: 'right' },
    ],
    'led-toyota-parrilla': [
        { x: 45, y: 35, title: 'Letras TOYOTA iluminadas', text: 'Encienden junto con las luces de posición del vehículo.', side: 'right' },
        { x: 80, y: 32, title: 'A juego con tus faros LED', text: 'Se integra con el resto de la iluminación frontal.', side: 'left' },
        { x: 45, y: 60, title: 'Instalación directa', text: 'Reemplaza el emblema original, sin cortes ni empalmes.', side: 'right' },
    ],
    'amplificador-jnb-sl2000': [
        { x: 45, y: 20, title: 'Chasís con disipador', text: 'Aluminio con disipación de calor para uso prolongado.', side: 'right' },
        { x: 88, y: 48, title: 'Terminales chapados en oro', text: 'Conexión estable, sin pérdida de señal.', side: 'left' },
        { x: 45, y: 75, title: '4 canales de potencia', text: 'Compatible con parlantes, tweeters y subwoofers.', side: 'right' },
    ],
};
