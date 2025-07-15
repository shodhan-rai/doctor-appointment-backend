import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    targetSpecialization: [String], // Which doctor specializations to target
    sampleAvailable: { type: Boolean, default: true },
    launchDate: { type: Date },
    isActive: { type: Boolean, default: true },
    price: { type: Number },
    keyBenefits: [String],
    competitorAnalysis: { type: String }
});

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;