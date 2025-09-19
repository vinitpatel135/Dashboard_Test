const mongoose = require("mongoose");
const { Schema } = mongoose;
const Types = Schema.Types;
const productModel = require("../products/productModel");
const clientModel = require("../clients/clientModel");
const organizationModel = require("../organizations/organizationModel");

const paymentSchema = new Schema(
    {
        id: { type: Types.ObjectId, ref: "payments", required: true },
        status: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, required: true },
        refunds: [
            {
                id: { type: Types.ObjectId, ref: "payments", required: true },
                amount: { type: Number, required: true },
                status: { type: String, required: true },
                date: { type: Date, required: true },
            },
        ],
    },
    { _id: false }
);

const installmentSchema = new Schema({
    scheduledDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: [
            "scheduled",
            "offline",
            "paid",
            "partially_paid",
            "overdue",
            "cancelled",
        ],
        required: true,
    },
    isRecurring: Boolean,
    remainingBalance: { type: Number, required: true },
    totalPaidAmount: { type: Number, required: true },
    payments: [paymentSchema],
});

const DealSchema = new Schema(
    {
        organizationId: { type: Types.ObjectId, ref: "organizations", required: true },
        clientId: { type: Types.ObjectId, ref: "clients", required: true },
        productId: { type: Types.ObjectId, ref: "products", required: true },
        type: { type: String, enum: ["one_time", "recurring"], required: true },
        setters: [Types.ObjectId],
        closers: [Types.ObjectId],
        accountManagers: [Types.ObjectId],
        referrer: { type: Types.ObjectId },
        wonDate: { type: Date, required: true },
        fulfillmentDate: Date,
        duration: Number,
        durationUnit: { type: String, enum: ["months", "weeks"] },
        amount: Number,
        tags: [Types.ObjectId],
        status: {
            type: String,
            enum: [
                "opportunity",
                "in_progress",
                "paused",
                "cancelled",
                "refunded",
                "partially_refunded",
                "fully_paid",
            ],
        },
        installments: [installmentSchema],
        recurringStartDate: Date,
        nextRecurringDate: Date,
        recurringAmount: Number,
        isReverseCommission: Boolean,
        cancelReasonId: Types.ObjectId,
    },
    { collection: "deals", timestamps: true, strict: true, versionKey: false }
);

DealSchema.index({ organizationId: 1 });

module.exports = mongoose.model("deals", DealSchema);
