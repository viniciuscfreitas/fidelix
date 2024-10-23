// src/routes/subscription.ts
import express from 'express';
import { createSubscription, getAllSubscriptions, cancelSubscription, renewSubscription, renewSubscriptionWithDiscount } from '../controllers/subscriptionController';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(createSubscription));
router.get('/', asyncHandler(getAllSubscriptions));
router.put('/cancel/:id', asyncHandler(cancelSubscription));
router.put('/renew/:id', asyncHandler(renewSubscription));
router.put('/renew-with-discount/:id', asyncHandler(renewSubscriptionWithDiscount));

export default router;