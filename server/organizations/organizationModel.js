const mongoose = require("mongoose");
const { Schema } = mongoose;
const Types = Schema.Types;

const PaymentIntegrationSchema = new Schema(
    {
        providerName: {
            type: String,
            enum: ["stripe", "deposyt", "nmi"],
            required: true,
        },
        publishableKey: { type: String, required: true },
        secretKey: { type: String, required: true },
        isActive: { type: Boolean, required: true },
    },
    { timestamps: true, strict: true }
);

const UserSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "users", required: true },
    roleId: { type: Types.ObjectId, ref: "roles", required: true },
});

const OrganizationSchema = new Schema(
    {
        organizationName: { type: String, required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, default: Date.now },
        mainUserId: { type: Types.ObjectId },
        users: [UserSchema],
        address1: String,
        address2: String,
        city: String,
        pinCode: String,
        state: String,
        country: {
            name: { type: String, required: true },
            currency: { type: String, required: true },
        },
        packageId: Types.ObjectId,
        totalSeats: Number,
        usedSeats: Number,
        addOnSeats: Number,
        profileImage: {
            filePath: String,
            filePathUrl: String,
        },
        sourceName: String,
        paymentIntegrations: [PaymentIntegrationSchema],
        cbLoginPageImage: { type: String, default: null },
        cbImages: { type: [Schema.Types.Mixed], default: [] },
        cbSubDomain: { type: String, default: null },
        cbDomain: { type: String, default: null },
        cbDomainFlyRes: { type: Schema.Types.Mixed, default: null },
        cbSenderEmail: { type: String, default: null },
        cbSenderEmailSesRes: { type: Schema.Types.Mixed, default: null },
    },
    {
        collection: "organizations",
        timestamps: true,
        strict: true,
        versionKey: false,
    }
);

// Index for user lookups
OrganizationSchema.index({ users: 1 });

module.exports = mongoose.model("organizations", OrganizationSchema);
