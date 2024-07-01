const userModel = require('../models/userModel');


//updating user profile...
exports.updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
          console.log("🚀 ~ exports.updateProfile= ~ user:", user)
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          console.log(req.user.id);
    let updatedFields = req.body;
    // if (req.file) {
    //          updatedFields.profileImage = req.file?.location
    //         }

    // if (req.file) {
    //   user.profileImage = req.file.location; // Use req.file.location to get the S3 file URL
    //   updatedFields.profileImage = req.file.location; // Include profileImage in updated fields
    // }
    console.log("🚀 ~ exports.updateProfile= ~ updatedFields:", updatedFields)

    const updateUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields},
      { new: true }
    );
    console.log("🚀 ~ exports.updateProfile= ~ updateUser:", updateUser)
    if (!updateUser)
      return res.status(401).json({ code: 401, error: "User not found" });
    
    const {password, ...other} = JSON.parse(JSON.stringify(updateUser));

    res.status(200).json({ code: 200, message: "User updated successfully" ,updateUser:{...other}});
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, error: "Error While Updating Data" });
  }
};




// //Updating User Profile.....
// exports.updateProfile = async (req, res) => {
//   try {
//       const { name, picture, country} = req.body;
      
//       const user = await userModel.findById(req.user.id);
//       if (!user) {
//           return res.status(404).json({ error: 'User not found' });
//       }
//       if (picture) {
//         user.picture =picture;
//       }
//       if (name) {
//           user.name = name;
//       } 
//       if (country) {
//           user.country = country;
//       }
      
//       if (req.file) {
//         const filePath = req.file.path;
//         user.profileImage = filePath;
//       }
     
//       await user.save();
//       return res.json({ message: 'Profile updated successfully' });
//   } catch (err) {
//       console.error('Error in updateProfile:', err);
//      return res.status(500).json({ error: 'Internal server error' });
//   }
// };

