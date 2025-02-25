import express from 'express';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const user_ip = 
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||'';

    return res.json({ 
        
        user_ip,

     });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});