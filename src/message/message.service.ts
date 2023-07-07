import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class MessageService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect(url: string): Promise<void> {
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
  }

  async sendEvent(exchange: string, message: string): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel isnt work');
    }

    await this.channel.assertExchange(exchange, 'direct', { durable: true });
    await this.channel.publish(exchange, '', Buffer.from(message), {
      persistent: true,
    });
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
