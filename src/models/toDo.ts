import mongoose , {Document, Model, Schema} from "mongoose";

export interface MyToDoInterface extends Document{
  title: string,
  completed: boolean,
  createdAt: Date,
  remindMe?: string,
  dueDate?: string,
  repeat?: "None" | "Daily" | "Weekly" | "Monthly",
  file?: string,
  note?: string,
  important?: boolean,
};

const MyToDoSchema: Schema<MyToDoInterface> = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  remindMe: { type: String }, 
  dueDate: { type: String },
  repeat: { type: String, enum: ["None", "Daily", "Weekly", "Monthly"], default: "None" },
  file: { type: String },
  note: { type: String },
  important: { type: Boolean, default: false },
});

const MyToDo : Model<MyToDoInterface> = mongoose.models.MyToDo || 
mongoose.model<MyToDoInterface>("MyToDo", MyToDoSchema);

export default MyToDo;