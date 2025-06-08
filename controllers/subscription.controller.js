import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";


export const getSubscriptions = async(req, res, next) => {
    try{
     const allSubscriptions = await Subscription.find();

     if(!allSubscriptions){
        const error = new error('No subscriptions Found');
        error.statusCode = 404;
        throw error;
     }

     res.status(200).json({
        success: true, 
        message:'Fetched all subscriptions', 
        data: allSubscriptions
    })

    } catch(error){
        next(error)
    }
}

export const getSubscriptionById = async(req, res, next) => {
    try{
      const { id } = req.params;
      
      if(!mongoose.Types.ObjectId.isValid(id)){
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
      }

      const getSubscriptionById = await Subscription.findById(id);

      if(!getSubscriptionById){
        const error = new Error('Subscription doesnot exist');
        error.status = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        message: 'Subscription by the Id fetched successfully',
        data: getSubscriptionById
      })

    } catch(error){
        next(error)
    }
}

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid ID");
        error.statusCode = 400;
        throw error;
      }
  
      const updatedSubscription = await Subscription.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedSubscription) {
        const error = new Error("Subscription not found");
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({
        success: true,
        message: "Subscription updated successfully",
        data: updatedSubscription,
      });
    } catch (error) {
      next(error);
    }
  };
  

export const getUserSubsriptions = async (req, res, next) => {
    try {

        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            res.status = 401;
            throw error
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });

    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid ID");
        error.statusCode = 400;
        throw error;
      }
  
      const deleted = await Subscription.findByIdAndDelete(id);
  
      if (!deleted) {
        const error = new Error("Subscription not found");
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({
        success: true,
        message: "Subscription deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  export const cancelSubscription = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const subscription = await Subscription.findById(id);
      if (!subscription) {
        const error = new Error("Subscription not found");
        error.statusCode = 404;
        throw error;
      }
  
      subscription.status = 'cancelled';
      await subscription.save();
  
      res.status(200).json({
        success: true,
        message: "Subscription cancelled",
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  };

  export const getUpcomingRenewals = async (req, res, next) => {
    try {
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
  
      const renewals = await Subscription.find({
        renewalDate: { $gte: now, $lte: nextWeek },
        status: 'active'
      });
  
      res.status(200).json({
        success: true,
        message: "Upcoming renewals fetched",
        data: renewals,
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  