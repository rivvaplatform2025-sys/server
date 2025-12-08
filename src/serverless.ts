import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Express } from 'express';

let cachedServer: Promise<Express> | null = null;

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    cachedServer = (async () => {
      const server = express();
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
        {
          logger: false,
        },
      );
      await app.init();

      return server;
    })();
  }

  return cachedServer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServer();
  server(req, res);
}
