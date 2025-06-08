import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { cancelSubscription, createSubscription, deleteSubscription, getSubscriptionById, getSubscriptions, getUpcomingRenewals, getUserSubsriptions, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', getSubscriptions);

subscriptionRouter.get('/:id', getSubscriptionById)

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', updateSubscription)

subscriptionRouter.delete('/:id', deleteSubscription)

subscriptionRouter.get('/user/:id', authorize, getUserSubsriptions)

subscriptionRouter.put('/:id/cancel', cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);



export default subscriptionRouter;