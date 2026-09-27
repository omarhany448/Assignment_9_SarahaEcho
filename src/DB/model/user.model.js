import mongoose, { Types } from "mongoose";
import { GenderEnum } from "../../common/enum/index.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 10,
        required: true
    },

    lastName: {
        type: String,
        minLength: 2,
        maxLength: 10,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    phone: String,
    DOB: Date,
    confirmEmail: Date,
    image: String,
    coverImage: [String],

    gender: {
        type: Number,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE
    }

}, {
    timestamps:true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
    autoIndex: true
})

userSchema.virtual("username").set(function (value) {
  const [firstName, lastName] = value?.split(" ") || [];
  this.set({ firstName, lastName })
}).get(function(){
  return `${this.firstName} ${this.lastName}`
})

export const UserModel = mongoose.models.User || mongoose.model("User" , userSchema)