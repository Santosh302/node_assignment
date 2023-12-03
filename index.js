const express = require('express');
const Storage =require('node-persist')
const app = express(); //create server using express()

app.use(express.json());  //convert req objects into JSON.
//initialize storage
Storage.init();

//1:-post the data in node-persist 
app.post("/student",async (req,res)=>{
    const {id, name, gpa}= req.body; //Objecct Destructring
    const resp = await Storage.setItem(id,{id, name, gpa});

    res.send({message:"User Added Successfully", resp});
});

//2 :-Get all Student data by using GET method on url-- /allstudents
app.get("/allstudents",async (req, res)=>{
    const result =await Storage.values();
    let StudentsData ="<h1>All Students data!</h1>"
    for(let u of result){
        StudentsData +=` 
        <h3>Id:${u.id}</h3> 
        <h3>Name:${u.name}</h3> 
        <h3>GPA:${u.gpa}</h3>`
        
    }
    res.send( StudentsData);
});

//3:-Get specific Students data by using Get mehod on url -- /student/id
app.get("/student/:id", async (req, res)=>{
    const id= req.params.id;
    const resultId= await Storage.getItem(id);
    if(resultId){
        res.send( `<h1>Students Detail</h1> 
         <h3>Id:${resultId.id}</h3>
         <h3>Name:${resultId.name}</3> 
         <h3>GPA:${resultId.gpa}</h3>`
        )
    }else{
        res.send("No students available with given Id")
    }
});

//4:-Code to Find the Topper in Existing Student on Url--  /topper
app.get("/topper", async (req, res) => {
    const students = await Storage.values();
    // Initialize topper with the first student
    let topper = students[0];
    for (let i = 1; i < students.length; i++) {
      const currentStudent = students[i];
      // Check  higher GPA than the current topper
      if (currentStudent.gpa > topper.gpa) {
        topper = currentStudent;
      }
    }
  
    res.send(`
      <h1>Students Details</h1>
      <h3>Id: ${topper.id}</h3>
      <h3>Name: ${topper.name}</h3>
      <h3>GPA: ${topper.gpa}</h3>
    `);
  });
  

app.listen(5000, ()=>{
    console.log("server started on port 5000");
})
