import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  NatsContext,
  NatsRecordBuilder,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as nats from 'nats';

@Controller()
export class AppController {
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy) {
    setTimeout(() => void this.simulateRequest(), 1000);
  }

  async simulateRequest() {
    const requestHeaders = nats.headers();
    requestHeaders.set('x-version', '1.0.0');

    const record = new NatsRecordBuilder({ abc: true }).setHeaders(requestHeaders).build();
    const response = await firstValueFrom(this.client.send('abc', record));

    // there's no response-header???
    console.log(response);
  }

  @MessagePattern('abc', Transport.NATS)
  method(@Ctx() context: NatsContext) {
    // here I can read request headers 
    const requestHeaders = context.getHeaders();
    console.log({ requestHeaders: requestHeaders.headers });
    
    // I suppose that they should appear but they don't 
    const responseHeaders = nats.headers();
    responseHeaders.set('response-header', 'abc');

    return new NatsRecordBuilder({ abc: false }).setHeaders(responseHeaders).build();
  }
}