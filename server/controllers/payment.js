import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.js";
import Order from "../models/order.js";



export const createCheckoutSession =  async (req, res) => {
    try {
        const {products, couponCode} = req.body;

        if(!Array.isArray(product) || products.length === 0) {
            return res.status(400).json({error: "invalid or empty products array"});
        }

        let totalAmount = 0;
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price*100);
            totalAmount += amount*product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    prodcuct_data: {
                        name: product.name,
                        image: [product.images],
                    },
                    unit_amount: amount
                },
                quantity: product.quantity || 1,
            }
        });
        let coupon = null;
        if(couponCode) {
            coupon = await Coupon.find({code: couponCode});
            if(coupon) {
                totalAmount -= Math.round((totalAmount*coupon.discountPercentage)/100); 
            }
        }

        const session = stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
                    ? [
                        {
                            coupon: await createStripecoupon(coupon.discountPercentage),
                        }
                    ]
                    : [],
            metadata: {
                userId: req.user._id,
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },      
        });

        if(totalAmount >= 20000) {
            await createNewcoupon(req.user._id);
        }
        res.status(200).json({ id: session.id, totalAmount: totalAmount/100 });
    } catch (error) {
        console.log("Error processing checkout", error);
        res.status(500).json({message: "Error processing checkout", error: error.message})
    }
};


export const checkoutSuccess = async (req, res) => {
    try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
    
        if(session.payment.status === "paid") {
            if(session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    {
                        code: couponCode,
                        userId: session.metadata.userId,
                    },
                    {
                        isActive: false,
                    }
                );
            }
    
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total,
                stripeSessionId: sessionId,
            });
    
            await newOrder.save();
    
            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            })
        }
    } catch (error) {
        console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
    }
};

async function createStripecoupon (discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });

    return coupon.id;
} 


async function createNewcoupon (userId) {
    await Coupon.findOneAndDelete({userId});

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId,
    });

    await newCoupon.save();
    return newCoupon;
}
