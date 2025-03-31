import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featuredImage: { type: String },
    blogContent: { type: String, required: true },
});

export default mongoose.model("Blog", BlogSchema);
