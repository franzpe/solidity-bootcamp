import { CreateSpellDto } from '../dto/create-spell.dto';

export const spells: CreateSpellDto[] = [
  {
    name: 'Normal Attack',
    description: 'Normal Attack',
    baseDamage: 1,
    requiredLevel: 1,
    imageUri:
      'https://wow.zamimg.com/images/wow/icons/large/trade_archaeology_silverdagger.jpg',
  },
  {
    name: 'Sinister Strike',
    description: 'Well worn chest',
    baseDamage: 2,
    requiredLevel: 1,
    imageUri:
      'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_ritualofsacrifice.jpg',
  },
  {
    name: 'Kick',
    description: 'Kick',
    baseDamage: 2,
    requiredLevel: 1,
    imageUri: 'https://wow.zamimg.com/images/wow/icons/medium/ability_kick.jpg',
  },
  {
    name: 'Evicserate',
    description: 'Evicserate',
    baseDamage: 4,
    requiredLevel: 1,
    imageUri:
      'https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_eviscerate.jpg',
  },
];
