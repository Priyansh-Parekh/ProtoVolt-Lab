import { Router } from 'express';
const route = Router();

//Home Page
route.get('/', async (req, res) => {
    res.json({
        message : "It's Working."
    })

});

export default route;