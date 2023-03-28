import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ItemsModule } from 'src/items/items.module';
import { ItemsSeed } from 'src/items/seeds/items.seed';

@Module({
  imports: [CommandModule, ItemsModule],
  providers: [ItemsSeed],
  exports: [ItemsSeed],
})
export class SeedsModule {}
