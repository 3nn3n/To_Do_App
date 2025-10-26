import { NextRequest, NextResponse } from "next/server";
import databaseConnect from "@/src/lib/mongoose";
import MyToDo, {MyToDoInterface} from "@/src/models/toDo";

export async function GET () {
  await databaseConnect();
  const toDos: MyToDoInterface[]  = await MyToDo.find({});
  return NextResponse.json(toDos, {status: 200});
}

export async function POST (request: NextRequest) {
  try{
    const data: Partial<MyToDoInterface> = await request.json();
    await databaseConnect();
    const newToDo: MyToDoInterface = await MyToDo.create(data);
    return NextResponse.json(newToDo, {status: 201});
  }
  catch(error){
    return NextResponse.json({error:"Failed to create a new to-do item."}, {status: 500});
  }
};

export async function PATCH(request: NextRequest) {
  try{
    const {id, ...updateData} : {id: string} & Partial<MyToDoInterface> = await request.json();
    if(!id){
      return NextResponse.json({error: "To-do item ID is required."}, {status: 400});
    }
    await databaseConnect();
    const updateToDo: MyToDoInterface | null = await MyToDo.findByIdAndUpdate(id, updateData, {new: true});
    if(!updateToDo){
      return NextResponse.json({error: "To-do item not found."}, {status: 404});
    }
    return NextResponse.json(updateToDo, {status: 200});
  }
  catch(error){
    return NextResponse.json({error: "Failed to update the to-do item."}, {status: 500});
  }
};

export async function DELETE(request: NextRequest) {
  try{
        const id = request.nextUrl.searchParams.get("id");
    if(!id){
      return NextResponse.json({error: "To-do item ID is required."}, {status: 400});
    }
    await databaseConnect();
    const deletedToDo: MyToDoInterface | null = await MyToDo.findByIdAndDelete(id);
    if(!deletedToDo){
      return NextResponse.json({error: "To-do item not found."}, {status: 404});
    }
    return NextResponse.json({message: "Deleted Successfully"} ,{status: 200});
  }
  catch(error){
    return NextResponse.json({error: "Failed to delete the to-do item."}, {status: 500});
  }
};
