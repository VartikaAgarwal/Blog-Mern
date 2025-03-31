import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blog.model.js";
import { encode } from "entities";
import Category from "../models/category.model.js";

export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);

    let featuredImage = "";

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "yt-mern-blog",
          resource_type: "auto",
        });

        featuredImage = uploadResult.secure_url;
      } catch (error) {
        return next(handleError(500, "Image upload failed: " + error.message));
      }
    } else {
      return next(handleError(400, "Feature image is required."));
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title,
      slug: `${data.slug}-${Math.round(Math.random() * 100000)}`,
      featuredImage: featuredImage,
      blogContent: encode(data.blogContent),
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog added successfully.",
    });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid).populate("category", "name");

    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    res.status(200).json({ blog });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const data = JSON.parse(req.body.data);

    const blog = await Blog.findById(blogid);
    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    blog.category = data.category;
    blog.title = data.title;
    blog.slug = data.slug;
    blog.blogContent = encode(data.blogContent);

    let featuredImage = blog.featuredImage;
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "yt-mern-blog",
          resource_type: "auto",
        });

        featuredImage = uploadResult.secure_url;
      } catch (error) {
        return next(handleError(500, "Image upload failed: " + error.message));
      }
    }

    blog.featuredImage = featuredImage;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findByIdAndDelete(blogid);

    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const showAllBlog = async (req, res, next) => {
  try {
    const user = req.user;
    let blogs;
    if (user.role === "admin") {
      blogs = await Blog.find()
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } else {
      blogs = await Blog.find({ author: user._id })
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    }

    res.status(200).json({ blogs });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();

    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    res.status(200).json({ blog });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const getRelatedBlog = async (req, res, next) => {
  try {
    const { category, blogSlug } = req.params;
    const categoryData = await Category.findOne({ slug: category });

    if (!categoryData) {
      return next(handleError(404, "Category not found."));
    }

    const relatedBlogs = await Blog.find({
      category: categoryData._id,
      slug: { $ne: blogSlug }, 
    })
      .select("title slug featuredImage createdAt") 
      .lean()
      .exec();

    res.status(200).json({ relatedBlogs });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const getBlogByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const categoryData = await Category.findOne({ slug: category });

    if (!categoryData) {
      return next(handleError(404, "Category not found."));
    }

    const blogs = await Blog.find({ category: categoryData._id })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();

    res.status(200).json({
      blogs,
      categoryData,
    });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};

export const search = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Query is required" });

    const blogs = await Blog.find({ title: new RegExp(q, "i") });
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const user = req.user;
    const blogs = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({ blogs });
  } catch (error) {
    return next(handleError(500, "Server error: " + error.message));
  }
};
