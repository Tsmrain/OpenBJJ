export interface BeltLevel {
  id: string;
  name: string;
  focus: string;
  color: string; // Tailwind class safe string
  isLocked: boolean;
}

export const CURRICULUM: BeltLevel[] = [
  {
    id: 'white',
    name: 'Cinturón Blanco',
    focus: 'Supervivencia',
    color: 'bg-zinc-100',
    isLocked: false,
  },
  {
    id: 'blue',
    name: 'Cinturón Azul',
    focus: 'Escapes',
    color: 'bg-blue-600',
    isLocked: false,
  },
  {
    id: 'purple',
    name: 'Cinturón Morado',
    focus: 'Guardia',
    color: 'bg-purple-600',
    isLocked: false,
  },
  {
    id: 'brown',
    name: 'Cinturón Marrón',
    focus: 'Pases',
    color: 'bg-amber-800',
    isLocked: false,
  },
  {
    id: 'black',
    name: 'Cinturón Negro',
    focus: 'Sumisiones',
    color: 'bg-zinc-900 border border-zinc-700',
    isLocked: false,
  },
  {
    id: 'takedowns',
    name: 'Derribos',
    focus: 'De Pie',
    color: 'bg-emerald-700',
    isLocked: false,
  }
];