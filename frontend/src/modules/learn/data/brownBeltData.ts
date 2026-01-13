import { BeltData } from './types';

export const BROWN_BELT_DATA: BeltData = {
    id: 'brown',
    title: 'Cinturón Marrón',
    concept: 'Pase de Guardia',
    description: 'En el cinturón marrón, refinas tu pase de guardia. Aprendes a imponer tu voluntad y a sortear las defensas más complejas.',
    chapters: [
        {
            id: '25',
            title: '25.0 Pasando la Guardia Cerrada',
            techniques: [
                {
                    id: '25-0',
                    title: '25-0 Bloqueando el Agarre de Solapa',
                    steps: [
                        { id: '25-0-1', text: 'Mantén una buena postura y base.' },
                        { id: '25-0-2', text: 'Coloca tus manos en los bíceps del oponente (cerca de las axilas) para controlar su capacidad de jalarte.' },
                        { id: '25-0-3', text: 'Si el oponente intenta alcanzar tu solapa, intercepta su mano antes de que establezca un agarre profundo.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-1',
                    title: '25-1 Derrotando el Agarre de Solapa Cruzada',
                    steps: [
                        { id: '25-1-1', text: 'Si el oponente consigue el agarre, atrapa su muñeca con tu mano opuesta.' },
                        { id: '25-1-2', text: 'Usa tu otra mano para empujar en la curva de su codo (o bíceps).' },
                        { id: '25-1-3', text: 'Postura hacia arriba y atrás fuertemente para romper el agarre (usando la espalda, no solo brazos).' },
                        { id: '25-1-4', text: 'Inmediatamente regresa tus manos a la posición de control (axilas/bíceps).' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-2',
                    title: '25-2 Escape de Guardia con Overhook',
                    steps: [
                        { id: '25-2-1', text: 'Si el oponente rompe tu postura y te abraza (overhook) el brazo.' },
                        { id: '25-2-2', text: 'Nada (swim) tu mano hacia adentro, pasando por su abdomen/pecho.' },
                        { id: '25-2-3', text: 'Postea esa mano en el bíceps contrario del oponente para recuperar el marco y la postura.' }
                    ],
                    misconceptions: [
                        'Quedarse abajo: Permitir que el oponente mantenga tu cabeza abajo te expone a estrangulaciones y omoplatas.'
                    ]
                },
                {
                    id: '25-3',
                    title: '25-3 Escapando del Agarre de Cinturón sobre el Hombro',
                    steps: [
                        { id: '25-3-1', text: 'El oponente rompe tu postura y agarra tu cinturón por encima de tu hombro.' },
                        { id: '25-3-2', text: 'Postea tu mano libre en la colchoneta para base.' },
                        { id: '25-3-3', text: 'Empuja con tu mano opuesta en la axila del oponente para crear espacio.' },
                        { id: '25-3-4', text: 'Saca la cabeza y recupera la postura erguida.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-4',
                    title: '25-4 Apertura Clásica de Rodillas',
                    steps: [
                        { id: '25-4-1', text: 'Controla ambas solapas (o axilas) con una mano en el centro del pecho/plexo.' },
                        { id: '25-4-2', text: 'La otra mano controla la cadera del oponente.' },
                        { id: '25-4-3', text: 'Coloca tu rodilla del mismo lado de la mano de la cadera en el centro de los glúteos del oponente (coxis).' },
                        { id: '25-4-4', text: 'Da un paso atrás con la otra pierna, estirándola lejos (como un trípode).' },
                        { id: '25-4-5', text: 'Arquea la espalda y empuja tus caderas hacia adelante para abrir sus piernas.' }
                    ],
                    misconceptions: [
                        'Codos Abiertos: Dejar los codos abiertos mientras empujas permite al oponente atacar con armbars o romper tu base.'
                    ]
                },
                {
                    id: '25-5',
                    title: '25-5 Bloqueando el Triángulo (Durante la Apertura)',
                    steps: [
                        { id: '25-5-1', text: 'Al abrir la guardia, mantén tu codo trasero (el de la mano que controla la cadera) pegado a tu cuerpo.' },
                        { id: '25-5-2', text: 'Si el oponente lanza las piernas para el triángulo, tu codo cerrado y tu postura erguida bloquean la entrada.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-6',
                    title: '25-6 Bloqueo Fallido de Triángulo',
                    steps: [],
                    misconceptions: [
                        'Mirar hacia abajo/Codo fuera: Bajar la cabeza o sacar el codo permite al oponente cerrar las piernas sobre tu hombro.'
                    ]
                },
                {
                    id: '25-7',
                    title: '25-7 Abriendo cuando el Oponente Esconde Ambos Brazos',
                    steps: [
                        { id: '25-7-1', text: 'Si el oponente cruza los brazos y esconde las axilas.' },
                        { id: '25-7-2', text: 'Agarra los pliegues de su gi en los costados (cerca de las costillas).' },
                        { id: '25-7-3', text: 'Usa estos agarres para anclar tus codos cerrados y proceder con la apertura de rodilla al coxis.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-8',
                    title: '25-8 Apertura Básica de Single Underhook',
                    steps: [
                        { id: '25-8-1', text: 'Una vez abierta la guardia, inserta un brazo bajo la pierna del oponente (underhook).' },
                        { id: '25-8-2', text: 'Agarra la solapa opuesta del oponente con esa mano (alimentando el agarre).' },
                        { id: '25-8-3', text: 'Mantén el codo cerrado y presiona con el hombro.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-9',
                    title: '25-9 Pase Básico de Underhook (Sao Paulo Pass)',
                    steps: [
                        { id: '25-9-1', text: 'Con el underhook asegurado y la solapa agarrada.' },
                        { id: '25-9-2', text: 'Lanza tu pierna libre hacia atrás para bajar la cadera y aplastar la pierna del oponente.' },
                        { id: '25-9-3', text: 'Camina hacia el lado opuesto al underhook, pasando la guardia.' },
                        { id: '25-9-4', text: 'Mantén la presión de hombro constante en su muslo/cadera.' }
                    ],
                    misconceptions: [
                        'Levantar la cadera: Si levantas tu cadera al caminar, el oponente recuperará la guardia.'
                    ]
                },
                {
                    id: '25-10',
                    title: '25-10 Venciendo la Cadera Bloqueada',
                    steps: [
                        { id: '25-10-1', text: 'Si el oponente bloquea tu cadera con su mano.' },
                        { id: '25-10-2', text: 'Cambia la dirección de tus caderas (switch base) para romper su muñeca/agarre.' },
                        { id: '25-10-3', text: 'Continúa caminando hacia la cabeza para asegurar el control lateral.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-12',
                    title: '25-12 Pase de Doble Underhook',
                    steps: [
                        { id: '25-12-1', text: 'Inserta ambos brazos bajo las piernas del oponente y junta tus manos (Gable Grip) sobre sus muslos/caderas.' },
                        { id: '25-12-2', text: 'Tira de sus caderas hacia tu regazo para "apilarlo".' },
                        { id: '25-12-3', text: 'Levanta sus caderas del suelo.' },
                        { id: '25-12-4', text: 'Elige un lado, conduce la rodilla opuesta debajo de sus caderas y pasa al control lateral.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-14',
                    title: '25-14 Base de Combate a Pase Básico',
                    steps: [
                        { id: '25-14-1', text: 'Si el oponente es agresivo, levanta una rodilla (Combat Base).' },
                        { id: '25-14-2', text: 'Esto protege contra raspados y mantiene movilidad.' },
                        { id: '25-14-3', text: 'Desde aquí, puedes trabajar para abrir la guardia empujando la rodilla hacia adelante o parándote.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-15',
                    title: '25-15 Calentamiento de Base (Pasando de Pie)',
                    steps: [
                        { id: '25-15-1', text: 'Practica levantarte desde las rodillas a una postura de pie sólida (base ancha, rodillas flexionadas, espalda recta).' },
                        { id: '25-15-2', text: 'Mantén la cabeza sobre las caderas.' }
                    ],
                    misconceptions: [
                        'Inclinarse adelante: Poner la cabeza delante de las rodillas facilita que te jalen y rompan la postura.'
                    ]
                },
                {
                    id: '25-16',
                    title: '25-16 Pararse Correctamente vs. Incorrectamente',
                    steps: [
                        { id: '25-16-1', text: 'Controla al menos una mano del oponente antes de pararte.' },
                        { id: '25-16-2', text: 'Salta o da pasos rápidos para ponerte de pie ("pop up").' },
                        { id: '25-16-3', text: 'Mantén postura erguida.' }
                    ],
                    misconceptions: [
                        'Mirar al suelo: Te hace perder el equilibrio.',
                        'No controlar manos: Permite al oponente agarrar tus tobillos para el "Tripod Sweep" o "Muscle Sweep".'
                    ]
                },
                {
                    id: '25-17',
                    title: '25-17 Apertura de Pie con Presión de Cadera',
                    steps: [
                        { id: '25-17-1', text: 'Párate controlando una manga y la solapa (o ambas mangas).' },
                        { id: '25-17-2', text: 'Empuja hacia abajo en la rodilla del oponente con tu mano libre mientras empujas tus caderas hacia adelante y arqueas la espalda.' },
                        { id: '25-17-3', text: 'La presión combinada rompe el cruce de pies.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-18',
                    title: '25-18 Apertura Defensiva (Sentadilla)',
                    steps: [
                        { id: '25-18-1', text: 'Si sientes que vas a perder el equilibrio, haz una sentadilla (baja el centro de gravedad).' },
                        { id: '25-18-2', text: 'Coloca tus codos por dentro de tus rodillas.' },
                        { id: '25-18-3', text: 'Usa los codos para abrir las piernas del oponente mientras mantienes base sólida.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-20',
                    title: '25-20 Abriendo Contra Piernas Largas',
                    steps: [
                        { id: '25-20-1', text: 'Si no puedes alcanzar la rodilla para empujar.' },
                        { id: '25-20-2', text: 'Lleva una mano atrás y agarra el pantalón del oponente (por la rodilla).' },
                        { id: '25-20-3', text: 'Levanta esa pierna mientras presionas con la otra mano en la cadera/muslo contrario.' },
                        { id: '25-20-4', text: 'Sacude para abrir.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '25-21',
                    title: '25-21 Apertura de Agarre de Axila y Derrotando el Puente',
                    steps: [
                        { id: '25-21-1', text: 'Agarra ambas axilas del gi (material extra).' },
                        { id: '25-21-2', text: 'Párate y levanta al oponente de la colchoneta.' },
                        { id: '25-21-3', text: 'Si intenta puentear (bridge) apoyándose en tus hombros, simplemente da un paso atrás y déjalo caer; el impacto suele abrir la guardia.' }
                    ],
                    misconceptions: []
                }
            ]
        },
        {
            id: '26',
            title: '26.0 Pases de Guardia Abierta (Core Passes)',
            techniques: [
                {
                    id: '26-1',
                    title: '26-1 Cuerda de Pierna (Leg Rope) - Frente',
                    steps: [
                        { id: '26-1-1', text: 'Agarra los pantalones del oponente por dentro de las rodillas (como una cuerda).' },
                        { id: '26-1-2', text: 'Mantén los codos pegados a tu cuerpo.' },
                        { id: '26-1-3', text: 'Usa el agarre para dirigir sus piernas ("manejar el autobús").' }
                    ],
                    misconceptions: []
                },
                {
                    id: '26-3',
                    title: '26-3 Cuerda de Pierna - Cambio de Lado y Aplastamiento',
                    steps: [
                        { id: '26-3-1', text: 'Usa el agarre de pantalones para empujar las piernas del oponente a un lado.' },
                        { id: '26-3-2', text: 'Cuando él reacciona empujando de vuelta, usa su impulso para tirar sus piernas al lado contrario.' },
                        { id: '26-3-3', text: 'Cae con tu pecho sobre sus caderas ("Smash") para pasar.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '26-4',
                    title: '26-4 Pase Cruzado de Rodilla (Knee Cross / Knee Slice)',
                    steps: [
                        { id: '26-4-1', text: 'Controla la pierna del oponente y entra tu rodilla derecha a través de su muslo derecho.' },
                        { id: '26-4-2', text: 'Tu tibia cruza diagonalmente su muslo.' },
                        { id: '26-4-3', text: 'Consigue un underhook con tu brazo izquierdo y controla su cabeza o solapa con el derecho.' },
                        { id: '26-4-4', text: 'Desliza tu rodilla hacia el suelo mientras jalas su brazo (underhook) hacia arriba.' },
                        { id: '26-4-5', text: 'Patea tu pierna trasera libre y estabiliza el control lateral.' }
                    ],
                    misconceptions: [
                        'Sin Underhook: Intentar el pase sin el underhook permite al oponente tomar tu espalda.'
                    ]
                },
                {
                    id: '26-5',
                    title: '26-5 Knee Cross contra Agarre de Solapa',
                    steps: [
                        { id: '26-5-1', text: 'Si el oponente tiene tu solapa (impidiendo postura), usa tu mano libre para empujar su mano/muñeca.' },
                        { id: '26-5-2', text: 'O rompe el agarre antes de deslizar la rodilla.' },
                        { id: '26-5-3', text: 'Mantén la presión de la rodilla constante para que no recupere guardia.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '26-6',
                    title: '26-6 Cambio de Ángulo a Pase de Rodilla',
                    steps: [
                        { id: '26-6-1', text: 'Si el oponente bloquea el pase directo.' },
                        { id: '26-6-2', text: 'Cambia la dirección de tus caderas (gira hacia el otro lado).' },
                        { id: '26-6-3', text: 'Esto confunde la defensa y abre el camino para volver a cortar la rodilla o ir a la espalda.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '26-7',
                    title: '26-7 Torreando y Aproximación',
                    steps: [
                        { id: '26-7-1', text: 'Controla ambos pantalones del oponente (interior de rodillas o espinillas).' },
                        { id: '26-7-2', text: 'Brazos rígidos (stiff arms) pero hombros relajados.' },
                        { id: '26-7-3', text: 'Empuja una pierna hacia su pecho y tira de la otra hacia ti mientras caminas lateralmente.' },
                        { id: '26-7-4', text: 'Cierra el espacio con tu pecho sobre el suyo (hombro a hombro).' }
                    ],
                    misconceptions: []
                },
                {
                    id: '26-9',
                    title: '26-9 Drill de Torreando con Control de Cadera',
                    steps: [
                        { id: '26-9-1', text: 'Lanza las piernas del oponente a un lado.' },
                        { id: '26-9-2', text: 'Pon tu mano en su cadera para frenar su movimiento de escape.' },
                        { id: '26-9-3', text: 'Camina alrededor para consolidar la posición.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '26-11',
                    title: '26-11 Pase de Pierna Dos-contra-Uno',
                    steps: [
                        { id: '26-11-1', text: 'Agarra una pierna del oponente con ambas manos.' },
                        { id: '26-11-2', text: 'Tira de ella a través de tu cuerpo y empújala hacia el suelo al lado opuesto.' },
                        { id: '26-11-3', text: 'Pon tu peso sobre esa pierna (aplastándola) y pasa al lado de la espalda expuesta.' }
                    ],
                    misconceptions: []
                }
            ]
        },
        {
            id: '27',
            title: '27.0 Pases de Guardia Mariposa',
            techniques: [
                {
                    id: '27-1',
                    title: '27-1 Postura y Equilibrio',
                    steps: [
                        { id: '27-1-1', text: 'Drill de Ganchos Tardíos: Deja que el oponente te levante. Postea ambas manos. Patea talones a glúteos y empuja caderas hacia abajo.' },
                        { id: '27-1-2', text: 'Drill de Manta Mojada: Gira rodillas hacia afuera y aplasta caderas contra la colchoneta (sprawl).' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-2',
                    title: '27-2 Pase Caminando Alrededor de Mariposa Plana',
                    steps: [
                        { id: '27-2-1', text: 'Aplana al oponente. Estira pierna derecha y cambia peso a cadera derecha para aplastar su gancho izquierdo.' },
                        { id: '27-2-2', text: 'Agarra su tobillo derecho con mano izquierda.' },
                        { id: '27-2-3', text: 'Levanta caderas y camina hacia la derecha sobre su rodilla para pasar.' }
                    ],
                    misconceptions: [
                        'Falta de presión: Si el oponente está plano, no tiene palanca para barrer, pero debes mantener tu peso sobre él.'
                    ]
                },
                {
                    id: '27-3',
                    title: '27-3 Variación Wallid Ismael',
                    steps: [
                        { id: '27-3-1', text: 'Patea pierna derecha atrás para liberar el gancho.' },
                        { id: '27-3-2', text: 'Desliza rodilla derecha junto a la izquierda y atrapa ambas piernas del oponente.' },
                        { id: '27-3-3', text: 'Cambia base a cadera derecha. Pasa pierna izquierda sobre la rodilla del oponente y libera la derecha.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-4',
                    title: '27-4 Pase Envolviendo las Piernas (Wrap-the-Legs)',
                    steps: [
                        { id: '27-4-1', text: 'Abraza ambas piernas del oponente juntas, bloqueándolas a la altura de las rodillas.' },
                        { id: '27-4-2', text: 'Alimenta el pantalón de su pierna izquierda a tu mano izquierda.' },
                        { id: '27-4-3', text: 'Usa tu hombro derecho para empujar sus piernas hacia tu izquierda.' },
                        { id: '27-4-4', text: 'Cambia tu base a la cadera derecha mientras tiras de sus piernas hacia el lado contrario.' }
                    ],
                    misconceptions: [
                        'Solo usar brazos: Intentar pasar sin pinning (clavar) las piernas con el hombro y el cuerpo permite que el oponente recupere la guardia.'
                    ]
                },
                {
                    id: '27-5',
                    title: '27-5 Pase de Mano Plantada (Hand Plant)',
                    steps: [
                        { id: '27-5-1', text: 'Circula tu mano izquierda sobre su brazo derecho y plántala en la colchoneta entre sus piernas.' },
                        { id: '27-5-2', text: 'Baja tus caderas y bloquea su cadera izquierda con tu mano derecha.' },
                        { id: '27-5-3', text: 'Sprawlea, empuja su pierna izquierda y cae en control lateral.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-6',
                    title: '27-6 Pase de Cambio de Nivel',
                    steps: [
                        { id: '27-6-1', text: 'Baja tus caderas (grounding). Mano izquierda a su rodilla derecha, derecha a hombro.' },
                        { id: '27-6-2', text: 'Salta a tus pies presionando su rodilla derecha.' },
                        { id: '27-6-3', text: 'Cruza pierna izquierda frente a la derecha para rodear su pierna izquierda.' },
                        { id: '27-6-4', text: 'Conduce con tu hombro izquierdo para aplanarlo.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-7',
                    title: '27-7 Pase de Presión de Rodilla Adelantada',
                    steps: [
                        { id: '27-7-1', text: 'Levanta tu rodilla derecha y bloquea la pierna izquierda del oponente.' },
                        { id: '27-7-2', text: 'Conduce tu rodilla derecha hacia su muslo izquierdo mientras empujas su rodilla al suelo con tu mano.' },
                        { id: '27-7-3', text: 'Aplasta sus piernas juntas y pasa.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-9',
                    title: '27-9 Pase de Cambio de Cadera Flotante',
                    steps: [
                        { id: '27-9-1', text: 'Cuando intenta barren hacia atrás, postea manos en sus hombros.' },
                        { id: '27-9-2', text: 'Sube rodilla izquierda. En el aire, cambia de cadera (rodilla izquierda adentro, pierna derecha arriba).' },
                        { id: '27-9-3', text: 'Cae en control lateral.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-11',
                    title: '27-11 El Pase Estrella (Star Pass)',
                    steps: [
                        { id: '27-11-1', text: 'Si te eleva con ganchos, postea frente y mano izquierda.' },
                        { id: '27-11-2', text: 'Extiende piernas arriba (parada de cabeza).' },
                        { id: '27-11-3', text: 'Saca pierna izquierda, empuja su rodilla derecha adentro y cae sobre su lado izquierdo.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-13',
                    title: '27-13 Pase de Volante de Pie (Stand-Up Wheel)',
                    steps: [
                        { id: '27-13-1', text: 'Agarra solapa y pantalón cruzado. Párate.' },
                        { id: '27-13-2', text: 'Tira abajo y levanta (volante) para girarlo.' },
                        { id: '27-13-3', text: 'Cae con hombro sobre su pecho.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '27-14',
                    title: '27-14 Pase en X (X Pass)',
                    steps: [
                        { id: '27-14-1', text: 'Paso a la derecha para bait defender. Junta pies.' },
                        { id: '27-14-2', text: 'Empuja su pierna derecha lejos cruzando brazos en X.' },
                        { id: '27-14-3', text: 'Cruza pie derecho frente a izquierdo (X step) y pasa.' }
                    ],
                    misconceptions: []
                }
            ]
        },
        {
            id: '28',
            title: '28.0 Pases de Guardia Araña',
            techniques: [
                {
                    id: '28-1',
                    title: '28-1 Romper y Pasar',
                    steps: [
                        { id: '28-1-1', text: 'Circula manos por fuera y bajo sus piernas.' },
                        { id: '28-1-2', text: 'Conduce rodilla derecha adelante (combat base) y apila sus piernas con antebrazos.' },
                        { id: '28-1-3', text: 'Empuja sus piernas a un lado y colapsa peso.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '28-2',
                    title: '28-2 Pase de Lazo de Pierna (Leg Lasso)',
                    steps: [
                        { id: '28-2-1', text: 'Levántate e inclina cuerpo a la izquierda.' },
                        { id: '28-2-2', text: 'Gira dándole la espalda. Balancea pierna derecha atrás.' },
                        { id: '28-2-3', text: 'Gira de regreso inmediatamente y pasa.' }
                    ],
                    misconceptions: []
                }
            ]
        },
        {
            id: '30',
            title: '30.0 Pases de De La Riva',
            techniques: [
                {
                    id: '30-1',
                    title: '30-1 Desbloquear y Pasar',
                    steps: [
                        { id: '30-1-1', text: 'Base de combate, antebrazos empujan ganchos abajo.' },
                        { id: '30-1-2', text: 'Desliza rodilla derecha sobre su rodilla izquierda. Abraza cuerpo.' },
                        { id: '30-1-3', text: 'Atrapa su pierna izquierda con gancho derecho. Cross-face y pasa.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '30-2',
                    title: '30-2 Pase de Escape de Gancho (Hook Pop)',
                    steps: [
                        { id: '30-2-1', text: 'Pivota talón derecho adentro y rodilla afuera 90 grados para soltar gancho.' },
                        { id: '30-2-2', text: 'Deja caer espinilla derecha sobre su pierna izquierda.' },
                        { id: '30-2-3', text: 'Empuja su rodilla derecha lejos, cross-face y tijera para pasar.' }
                    ],
                    misconceptions: [
                        'Pelear contra el control: Si intentas moverte sin romper el gancho, te barrerán.'
                    ]
                }
            ]
        },
        {
            id: '31',
            title: '31.0 Pases de Guardia Sentada',
            techniques: [
                {
                    id: '31-1',
                    title: '31-1 Pase de Paso Alrededor (Step-Around)',
                    steps: [
                        { id: '31-1-1', text: 'Baja base. Mano derecha a hombro, izquierda a rodilla.' },
                        { id: '31-1-2', text: 'Tira y presiona. Circula pie derecho y luego izquierdo hacia su lado izquierdo.' },
                        { id: '31-1-3', text: 'Presiona para consolidar.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '31-2',
                    title: '31-2 Underhook a Montada',
                    steps: [
                        { id: '31-2-1', text: 'Cae a base de combate junto a su cadera derecha.' },
                        { id: '31-2-2', text: 'Gana underhook izquierdo. Conduce al oponente de espaldas (Media Montada).' },
                        { id: '31-2-3', text: 'Empuja su brazo derecho arriba y desliza a Montada.' }
                    ],
                    misconceptions: []
                }
            ]
        },
        {
            id: '32',
            title: '32.0 Pases de De La Riva Invertida',
            techniques: [
                {
                    id: '32-1',
                    title: '32-1 Aplastamiento de Cadera (Hip Smash)',
                    steps: [
                        { id: '32-1-1', text: 'Empuja rodilla de bloqueo al suelo y mueve cuerpo a la derecha.' },
                        { id: '32-1-2', text: 'Deja caer caderas sobre sus piernas.' },
                        { id: '32-1-3', text: 'Underhook con izquierda, sprawlea y tijera para pasar.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '32-2',
                    title: '32-2 Pase Flotante',
                    steps: [
                        { id: '32-2-1', text: 'Paso adelante con izquierda cerca de su cabeza.' },
                        { id: '32-2-2', text: 'Conduce caderas abajo asfixiando su pierna derecha.' },
                        { id: '32-2-3', text: 'Pasa pierna derecha sobre su cabeza y cae con peso en pecho.' },
                        { id: '32-2-4', text: 'Cambia cuerpo al lado derecho.' }
                    ],
                    misconceptions: [
                        'Dudar: Si dudas y mueves las caderas hacia atrás, el oponente te barrerá.'
                    ]
                }
            ]
        },
        {
            id: '33',
            title: '33.0 Pases de Guardia Invertida',
            techniques: [
                {
                    id: '33-1',
                    title: '33-1 Pase de Cadera',
                    steps: [
                        { id: '33-1-1', text: 'Asegura cadera con cinturón y pantalón.' },
                        { id: '33-1-2', text: 'Levanta y camina hacia el lado llevando sus caderas contigo.' },
                        { id: '33-1-3', text: 'Cuando sus piernas estén fuera, cae en control lateral.' }
                    ],
                    misconceptions: [
                        'Circular: Si intentas circular alrededor de un guardia invertido sin controlar su cadera, él simplemente girará contigo y te atrapará.'
                    ]
                }
            ]
        },
        {
            id: '34',
            title: '34.0 Pases de Guardia X',
            techniques: [
                {
                    id: '34-1',
                    title: '34-1 Romper con Bola de Equilibrio y Pasar',
                    steps: [
                        { id: '34-1-1', text: 'Cuadra caderas paralelas. Desliza caderas abajo y derecha para soltar gancho superior.' },
                        { id: '34-1-2', text: 'Levanta pierna izquierda sobre su cabeza y desliza al pase.' }
                    ],
                    misconceptions: [
                        'Agarrar el pantalón: Intentar quitar el gancho con la mano sin cambiar el ángulo de la cadera permite al oponente desequilibrarte.'
                    ]
                }
            ]
        },
        {
            id: '35',
            title: '35.0 Pases de Media Guardia',
            techniques: [
                {
                    id: '35-1',
                    title: '35-1 Aplanando al Oponente',
                    steps: [
                        { id: '35-1-1', text: 'Conduce rodilla izquierda hacia su cadera derecha.' },
                        { id: '35-1-2', text: 'Paso con pie derecho afuera.' },
                        { id: '35-1-3', text: 'Colapsa rodilla derecha adelante para aplanarlo.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '35-2',
                    title: '35-2 Pase de Pierna Recta con Bloqueo de Rodilla',
                    steps: [
                        { id: '35-2-1', text: 'Con oponente plano y cross-face.' },
                        { id: '35-2-2', text: 'Cambia base a cadera izquierda. Agarra su rodilla izquierda y jala arriba.' },
                        { id: '35-2-3', text: 'Patea pierna derecha adelante y luego atrás para liberar.' }
                    ],
                    misconceptions: [
                        'Pelea de fuerza: No jales sin posición. Usa el cambio de base y la patada.'
                    ]
                },
                {
                    id: '35-3',
                    title: '35-3 Pase de Cambio de Base con Espinilla',
                    steps: [
                        { id: '35-3-1', text: 'Estira caderas arriba. Desliza espinilla izquierda frente a su cadera (cuña).' },
                        { id: '35-3-2', text: 'Empuja con espinilla y mano en rodilla mientras tiras de tu pierna atrapada.' }
                    ],
                    misconceptions: []
                },
                {
                    id: '35-6',
                    title: '35-6 Pase de Deslizamiento de Espinilla (Shin Slide)',
                    steps: [
                        { id: '35-6-1', text: 'Cambia caderas izquierda. Desliza espinilla derecha diagonalmente sobre su muslo.' },
                        { id: '35-6-2', text: 'Empuja rodilla al suelo. Patea pierna izquierda para liberar pie.' }
                    ],
                    misconceptions: [
                        'Olvidar la cabeza: Si no atrapas la cabeza o haces underhook al deslizar, te tomarán la espalda.'
                    ]
                },
                {
                    id: '35-7',
                    title: '35-7 Pase de Esgrima (Underhook Pass)',
                    steps: [
                        { id: '35-7-1', text: 'Consigue underhook y solapa. Cabeza al suelo (trípode).' },
                        { id: '35-7-2', text: 'Camina pie derecho hacia su trasero. Usa pie izquierdo para empujar su rodilla y liberar pie derecho.' }
                    ],
                    misconceptions: [
                        'Rodilla en el medio: Si dejas la rodilla del oponente entre tus piernas, te repondrá la guardia.'
                    ]
                },
                {
                    id: '35-16',
                    title: '35-16 Escape de Pierna de Media Profunda',
                    steps: [
                        { id: '35-16-1', text: 'Postea mano lejos. Apunta dedos de pie atrapado al suelo (bailarina).' },
                        { id: '35-16-2', text: 'Jala pierna recta arriba. Paso atrás.' }
                    ],
                    misconceptions: [
                        'Pie flexionado: Si el pie está en flex (dedos arriba), se atorará.',
                        'Gatear: Intentar escapar gateando hacia adelante permite que te tomen la espalda.'
                    ]
                },
                {
                    id: '35-19',
                    title: '35-19 Pase Exprimido de Limón (Lemon Squeeze)',
                    steps: [
                        { id: '35-19-1', text: 'Sprawl caderas atrás. Junta manos bajo su trasero (Gable grip).' },
                        { id: '35-19-2', text: 'Camina piernas hacia el lado de la pierna atrapada.' },
                        { id: '35-19-3', text: 'Esto estira la media guardia hasta que se rompe.' }
                    ],
                    misconceptions: []
                }
            ]
        }
    ]
};
