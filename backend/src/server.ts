import Fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { milkRoutes } from "./routes/milk";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { configMilkRoutes } from "./routes/configMilk";



async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(cors, {
        origin: true
    });

    await fastify.register(jwt, {
        secret: 'leite_control'
    })

    await fastify.register(authRoutes);
    await fastify.register(milkRoutes);
    await fastify.register(configMilkRoutes);
    await fastify.register(userRoutes);


    await fastify.listen({ port: 3333, host: '0.0.0.0' });
}

bootstrap()