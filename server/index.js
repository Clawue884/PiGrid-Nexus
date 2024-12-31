const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/pigrid', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schema untuk transaksi energi
const transactionSchema = new mongoose.Schema({
    seller: String,
    amount: Number,
    price: Number,
    buyer: String,
    status: String,
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// API untuk daftar energi
app.post('/list-energy', async (req, res) => {
    const { seller, amount, price } = req.body;
    const newTransaction = new Transaction({ seller, amount, price, status: 'available' });
    await newTransaction.save();
    res.send({ message: 'Energy listed successfully' });
});

// API untuk membeli energi
app.post('/buy-energy', async (req, res) => {
    const { id, buyer } = req.body;
    const transaction = await Transaction.findById(id);
    if (transaction && transaction.status === 'available') {
        transaction.buyer = buyer;
        transaction.status = 'sold';
        await transaction.save();
        res.send({ message: 'Energy purchased successfully' });
    } else {
        res.status(400).send({ message: 'Energy not available' });
    }
});

// API untuk mendapatkan semua energi
app.get('/get-energy', async (req, res) => {
    const energyList = await Transaction.find({ status: 'available' });
    res.send(energyList);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
