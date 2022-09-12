import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  NatsContext,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy) {
    void this.simulateRequest();
  }

  async simulateRequest() {
    const response = await firstValueFrom(this.client.send('abc', {}));

    // where I can find response-header???
  }

  @MessagePattern('abc')
  method(@Ctx() context: NatsContext) {
    context.getHeaders().set('response-header', 'abc');
    return 'my data';
  }
}
