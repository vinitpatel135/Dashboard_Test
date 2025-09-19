const mongoose = require("mongoose");
const { Schema } = mongoose;
const Types = Schema.Types;

const ProductSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        organizationId: {
            type: Types.ObjectId,
            ref: "organizations",
            required: true,
        },
        addedBy: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        durationUnit: {
            type: String,
            enum: ["months", "weeks"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        collection: "products",
        timestamps: true,
        strict: true,
        versionKey: false,
    }
);

// Index for organizationId (query optimization)
ProductSchema.index({ organizationId: 1 });

module.exports = mongoose.model("products", ProductSchema);
