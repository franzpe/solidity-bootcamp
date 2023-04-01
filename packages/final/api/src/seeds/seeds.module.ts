import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ItemsModule } from 'src/items/items.module';
import { ItemsSeed } from 'src/items/seeds/items.seed';
import { SpellsSeed } from 'src/spells/seeds/spells.seed';
import { SpellsModule } from 'src/spells/spells.module';

@Module({
  imports: [CommandModule, ItemsModule, SpellsModule],
  providers: [ItemsSeed, SpellsSeed],
  exports: [ItemsSeed, SpellsSeed],
})
export class SeedsModule {}
