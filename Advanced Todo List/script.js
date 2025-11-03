 const darkModeToggle= document.querySelector("#darkModeToggle")
const  taskTitle = document.querySelector("#taskTitle")
const taskDueDate = document.querySelector("#taskDueDate")

const taskPriority = document.querySelector("#taskPriority")
const taskNotes = document.querySelector("#taskNotes")

const addTaskBtn = document.querySelector("#addTaskBtn")
const taskCategories = document.querySelector("#taskCategories")

const searchTask = document.querySelector("#searchTasks")
const filterPriority = document.querySelector("#filterPriority")
const sortByDate = document.querySelector("#sortByDate")
const exportTasksBtn = document.querySelector("#exportTasksBtn")

let tasks = []

function  saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks))
}

function loadTask(){
    const getTasks = localStorage.getItem("tasks")
    if(getTasks){
        tasks.push(...JSON.parse(getTasks))
        // tasks = JSON.parse(getTasks)
    }
    renderTask();
}

addTaskBtn.addEventListener("click",()=>{
    if(taskTitle.value==="") return;

    const task = {
        title: taskTitle.value,
        date :taskDueDate.value,
        priority : taskPriority.value,
        notes : taskNotes.value,
        completed : false
    }

    tasks.push(task)
    renderTask();
    saveTasks();

    clearForm();
    console.log(tasks)

   
})

function clearForm(){
    taskTitle.value=""
    taskDueDate.value=""
    taskPriority.value="low"
    taskNotes.value=""
}

function renderTask(taskList = tasks) {
    taskCategories.innerHTML = ""; // لیست قبلی پاک شود
    
    taskList.forEach((task, index) => {
        const divTask = document.createElement("div");
        divTask.className = "task";
        divTask.classList.add(task.priority);
        if(task.completed){
            divTask.classList.add("completed")
        }
        divTask.setAttribute("data-index", index); 

        divTask.innerHTML = `
            <p> ${task.title} (${task.notes}) - Due ${task.date} </p>
            <button class="c-ompletebtn">${task.completed ? "completed" : "complete"}</button>
            <button class="delete-btn">Delete</button>
        `;

        
        const completeBtn = divTask.querySelector(".c-ompletebtn");
        completeBtn.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed; 
            renderTask();
            saveTasks();
            
            console.log(task);
        });

        const btnDelet =  divTask.querySelector(".delete-btn")
       btnDelet.addEventListener("click",()=>{
            tasks.splice(index,1)
            renderTask();
            saveTasks();
        })

        taskCategories.appendChild(divTask);
     
    });
}




searchTask.addEventListener("input", filterTask);
filterPriority.addEventListener("change", filterTask);
sortByDate.addEventListener("change", filterTask);

function filterTask(){
    let searchValue = searchTask.value.toLowerCase().trim();
    let PriorityValue = filterPriority.value;
    let sortByDateValue = sortByDate.value;

   let taskFiltered = tasks.filter((task) => { 
     const searchValueFilter = task.title.toLowerCase().includes(searchValue)
     const PriorityValueFilter =   PriorityValue === "" || task.priority === PriorityValue
      return searchValueFilter && PriorityValueFilter
   });
   console.log(taskFiltered)

   if(sortByDateValue==="asc"){
    taskFiltered.sort((a,b)=>{return new Date(a.date)- new Date(b.date)})
   }else if(sortByDateValue==="desc"){
    taskFiltered.sort((a,b)=>{return new Date(b.date)-new Date(a.date)})
   }


   //* این قسمت رو شما تابع رو کپی زدید ولی من بهش ورودی دادم تا یهینه تر بشه
   renderTask(taskFiltered)
     
}


//! localStrage  <<<<<<<<<
function saveDarkMode(value){
  localStorage.setItem("DarkMode",value ? "enabled" :"disabled")
}
function loadDarkMode(){
    const getDarkMode = localStorage.getItem("DarkMode")
    if(getDarkMode === "enabled"){
        document.body.classList.add("dark-mode")
    }else{
        document.body.classList.remove("dark-mode")
    }
}

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode")
    saveDarkMode(isDarkMode)
});


exportTasksBtn.addEventListener("click",()=>{
    console.log(window)
    console.log(window.jspdf); // بررسی کنید که مقدار `undefined` نباشد

    const {jsPDF} = window.jspdf
    const doc = new jsPDF()
    let yOffset = 10


    let  taskFiltered = tasks//مقدار پیش فرض

    let searchValue = searchTask.value.toLowerCase().trim();
    let PriorityValue = filterPriority.value;
    let sortByDateValue = sortByDate.value;


    taskFiltered = tasks.filter((task) => { 
     const searchValueFilter = task.title.toLowerCase().includes(searchValue)
     const PriorityValueFilter =   PriorityValue === "" || task.priority === PriorityValue
      return searchValueFilter && PriorityValueFilter
   });
   console.log(taskFiltered)

   if(sortByDateValue==="asc"){
    taskFiltered.sort((a,b)=>{return new Date(a.date)- new Date(b.date)})
   }else if(sortByDateValue==="desc"){
    taskFiltered.sort((a,b)=>{return new Date(b.date)-new Date(a.date)})
   }
    taskFiltered.forEach((task)=>{
        const taskcontent = `${task.title}- Duo: ${task.date}- ${task.priority}`
        doc.text(taskcontent,10,yOffset)
        yOffset= yOffset+ 10
    })

    doc.save("task_filtered.pdf")
})

window.addEventListener("DOMContentLoaded",()=>{
    loadDarkMode();
    
    loadTask()
})