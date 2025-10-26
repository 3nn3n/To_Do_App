"use client";

import {useState} from "react";
import ToDoApp from "./mainpage";

export default function HomePage() {

  const [selectTab, setSelectTab] = useState("Tasks");

  function handleMyDay(){
    setSelectTab("My Day");
  }

  function handleImportant(){
    setSelectTab("Important");
  }

  function handlePlanned(){
    setSelectTab("Planned");
  }

  function handleTasks(){
    setSelectTab("Tasks");
  }


  return(
    <>
     <div style={{display:"flex", flexDirection:"row"}}>
      <div style={{backgroundColor:"whitesmoke", height:"95vh", width:"40vh", margin:"20px"}}>
         <h1>Nitesh Negi</h1>
         <input placeholder="Search"></input>
         <div >
          <button onClick={handleMyDay} style={{marginTop:"20px",borderWidth:"0", cursor:"pointer", width:"23vh"}}>My Day</button>
         </div>
         <div >
          <button onClick={handleImportant} style={{marginTop:"20px",borderWidth:"0", cursor:"pointer", width:"23vh"}}>Important</button>
         </div>
         <div >
          <button onClick={handlePlanned} style={{marginTop:"20px",borderWidth:"0", cursor:"pointer", width:"23vh"}}>Planned</button>
         </div>
         <div >
          <button onClick={handleTasks} style={{marginTop:"20px",borderWidth:"0", cursor:"pointer", width:"23vh"}}>Tasks</button>
         </div>

      </div>

      <ToDoApp children={selectTab}/>
  
    </div>

    </>
  )
}
