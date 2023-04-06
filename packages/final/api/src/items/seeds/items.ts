import { CreateItemDto } from '../dto/create-item.dto';

export const items: CreateItemDto[] = [
  {
    // 1
    ipfsId: 1,
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
    ipfsId: 2,
    slot: 'chest',
    description: 'Well worn chest',
    level: 1,
    imgUri: '#',
  },
  {
    // 3
    ipfsId: 3,
    name: 'Gnarpline Leggins',
    slot: 'legs',
    description: 'Gnarpline Leggins',
    level: 1,
    imgUri: '#',
  },
  {
    // 4
    ipfsId: 4,
    name: 'Nightscape',
    slot: 'head',
    description: 'Headband',
    level: 1,
    imgUri: '#',
  },
];
