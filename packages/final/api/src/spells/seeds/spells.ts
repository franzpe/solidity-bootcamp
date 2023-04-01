import { CreateSpellDto } from '../dto/create-spell.dto';

export const spells: CreateSpellDto[] = [
  {
    name: 'Normal Attack',
    description: 'Normal Attack',
    baseDamage: 1,
    requiredLevel: 1,
  },
  {
    name: 'Sinister Strike',
    description: 'Well worn chest',
    baseDamage: 2,
    requiredLevel: 1,
  },
  {
    name: 'Gouge',
    description: 'Gouge',
    baseDamage: 2,
    requiredLevel: 1,
  },
  {
    name: 'Evicserate',
    description: 'Evicserate',
    baseDamage: 4,
    requiredLevel: 1,
  },
];
