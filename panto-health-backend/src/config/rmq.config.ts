import { registerAs } from '@nestjs/config';

export default registerAs(
  'rmq',
  (): Record<string, any> => ({
    uri: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE ?? 'queue',
  }),
);
