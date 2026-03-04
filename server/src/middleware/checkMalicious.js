export default function checkMaliciousLogin(req, res, next) {
    const data = req.body;
    console.log('Received data checking if malicious:', data);
    next();
}