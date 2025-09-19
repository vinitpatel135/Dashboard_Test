const mongoose = require("mongoose");
const { Schema } = mongoose;
const Types = Schema.Types;

const ClientUserSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "client_users", required: true },
    },
    { _id: false }
);

const CardSchema = new Schema({
    paymentId: String,
    paymentMethodId: { type: String, required: true },
    isDefault: Boolean,
    ccNumber: String,
    ccExp: String,
});

const CustomerSchema = new Schema({
    gatewayId: Types.ObjectId,
    customerId: String,
    isActive: Boolean,
    cards: [CardSchema],
});

const BillingInfoSchema = new Schema(
    {
        activeGatewayId: Types.ObjectId,
        isLocked: Boolean,
        customers: [CustomerSchema],
    },
    { _id: false }
);

const ClientSchema = new Schema(
    {
        businessName: { type: String },
        organizationId: {
            type: Types.ObjectId,
            ref: "organizations",
            required: true,
        },
        mainClientUserId: {
            type: Types.ObjectId,
            required: true,
            ref: "client_users",
        },
        clientUsers: [ClientUserSchema],
        createdBy: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
        leadSourceId: { type: Types.ObjectId, ref: "lead_sources" },
        isActive: { type: Boolean, default: true },
        billingInfo: BillingInfoSchema,
    },
    {
        collection: "clients",
        timestamps: true,
        strict: true,
        versionKey: false,
    }
);

// Index for fast queries
ClientSchema.index({ organizationId: 1 });

// Virtual for notes count
ClientSchema.virtual("noteCount", {
    ref: "notes",
    localField: "_id",
    foreignField: "clientId",
    count: true,
});

module.exports = mongoose.model("clients", ClientSchema);
