import express from 'express';
import { Logs } from '../models/journalLog.js';
import OpenAI from 'openai';

const router = express.Router();

router.get('/', async (request,response) => {
    try{
        const logs = await(Logs.find({}));
        return response.status(200).json(
            {
                count: logs.length,
                data: logs
            }
        );
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
});

router.get('/:day', async(request,response) => {
    try{

        const { day } = request.params;

        const log = await Logs.findOne({ day:day });
        if(!log) {
            return response.status(400).send({
                message: 'No Entry Found',
            })
        }
        console.log('Log Entry Found');
        return response.status(200).json(log)
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

router.post('/', async(request,response) => {
    try{
        if(!request.body.day ||
            !request.body.day ||
            !request.body.entry
        ) {
            return response.status(400).send({
                message: 'Send all required fields: day, title, entry',
            })
        }
        const newLog = {
            day:request.body.day,
            title:request.body.title,
            entry:request.body.entry
        };

        const log = await Logs.create(newLog);

        return response.status(201).send(log);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

router.put('/openai/:day', async(request,response) => {
    try{
        const { id } = request.params;
        const { entry } = request.body;
        const openai = new OpenAI({apiKey: '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'});
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "user", 
                    "content": entry
                }
            ]
        });
        const advice = completion.choices[0].message;
        request.body.advice = advice;

        const result = await Logs.findByIdAndUpdate(id,request.body);
        if(!result)
            return response.status(400).json({message:'Log Entry not found'});
        return response.status(200).send({message:'Advice updated successfully'});
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
});

router.delete('/:id',async(request,response) => {
    try{
        const { id } = request.params;

        const result = await Logs.findByIdAndDelete(id)

        if(!result){
            return response.status(400).send({
                message: 'Id could not be found'
            });
        }
        return response.status(200).send({
            message: 'Log successfully deleted'
        });
    }catch(error){
        console.log(error.message)
        response.status(500).send({message:error.message})
    }
})

export default router;