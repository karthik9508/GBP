declare module "razorpay" {
    interface RazorpayConfig {
        key_id: string;
        key_secret: string;
    }

    interface OrderCreateParams {
        amount: number;
        currency: string;
        receipt?: string;
        notes?: Record<string, string>;
    }

    interface Order {
        id: string;
        amount: number;
        currency: string;
        receipt: string;
        status: string;
    }

    interface Orders {
        create(params: OrderCreateParams): Promise<Order>;
    }

    class Razorpay {
        constructor(config: RazorpayConfig);
        orders: Orders;
    }

    export = Razorpay;
}
