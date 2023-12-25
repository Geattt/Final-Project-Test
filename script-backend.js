const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://kentma04:4WF94fGZLtsBcWo8@cluster0.btabu0o.mongodb.net/?retryWrites=true&w=majority')
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('open', () => {
  console.log('Database Connected');
});

const voucherSchema = new mongoose.Schema({
  voucher: String,
  used: { type: Boolean, default: false },
  value: Number,
});

const Voucher = mongoose.model('Voucher', voucherSchema);

const router = express.Router();

router.get('/vouchers/:voucherCode', async (req, res) => {
    try {
      const voucherCode = req.params.voucherCode;
      const voucher = await Voucher.findOne({ voucher: voucherCode });
  
      if (!voucher) {
        res.status(404).json({ message: 'Voucher not found' });
        return;
      }
  
      res.json(voucher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.post('/vouchers', async (req, res) => {
  const voucherData = {
    voucher: req.body.voucher,
    value: req.body.value,
  };

  try {
    const newVoucher = new Voucher(voucherData);
    const savedVoucher = await newVoucher.save();
    res.status(200).json(savedVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// New route to update the voucher as used
router.put('/vouchers/:voucherCode', async (req, res) => {
    try {
      const voucherCode = req.params.voucherCode;
      const updatedVoucher = await Voucher.findOneAndUpdate(
        { voucher: voucherCode, used: false }, // Only update if the voucher is not yet used
        { used: true },
        { new: true }
      );
  
      if (!updatedVoucher) {
        res.status(404).json({ message: 'Voucher not found or already used' });
        return;
      }
  
      res.json(updatedVoucher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

app.use('/', router);

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
