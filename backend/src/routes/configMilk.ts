import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import { authenticate } from "../plugins/authenticate";
import { addDays, substractDays } from "../plugins/date";

export async function configMilkRoutes(fastify: FastifyInstance){


    fastify.get('/config/milk', {onRequest: [authenticate]}, async (request) => {

        const config = await prisma.config.findFirst({
        })
        return { config };
    });


    fastify.put('/config/milk', {onRequest: [authenticate]}, async (request) => {

        const getConfigBody = z.object({
            value: z.number()
        });
        const { value } = getConfigBody.parse(request.body);

        let configValue = await prisma.config.findFirst()

        if(configValue){
            configValue = await prisma.config.update({
                data: {
                    value: value * 100
                },
                where: {
                    id: configValue.id
                }
            })
        } else {
            configValue = await prisma.config.create({
                data: {
                    value: value * 100,
                }
            })
        }
        

        return { configValue };
    });

}