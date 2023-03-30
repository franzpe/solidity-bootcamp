import { CreateItemDto } from '../dto/create-item.dto';

export const items: CreateItemDto[] = [
  {
    name: "Poorman's knife",
    damage: 2,
    slot: 'weapon',
    description: 'Super basic knife',
    level: 1,
    imgUri: '#',
  },
  {
    name: 'Layered Tunic',
    slot: 'chest',
    description: 'Well worn chest',
    level: 1,
    imgUri: '#',
  },
  {
    name: 'Gnarpline Leggins',
    slot: 'legs',
    description: 'Gnarpline Leggins',
    level: 1,
    imgUri: '#',
  },
  {
    name: 'Nightscape Headband',
    slot: 'head',
    description: 'Headband',
    level: 1,
    imgUri: '#',
  },
];
