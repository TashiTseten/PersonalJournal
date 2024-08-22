import express from 'express';
import { Logs } from '../models/journalLog.js';

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

export default router;