import { BeltData } from './types';

export const WHITE_BELT_DATA: BeltData = {
    id: 'white',
    title: 'Cinturón Blanco',
    concept: 'Supervivencia',
    description: 'El objetivo del cinturón blanco es la supervivencia. Debes aprender a sobrevivir antes de poder aprender a ganar.',
    chapters: [
        {
            id: '1',
            title: '1.0 La Espalda (Supervivencia)',
            techniques: [
                {
                    id: '1-0',
                    title: '1-0 La Posición de Supervivencia de Espalda',
                    videoId: 'UtkxKvdxiNY',
                    steps: [
                        { id: '1-0-1', text: 'Cubre el interior de la solapa de tu gi con una mano.' },
                        { id: '1-0-2', text: 'Cruza tu mano libre sobre la primera para proteger el otro lado del ataque.' },
                        { id: '1-0-3', text: 'Mantén las manos relajadas y cerca del cuerpo para bloquear estrangulamientos y llaves de brazo.' },
                        { id: '1-0-4', text: 'Si el oponente ataca, simplemente encuentra su ataque sin perseguirlo.' },
                        { id: '1-0-5', text: 'Siempre regresa a esta postura si algo sale mal en tu plan.' }
                    ],
                    misconceptions: [
                        'Perseguir el ataque: Aleja tus codos del cuerpo, exponiéndolos a ataques y control.'
                    ]
                },
                {
                    id: '1-1',
                    title: '1-1 Lucha de Manos',
                    videoId: '1-1 Lucha de Manos.mp4',
                    steps: [
                        { id: '1-1-1', text: 'Mantén las manos relajadas para bloquear la entrada cerrada al estrangulamiento.' },
                        { id: '1-1-2', text: 'Si ataca con el brazo derecho, sube ligeramente tu brazo interior para bloquearlo.' },
                        { id: '1-1-3', text: 'Si ataca con el izquierdo, tu mano exterior lo bloquea sin estirarse.' },
                        { id: '1-1-4', text: 'Solo reúnete con el ataque del oponente, no te estires hacia él.' }
                    ],
                    misconceptions: [
                        'Estirar los brazos: Perseguir el ataque abre tus codos y te expone.'
                    ]
                },
                {
                    id: '1-2',
                    title: '1-2 La Cucharada (The Scoop)',
                    videoId: 'e9MJAdU7knI',
                    steps: [
                        { id: '1-2-1', text: 'Desde la Postura de Supervivencia, hunde tu peso hacia abajo y abre tu base.' },
                        { id: '1-2-2', text: 'Deslízate alejándote del cuerpo superior del oponente y tira de tu cuerpo hacia la colchoneta.' },
                        { id: '1-2-3', text: 'Mantén los codos ocultos para evitar que controle tu cuerpo inferior.' },
                        { id: '1-2-4', text: 'Mantén las piernas dobladas y lejos del cuerpo para evitar que te balancee.' },
                        { id: '1-2-5', text: 'Esta posición baja elimina sus ángulos de ataque y lo hace sentir desconectado.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '1-3',
                    title: '1-3 Conceptos Erróneos Comunes',
                    steps: [],
                    misconceptions: [
                        'Agarrar el Gancho: Quitar la mano del cuello para empujar el gancho expone el cuello al estrangulamiento.',
                        'Postura de Puente: Puentear hacia atrás permite al oponente controlar mejor tu pecho con su espalda.',
                        'Escape de Jalón de Brazo: Intentar lanzar al oponente agarrando su brazo depende de la fuerza y suele fallar contra oponentes inteligentes.',
                        'Postura de Lado Incorrecto: Ir hacia el lado equivocado mientras el oponente controla el cuello aumenta la palanca del estrangulamiento.',
                        'Defensa de Bloqueo de Oreja: Bloquear solo un lado del cuello deja el cuerpo abierto al control "over-and-under" y al estrangulamiento Ezequiel.',
                        'Defensa de Cuello Rígido: Aferrarse a las propias solapas te encadena a tu propio gi y limita tu reacción.'
                    ]
                }
            ]
        },
        {
            id: '2',
            title: '2.0 Cuatro Puntos (Supervivencia)',
            techniques: [
                {
                    id: '2-0',
                    title: '2-0 Sobreviviendo la Posición de Espalda en Cuatro Puntos',
                    imagePlaceholder: '/images/2-0 SURVIVING ALL-FOURS BACK POSITION.png',
                    steps: [
                        { id: '2-0-1', text: 'Conecta tus codos a tu cuerpo y defiende tu cuello.' },
                        { id: '2-0-2', text: 'Desde esta postura, cortas todas las opciones del oponente.' },
                        { id: '2-0-3', text: 'Usa la palanca adecuada para permanecer cómodo mientras escapas.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '2-1',
                    title: '2-1 Supervivencia en Cuatro Puntos en Solitario',
                    imagePlaceholder: '/images/2-1 SOLO ALL-FOYRS SURVIVAL.png',
                    steps: [
                        { id: '2-1-1', text: 'Bloquea completamente el interior de tu solapa derecha con la mano; la otra mano se mantiene alerta.' },
                        { id: '2-1-2', text: 'Inclínate hacia adelante e inserta ambos codos entre tus rodillas.' },
                        { id: '2-1-3', text: 'Toca la colchoneta con tu frente.' },
                        { id: '2-1-4', text: 'Mantén la cara hacia abajo hasta que te comprometas a una inversión.' }
                    ],
                    misconceptions: [
                        'Levantar la cara: Puede comprometer tu base o la protección del cuello.'
                    ]
                },
                {
                    id: '2-2',
                    title: '2-2 Drill de Supervivencia en Cuatro Puntos',
                    steps: [
                        { id: '2-2-1', text: 'Reacciona inmediatamente a la posición superior del oponente.' },
                        { id: '2-2-2', text: 'Lleva tu codo derecho hacia adentro y apóyalo en el interior de la pierna derecha del oponente.' },
                        { id: '2-2-3', text: 'Usa tu brazo izquierdo como soporte para crear espacio.' },
                        { id: '2-2-4', text: 'Desliza el codo izquierdo por la colchoneta hasta el interior de la pierna izquierda del oponente.' },
                        { id: '2-2-5', text: 'Abre tus manos para bloquear la solapa y apoya tu frente en la colchoneta.' }
                    ],
                    misconceptions: [
                        'Pensar demasiado: Si piensas, llegas tarde y usas fuerza.'
                    ]
                },
                {
                    id: '2-3',
                    title: '2-3 Detalle de Cuatro Puntos',
                    steps: [
                        { id: '2-3-1', text: 'Tus codos bloquean los intentos de underhook al estar pegados a tus muslos internos.' },
                        { id: '2-3-2', text: 'Tu peso colapsando sobre tus antebrazos impide que agarre por encima de tus codos.' },
                        { id: '2-3-3', text: 'Las manos bloqueando las solapas impiden el estrangulamiento por falta de espacio.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '2-4',
                    title: '2-4 Rodando a Supervivencia de Espalda',
                    steps: [
                        { id: '2-4-1', text: 'Levanta tu pierna izquierda y postéala lejos del cuerpo; lleva tu hombro derecho a la colchoneta.' },
                        { id: '2-4-2', text: 'Cambia la posición de tus manos del lado derecho al izquierdo.' },
                        { id: '2-4-3', text: 'Impúlsate con la pierna izquierda y empuja tu peso sobre la pierna derecha del oponente.' },
                        { id: '2-4-4', text: 'Tira de tu cuerpo hacia la izquierda en un movimiento de balanceo manteniendo codos cerrados.' },
                        { id: '2-4-5', text: 'Establece tu base y recupera la Postura de Supervivencia de Espalda.' }
                    ],
                    misconceptions: [
                        'Empujar hacia atrás: Intentar empujar hacia el oponente te mete en su juego en lugar de preparar tu postura.'
                    ]
                },
                {
                    id: '2-5',
                    title: '2-5 Conceptos Erróneos Comunes',
                    steps: [],
                    misconceptions: [
                        'Base Muy Abierta: Empujar hacia arriba abre el espacio para el control de "doble underhook".',
                        'Agarrar el Brazo: Intentar un lanzamiento de hombro (shoulder throw) abre los codos y regala el estrangulamiento.',
                        'Agarrar el Gancho: Quitar las manos del cuello para defender los ganchos deja el cuello libre para atacar.',
                        'Ser Aplanado: Tener los codos lejos de los muslos y la cabeza alta permite al oponente aplanarte y poner todo su peso sobre tu espalda baja.'
                    ]
                }
            ]
        },
        {
            id: '3',
            title: '3.0 La Montada (Supervivencia)',
            techniques: [
                {
                    id: '3-0',
                    title: '3-0 Sobreviviendo la Montada',
                    videoId: 'h9JU07gGGZE',
                    steps: [
                        { id: '3-0-1', text: 'Incorpora elementos clave: puenteo defensivo, postura de lado, bloqueo de caderas y aplanar la pierna inferior.' },
                        { id: '3-0-2', text: 'El objetivo es crear incomodidad y resultados predecibles para el oponente.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '3-1',
                    title: '3-1 Drill de Supervivencia de Montada en Solitario',
                    steps: [
                        { id: '3-1-1', text: 'Desde espalda plana, prepara manos defensivas y dobla rodillas.' },
                        { id: '3-1-2', text: 'Empuja levemente con pierna derecha para elevar caderas y aligerar pierna izquierda.' },
                        { id: '3-1-3', text: 'Fuga de cadera (shrimp) hacia la derecha para mirar hacia la izquierda.' },
                        { id: '3-1-4', text: 'Colapsa completamente tu lado izquierdo sobre la colchoneta.' },
                        { id: '3-1-5', text: 'Mantén manos listas y encoge el cuerpo (capullo).' }
                    ],
                    misconceptions: [
                        'Quedarse plano: Un cuerpo plano es un cuerpo inmóvil y vulnerable.'
                    ]
                },
                {
                    id: '3-2',
                    title: '3-2 Postura Temprana',
                    steps: [
                        { id: '3-2-1', text: 'Muévete a la postura defensiva inmediatamente cuando el oponente obtenga la montada.' },
                        { id: '3-2-2', text: 'Ponte de lado y usa antebrazos para bloquear la cadera del oponente.' },
                        { id: '3-2-3', text: 'Mano derecha presiona su cadera con antebrazo como bloqueo; mano izquierda refuerza.' },
                        { id: '3-2-4', text: 'Codo izquierdo pegado al cuerpo y frente a la rodilla del oponente.' },
                        { id: '3-2-5', text: 'Mantén la pierna inferior plana sobre la colchoneta.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '3-3',
                    title: '3-3 Nulificando el Estrangulamiento',
                    steps: [
                        { id: '3-3-1', text: 'Permite una mano en el cuello, pero nunca dos.' },
                        { id: '3-3-2', text: 'Sigue la "Regla de Estrangulamiento": Gira para mirar el codo que ataca.' },
                        { id: '3-3-3', text: 'Esto abre el estrangulamiento y alivia la presión.' },
                        { id: '3-3-4', text: 'Tu postura esconde el cuello inferior, haciendo imposible forzar la posición.' }
                    ],
                    misconceptions: [
                        'Girar al lado equivocado: Girar en contra del codo atacante lleva a un estrangulamiento rápido.'
                    ]
                },
                {
                    id: '3-4',
                    title: '3-4 Error en Supervivencia de Estrangulamiento',
                    steps: [],
                    misconceptions: [
                        'Rodar alejándose: Rodar lejos del codo atacante por pánico hace que te estrangules a ti mismo.'
                    ]
                },
                {
                    id: '3-5',
                    title: '3-5 Supervivencia de Montada Sentada',
                    steps: [
                        { id: '3-5-1', text: 'Si el oponente transiciona a Montada Sentada (S-Mount), mantén tu postura de lado.' },
                        { id: '3-5-2', text: 'Continúa bloqueando su cadera y rodilla con tu codo y antebrazo.' },
                        { id: '3-5-3', text: 'Lleva tu mano inferior hacia tu cabeza para proteger el cuello.' },
                        { id: '3-5-4', text: 'Usa tu codo superior para bloquear intentos de palanca de brazo.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '3-6',
                    title: '3-6 Conceptos Erróneos Comunes',
                    steps: [],
                    misconceptions: [
                        'Empuje de Brazos Rectos: Empujar con brazos estirados regala palancas de brazo y permite montadas altas.',
                        'Abrazo de Doble Underhook: Abrazar expone brazos a llaves y permite presión sobre el diafragma.',
                        'Empujar las Rodillas: Empujar rodillas con las manos deja el cuello expuesto para estrangulamientos.',
                        'Agarre Doble de Solapa Propia: Aferrarse a las propias solapas te inmoviliza y es una táctica pasiva.'
                    ]
                }
            ]
        },
        {
            id: '4',
            title: '4.0 Control Lateral (Supervivencia)',
            techniques: [
                {
                    id: '4-0',
                    title: '4-0 Supervivencia de Control Lateral',
                    videoId: 'murmN5spY4s',
                    steps: [
                        { id: '4-0-1', text: 'Aprende el posicionamiento defensivo específico de manos y cuerpo para cada variación.' },
                        { id: '4-0-2', text: 'Entiende qué necesita el oponente para controlarte.' },
                        { id: '4-0-3', text: 'Practica la defensa contra un tipo de agarre a la vez.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '4-1',
                    title: '4-1 Bloqueando el Cross-Face',
                    steps: [
                        { id: '4-1-1', text: 'Mantén el brazo exterior escondido y pegado al cuerpo.' },
                        { id: '4-1-2', text: 'Tu mano interior bloquea la mano del oponente para evitar que atrape tu cabeza (Cross-Face).' },
                        { id: '4-1-3', text: 'La mano de bloqueo funciona como un gancho que envuelve su bíceps.' }
                    ],
                    misconceptions: [
                        'Permitir el Cross-Face: Si te hacen Cross-Face, pierdes el control de la dirección de la pelea.'
                    ]
                },
                {
                    id: '4-2',
                    title: '4-2 Soltando la Mano',
                    steps: [
                        { id: '4-2-1', text: 'Cuando el brazo del oponente pasa tu frente, deja de seguirlo.' },
                        { id: '4-2-2', text: 'Coloca tu mano derecha en su cadera en posición de copa.' },
                        { id: '4-2-3', text: 'Tu mano derecha actúa como soporte en "L" para mantener el peso fuera.' },
                        { id: '4-2-4', text: 'Si vuelve a intentar el Cross-Face, regresa la mano a su bíceps.' }
                    ],
                    misconceptions: [
                        'Seguir el brazo: Seguir el brazo lleva a que crucen tu brazo sobre tu cara o a una palanca de brazo.'
                    ]
                },
                {
                    id: '4-3',
                    title: '4-3 Lucha de Manos en Kesa Gatame',
                    steps: [
                        { id: '4-3-1', text: 'Usa el impulso del oponente para llevar tu codo derecho a su cadera derecha.' },
                        { id: '4-3-2', text: 'Mantén la mano abierta para bloquear estrangulaciones.' },
                        { id: '4-3-3', text: 'Mantén el brazo exterior pegado al cuerpo.' },
                        { id: '4-3-4', text: 'Desarrolla trucos de lucha de manos para esconder el brazo interior.' }
                    ],
                    misconceptions: [
                        'Empujar el bíceps: Empujar el bíceps abre tu codo y permite al oponente dominar tu lado derecho.'
                    ]
                },
                {
                    id: '4-4',
                    title: '4-4 Kesa Gatame Invertido',
                    steps: [
                        { id: '4-4-1', text: 'Cuando el oponente cruza la mano, quita el bloqueo de Cross-Face.' },
                        { id: '4-4-2', text: 'Entierra tu codo derecho en su costado.' },
                        { id: '4-4-3', text: 'Bloquea sus caderas con tu antebrazo derecho.' },
                        { id: '4-4-4', text: 'Lleva el codo derecho al suelo para evitar que aísle tu brazo.' },
                        { id: '4-4-5', text: 'Mantén la mano izquierda pegada y debajo del oponente.' }
                    ],
                    misconceptions: [
                        'Permitir aislamiento del brazo: Si separa tu codo del torso, tiene tu cuerpo atrapado.'
                    ]
                },
                {
                    id: '4-5',
                    title: '4-5 Conceptos Erróneos Comunes',
                    steps: [],
                    misconceptions: [
                        'Cross-Face Como Posición de Espera: Permitir el Cross-Face elimina una dirección de escape y expone a sumisiones.',
                        'Agarre Sobre el Hombro (Interior): Intentar lanzar al oponente suele resultar en una palanca de brazo.',
                        'Agarre Sobre el Hombro (Exterior): Enfocarse en el hombro en lugar de la cabeza (palanca real) es peligroso y deja el brazo libre.',
                        'Abrazo por Fuera (Manos Unidas): Abrazar la espalda expone todo tu lado a ataques y estrangulamientos.',
                        'Underhook Exterior: Buscar un underhook sin bloquear el Cross-Face expone a Kimura o palanca de brazo.'
                    ]
                }
            ]
        },
        {
            id: '5',
            title: '5.0 Rodilla al Pecho (Supervivencia)',
            techniques: [
                {
                    id: '5-0',
                    title: '5-0 Supervivencia de Rodilla al Pecho',
                    videoId: 'tTxqrnNex6M',
                    steps: [
                        { id: '5-0-1', text: 'Usa movimiento y defensa cerrada para contrarrestar el peso y gravedad.' },
                        { id: '5-0-2', text: 'Disrumpe la capacidad del oponente de asentar su peso sobre ti.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '5-1',
                    title: '5-1 Prevención de Rodilla al Pecho en Solitario',
                    steps: [
                        { id: '5-1-1', text: 'Desarrolla la mentalidad correcta: confianza basada en preparación.' },
                        { id: '5-1-2', text: 'La postura debe ser dinámica, no rígida y adaptarse al oponente.' },
                        { id: '5-1-3', text: 'Practica levantamientos de piernas y estiramientos para resistencia.' }
                    ],
                    misconceptions: [
                        'Rigidez: Usar fuerza y rigidez en lugar de adaptación.'
                    ]
                },
                {
                    id: '5-2',
                    title: '5-2 Prevención con Pierna Recta',
                    steps: [
                        { id: '5-2-1', text: 'Desde Supervivencia de Control Lateral, siente la intención del oponente.' },
                        { id: '5-2-2', text: 'Patea tu pierna derecha recta hacia arriba y clava tu rodilla en su cadera.' },
                        { id: '5-2-3', text: 'Tu rodilla bloquea al oponente al colarse entre su cadera y muslo.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '5-3',
                    title: '5-3 Importancia de la Prevención',
                    steps: [],
                    misconceptions: [
                        'Solo cruzar piernas: Cruzar la pierna interna sobre la externa no es suficiente sin el control de Cross-Face y la defensa de pierna recta.'
                    ]
                },
                {
                    id: '5-4',
                    title: '5-4 Postura de Supervivencia Corriendo',
                    steps: [
                        { id: '5-4-1', text: 'Rueda alejándote del oponente (hacia tu izquierda).' },
                        { id: '5-4-2', text: 'Bloquea su rodilla pasando tu codo superior por encima y luego por debajo.' },
                        { id: '5-4-3', text: 'Ponte de lado, levanta tu pierna superior y pásala sobre la inferior (tijera).' },
                        { id: '5-4-4', text: 'Sella el espacio entre tu cuádriceps superior y tu antebrazo superior.' }
                    ],
                    misconceptions: [
                        'Codo Abierto: Dejar el codo abierto permite al oponente retomar control.'
                    ]
                },
                {
                    id: '5-5',
                    title: '5-5 Rollo Expuesto',
                    steps: [
                        { id: '5-5-1', text: 'Sella el antebrazo con el cuádriceps.' },
                        { id: '5-5-2', text: 'Protege tu cuello.' },
                        { id: '5-5-3', text: 'Usa la pierna superior como barrera.' }
                    ],
                    misconceptions: [
                        'Codo abierto y cuello expuesto: Permite control "over-and-under".',
                        'Dejar la pierna atrás: Permite al oponente tomar la espalda.'
                    ]
                },
                {
                    id: '5-6',
                    title: '5-6 Conceptos Erróneos Comunes',
                    steps: [],
                    misconceptions: [
                        'Brazos Rígidos (Stiff Arms): Empujar con brazos rígidos te "encadena" al oponente y expone a sumisiones.',
                        'Empujar la Rodilla Abierta: Empujar la rodilla abre el codo, regalando una palanca de brazo o Kimura.',
                        'Empujar y Agarrar Cerca: Intentar agarrar la pierna y empujar abre el cuerpo y expone los codos a triángulos y llaves.'
                    ]
                }
            ]
        }
    ]
};
