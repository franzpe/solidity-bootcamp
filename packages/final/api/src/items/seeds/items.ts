import { CreateItemDto } from '../dto/create-item.dto';

export const items: CreateItemDto[] = [
  {
    // 1
    name: "Poorman's knife",
    damage: 2,
    slot: 'weapon',
    description: 'Super basic knife',
    level: 1,
    imgUri: '#',
  },
  {
    // 2
    name: 'Layered Tunic',
    slot: 'chest',
    description: 'Well worn chest',
    level: 1,
    imgUri: '#',
  },
  {
    // 3
    name: 'Gnarpline Leggins',
    slot: 'legs',
    description: 'Gnarpline Leggins',
    level: 1,
    imgUri: '#',
  },
  {
    // 4
    name: 'Nightscape Headband',
    slot: 'head',
    description: 'Headband',
    level: 1,
    imgUri: '#',
  },
];
