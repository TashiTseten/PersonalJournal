import mongoose from "mongoose";

const logSchema = mongoose.Schema(
    {
        day:{
            type: String,
            required: true,
        },
        title:{
            type: String,
            required: true,
        },
        entry:{
            type: String,
            required:true,
        },
    },
    {
        timestamps: true,
    }
);

export const Logs = mongoose.model('Journal', logSchema);