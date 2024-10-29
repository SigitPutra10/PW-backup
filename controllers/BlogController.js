const Blog = require('../models/BlogModel');
const fs = require('fs');


exports.createBlog = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null; // URL gambar lengkap

    try {
        await Blog.create({
            title,
            description,
            image,
            userId: req.userId 
        });
        res.status(201).json({ msg: "Blog berhasil ditambahkan", image });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        const blogsWithImages = blogs.map(blog => ({
            ...blog.toJSON(),
            image: blog.image ? `${req.protocol}://${req.get('host')}/uploads/${blog.image}` : null
        }));
        res.status(200).json(blogsWithImages);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!blog) {
            return res.status(404).json({ msg: "Blog tidak ditemukan" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!blog) {
            return res.status(404).json({ msg: "Blog tidak ditemukan" });
        }

        const { title, description } = req.body;
        const image = req.file ? req.file.filename : blog.image; // Menggunakan gambar baru atau gambar lama

        // Hapus gambar lama jika ada gambar baru diupload
        if (req.file && blog.image) {
            fs.unlinkSync(`./uploads/${blog.image}`);
        }

        await Blog.update({ title, description, image }, {
            where: {
                id: blog.id
            }
        });

        res.status(200).json({ msg: "Blog berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!blog) {
            return res.status(404).json({ msg: "Blog tidak ditemukan" });
        }

        // Hapus gambar terkait dari folder jika ada
        if (blog.image) {
            fs.unlinkSync(`./uploads/${blog.image}`);
        }

        await Blog.destroy({
            where: {
                id: blog.id
            }
        });

        res.status(200).json({ msg: "Blog berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
