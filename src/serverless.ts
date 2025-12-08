import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { Express } from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedServer: Express | null = null;

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    //const server = express();
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();

    cachedServer = server;
  }

  return cachedServer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServer();
  server(req, res);
}
