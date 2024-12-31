import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [energyList, setEnergyList] = useState([]);
    const [seller, setSeller] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');

    // Fetch data energi
    useEffect(() => {
        axios.get('http://localhost:5000/get-energy')
            .then(res => setEnergyList(res.data))
            .catch(err => console.error(err));
    }, []);

    // Daftar energi
    const listEnergy = () => {
        axios.post('http://localhost:5000/list-energy', { seller, amount, price })
            .then(() => window.location.reload())
            .catch(err => console.error(err));
    };

    // Beli energi
    const buyEnergy = (id) => {
        const buyer = prompt('Masukkan nama Anda:');
        axios.post('http://localhost:5000/buy-energy', { id, buyer })
            .then(() => window.location.reload())
            .catch(err => console.error(err));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>PiGrid Nexus Marketplace</h1>

            <h2>Daftar Energi</h2>
            <input placeholder="Nama Penjual" value={seller} onChange={e => setSeller(e.target.value)} />
            <input placeholder="Jumlah Energi (kWh)" value={amount} onChange={e => setAmount(e.target.value)} />
            <input placeholder="Harga (Pi)" value={price} onChange={e => setPrice(e.target.value)} />
            <button onClick={listEnergy}>Daftar</button>

            <h2>Energi Tersedia</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Penjual</th>
                        <th>Jumlah (kWh)</th>
                        <th>Harga (Pi)</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {energyList.map(item => (
                        <tr key={item._id}>
                            <td>{item.seller}</td>
                            <td>{item.amount}</td>
                            <td>{item.price}</td>
                            <td><button onClick={() => buyEnergy(item._id)}>Beli</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
