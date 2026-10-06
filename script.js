const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.querySelector("#task-title").value.trim();
    const subject = document.querySelector("#task-subject").value.trim();
    const dueDate = document.querySelector("#yask-due-date").value;

    if (!title || !subject || !dueDate ){
        return;
    }
    const taskItem = document.createElement("li");
    const taskInfo = document.createElement("span");
    taskInfo.textContent = `${title} — ${subject} — Due: ${dueDate}`;
    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = "Mark done";
    completeButton.addEventListener("click", function (){
        taskInfo.style.textDecoration = "line-through"
        taskInfo.style.color = "#718096";
        completeButton.textContent = "Complete";
        completeButton.disabled =true;
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function (){
        taskItem.remove();
    });
    taskItem.append(taskInfo,completeButton,deleteButton);
    taskList.appendChild(taskItem);
    taskForm.reset();

});
const studytForm = document.querySelector("#study-form");
const studyList = document.querySelector("#study-list");

studytForm.addEventListener("submit", function (event){
    event.preventDefault();

    const subject = document.querySelector("#study-subject").value.trim();
    const topic = document.querySelector("#study-topic").value.trim();
    const date = document.querySelector("#study-date").value;
    const time = document.querySelector("#study-time").value;

    if (!subject || !topic || !time){
        return;
    }
     const studyItem = document.createElement("li");

    const studyInfo = document.createElement("span");
    studyInfo.textContent =`${subject} — ${topic} — ${date} at ${time}`;

    deleteButton.type = "button";
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {studyItem.remove();
});

    studyItem.append(studyInfo, deleteButton);
    studyList.appendChild(studyItem);

    studytForm.reset();
})