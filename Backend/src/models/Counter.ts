import { Schema, model } from "mongoose";

const schema = new Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true, default: 0 },
}, { collection: "counters", versionKey: false });

export const CounterModel = model("Counter", schema);
