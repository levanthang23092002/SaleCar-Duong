const express = require('express');
const router = express.Router();
const { sendEmailService } = require('../../public/js/sendEmail');

router.get('/', (req, res) => {
    res.render('pages/index')
})
router.get('/danh-muc', (req, res) => {
    res.render('pages/category')
})
router.get('/lien-he', (req, res) => {
    res.render('pages/contact')
})
router.get('/bao-hanh-va-hau-mai', (req, res) => {
    res.render('pages/guarantee')
})
router.get('/tra-gop', (req, res) => {
    res.render('pages/installment')
})
router.get('/gioi-thieu', (req, res) => {
    res.render('pages/introduction')
})
router.get('/tin-tuc', (req, res) => {
    res.render('pages/new')
})
router.get('/tin-tuc/chi-tiet-tin-tuc', (req, res) => {
    res.render('pages/new-detail')
})
router.get('/bang-gia', (req, res) => {
    res.render('pages/pricelist')
})
router.get('/chi-tiet-san-pham', (req, res) => {
    res.render('pages/productdetails')
})
router.post('/send-email', async (req, res) => {
    const data = req.body.data;
    try {
        const info = await sendEmailService(data);
        res.json({ success: true, info });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});
module.exports = router