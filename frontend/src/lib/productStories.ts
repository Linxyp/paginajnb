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
    'radio-toyota-4runner-2017': [
        { x: 50, y: 18, title: 'Pantalla vertical Android', text: 'Estilo Tesla, alta definición táctil, integrada en el marco original.', side: 'right' },
        { x: 62, y: 27, title: 'Bluetooth y llamadas', text: 'Contesta llamadas y reproduce música sin usar el celular.', side: 'left' },
        { x: 38, y: 34, title: 'Apple CarPlay / Android Auto', text: 'Conecta tu iPhone o Android de forma inalámbrica, sin cables.', side: 'right' },
        { x: 65, y: 45, title: 'GPS integrado', text: 'Navegación sin depender de datos móviles del celular.', side: 'left' },
        { x: 20, y: 20, title: 'Control climático táctil', text: 'Ajusta la temperatura del aire sin salir de la pantalla.', side: 'right' },
        { x: 50, y: 76, title: '4GB RAM / 64GB', text: 'Suficiente potencia para navegación, música y apps sin trabarse.', side: 'left' },
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
};
