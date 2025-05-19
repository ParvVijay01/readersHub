import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true, 
        minLength: 6
    },
    profileImage: {
        type: String,
        default: ""
    },
    
}, {
    timestamps: true,
});

//hash the password before saving user to db
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next() /// --> If user want to update the username or email only then the password wont be hashed again


    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

//comapre password function
userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User