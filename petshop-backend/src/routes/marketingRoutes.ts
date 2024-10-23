// src/routes/marketingRoutes.ts
import express from 'express';
import {
    registerCampaignForSegment,
    getAllCampaigns,
    getCampaignsByCustomer,
    segmentCustomers
} from '../controllers/marketingController';
import { authorize } from '../middleware/authorization';

const router = express.Router();

router.get('/segment-customers', authorize(['admin']), segmentCustomers);
router.post('/register-campaign', authorize(['admin']), registerCampaignForSegment);
router.get('/campaigns', authorize(['admin']), getAllCampaigns);
router.get('/campaigns/customer/:customerId', authorize(['admin']), getCampaignsByCustomer);

export default router;
