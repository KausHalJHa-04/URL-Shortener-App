import express from 'express';
import Url from '../models/Url.js';
import { nanoid } from 'nanoid';

const router = express.Router();

router.post('/shorten', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }

        try {
            new URL(originalUrl);
        } catch {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        let shortId;
        let exists = true;
        while (exists) {
            shortId = nanoid(7);
            exists = await Url.findOne({ shortId });
        }

        const shortUrl = `${process.env.BASE_URL}/${shortId}`;
        const url = await Url.create({ originalUrl, shortId, shortUrl });

        res.json({
           shortId: url.shortId,
            shortUrl: url.shortUrl
        })

    } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }) 

    router.get('/:shortId', async (req, res) => {
        try {
            const { shortId } = req.params;
            const url = await Url.findOne({ shortId });
            if (!url) return res.status(404).json({ error: 'URL not found' });
          
            url.clicks += 1;
            await url.save();
           
            res.redirect(url.originalUrl);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    })

    export default router;