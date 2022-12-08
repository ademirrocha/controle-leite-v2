import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import { authenticate } from "../plugins/authenticate";
import { addDays, substractDays } from "../plugins/date";


export type Milk = {
  id: string
  value: number
  qty: number
  date: Date
  paidOut: boolean
}

export async function milkRoutes(fastify: FastifyInstance){

    fastify.get('/milk/count', {onRequest: [authenticate]}, async () => {
        const count = await prisma.milk.count();
        return { count: count}
    });

    fastify.post('/milk', {onRequest: [authenticate]}, async (request, reply) => {

        console.log(request.body)

        const creatMilkBody = z.object({
            qty: z.number(),
            date: z.string()
        });

        const { qty, date } = creatMilkBody.parse(request.body);

        const generateCode = new ShortUniqueId({ length: 7 });
        const code = String(generateCode()).toUpperCase();

        console.log(request.body)

        const value = await prisma.config.findFirst();

        if(value){
            try {
                await request.jwtVerify();
    
                await prisma.milk.create({
                    data: {
                        id: code,
                        value: value?.value * qty,
                        qty: qty,
                        date: date,
                        paidOut: false
                    }
                });
                
            } catch (e) {
                console.log(e)
            }
            return reply.status(201).send({code});
        }

        return reply.status(400).send({message: 'Não foi encontrado valor de litro'});
        
    });


    const findAllMilks = async (dateInit?: Date, dateFinal?: Date) => {
        if(dateFinal && dateInit){
            return await prisma.milk.findMany({
                where: {
                    paidOut: false,
                    date: {
                        gte: dateInit,
                        lte: dateFinal
                    }
                }, 
                orderBy: {
                    date: 'desc'
                }
            })
        }

        return await prisma.milk.findMany({
            where: {
                paidOut: false
            }, 
            orderBy: {
                date: 'desc'
            }
        })
    }


    fastify.get('/milk', {onRequest: [authenticate]}, async (request) => {

        const getMilkQuery = z.object({
            dateInit: z.string(),
            dateFinal: z.string()
        });

        const { dateInit, dateFinal } = getMilkQuery.parse(request.query);

        console.log('dateInit => ', dateInit)
        console.log('dateFinal => ', dateFinal)

        const milks = await findAllMilks(new Date(dateInit), new Date(dateFinal))

        return { milks };
    });


    fastify.get('/milk/initial-date', {onRequest: [authenticate]}, async (request) => {

        const milk = await prisma.milk.findFirst({
            where: {
                paidOut: false
            }, 
            orderBy: {
                date: 'asc'
            }
        })

        return { date: milk?.date ?? new Date() };
    });


    fastify.delete('/milk/:id', {onRequest: [authenticate]}, async (request) => {
        const getPollParams = z.object({
            id: z.string()
        });

        const { id } = getPollParams.parse(request.params);

        await prisma.milk.delete({
            where: {
                id
            }
        })

        return { result: true };
    });


    fastify.put('/milk/payments', {onRequest: [authenticate]}, async (request) => {

        const getMilkBody = z.object({
            dateInit: z.string(),
            dateFinal: z.string()
        });

        const { dateInit, dateFinal } = getMilkBody.parse(request.body);

        let milks = await findAllMilks(new Date(dateInit), new Date(dateFinal))

        milks.forEach( async (milk: Milk) => {
            await prisma.milk.update({
                where: {
                    id: milk.id
                },
                data: {
                    paidOut: true
                }
            })
        })

        milks = await findAllMilks()

        return { milks };
    });

}