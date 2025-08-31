import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configs from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
  exports: [],
  providers: [],
})
export class CommonModule {}
