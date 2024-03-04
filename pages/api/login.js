export default function handler(req, res) {
    const { username, password } = req.body;

    if (username === process.env.DB_USERNAME && password === process.env.DB_PASSWORD) {
        console.log('match');
        res.status(200).json({ status: 'Logged in' });
    } else {
        res.status(401).json({ status: 'Incorrect username or password' });
    }
}