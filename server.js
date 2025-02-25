import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    let user_ip = 
        req.headers['cf-connecting-ip'] || 
        req.headers['x-real-ip'] || 
        req.headers['x-forwarded-for'] || 
        req.socket.remoteAddress || '';

    // If the IP is IPv6-mapped IPv4 (e.g., ::ffff:192.168.1.1), extract the IPv4 part
    if (user_ip.startsWith('::ffff:')) {
        user_ip = user_ip.replace('::ffff:', '');
    }

    return res.json({ user_ip });
});

// Listen on IPv4 only to avoid defaulting to IPv6 (::1)
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});
