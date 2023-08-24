const mongoose = require("mongoose");
const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')

//GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs lists",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error WHile Getting Blogs",
      error,
    });
  }
};

//Create Blog
exports.createBlogController =async(req,res)=>{
    try{
        const {title,description,image,user}=req.body
        //validation
        if(!title || !description||!image||!user){
            return res.status(400).send({
                success:false,
                message:'Please provide all Feilds'
            })
        }
        const exisitingUser =await userModel.findById(user) 
        //validation
        if(!exisitingUser){
          return res.status(404).send({
            success: false,
            message:"Unable to find User"
          })
        }
        const newBlog=new blogModel({title,description,image,user});
        const session= await mongoose.startSession()
        session.startTransaction();
        await newBlog.save({session});
        exisitingUser.blogs.push(newBlog);
        await exisitingUser.save({session})
        await session.commitTransaction();
        await newBlog.save()
        return  res.status(201).send ({
            success:true,   
            message:'Blog Created!',
            newBlog,
        })
    }catch(error){
        console.log(error)
        return res.status(400).send({
            success:false,
            message: 'Internal Server Error while creating Blog',
            error
        })
    }
}


//Update Blog
exports.updateBlogController = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, image } = req.body;
      const blog = await blogModel.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );
      return res.status(200).send({
        success: true,
        message: "Blog Updated!",
        blog,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "Error WHile Updating Blog",
        error,
      });
    }
  };

//Single Blog
exports.getBlogByIdContainer =async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await blogModel.findById(id);
      if (!blog) {
        return res.status(404).send({
          success: false,
          message: "blog not found with this is",
        });
      }
      return res.status(200).send({
        success: true,
        message: "fetch single blog",
        blog,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "error while getting single blog",
        error,
      });
    }
  };
//Delete Blog
// exports.deletesBlogController = async (req, res) => {
//     // try {
//     //   await blogModel.findOneAndDelete(req.params.id)
//     //   return res.status(200).send({
//     //     success: true,
//     //     message: "Blog Deleted!",
//     //   });
//     // } catch (error) {
//     //   console.log(error);
//     //   return res.status(400).send({
//     //     success: false,
//     //     message: "Erorr WHile Deleteing BLog",
//     //     error,
//     //   });
//     // }
//     try {
//       const blog = await blogModel.findOneAndDelete(req.params.id).populate("user");
//         // .findByIdAndDelete(req.params.id)
        
//       await blog.user.blogs.pull(blog);
//       await blog.user.save();
//       return res.status(200).send({
//         success: true,
//         message: "Blog Deleted!",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(400).send({
//         success: false,
//         message: "Erorr WHile Deleteing BLog",
//         error,
//       });
//     }
//   };
exports.deletesBlogController = async (req, res) => {
  try {
      const blog = await blogModel.findByIdAndDelete(req.params.id).populate("user");

      if (!blog) {
          return res.status(404).send({
              success: false,
              message: "Blog not found",
          });
      }

      if (!blog.user) {
          return res.status(404).send({
              success: false,
              message: "User not found for this blog",
          });
      }

      // Remove the blog from the user's blogs array
      blog.user.blogs.pull(blog);
      await blog.user.save();

      return res.status(200).send({
          success: true,
          message: "Blog Deleted!",
      });
  } catch (error) {
      console.log(error);
      return res.status(400).send({
          success: false,
          message: "Error while deleting blog",
          error,
      });
  }
};
//GET USER BLOG
exports.userBlogControlller = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");

    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "blogs not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error in user blog",
      error,
    });
  }
};