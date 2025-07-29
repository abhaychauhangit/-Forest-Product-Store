import Coupon from "../models/coupon.js"


 
export const getCoupon = async () => {
    try {
        const coupon = await Coupon.findOne({userid: req.user._id, isActive: true});
        res.status(200).json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const validateCoupon = async () => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive: true})

        if(!coupon) {
            res.status(404).json({message: "Coupon not found"});
        }

        if(coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }

        res.status(200).json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
}