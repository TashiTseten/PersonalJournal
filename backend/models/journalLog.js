import mongoose from "mongoose";

const LogSchema = mongoose.Schema(
    {
        day:{
            type: Date,
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

export const Log = mongoose.model('Journal', { LogSchema });