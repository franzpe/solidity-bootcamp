import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Spell, SpellSchema } from './schemas/spell.schema';
import { SpellsController } from './spells.controller';
import { SpellsService } from './spells.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Spell.name, schema: SpellSchema }]),
  ],
  controllers: [SpellsController],
  providers: [SpellsService],
  exports: [SpellsService],
})
export class SpellsModule {}
