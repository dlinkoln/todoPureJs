/* 
Entry points [@Create],[@All,@Done,@undone],[@Asc,@Desc],[@searchInput],[@CloseBtn(i)]
View points {{TaskAmountDone}},{{TaskAmount}},{{FE Task(i)}},{{ProgressBar}}

//First stage [@Create],[@CloseBtn(i)]
0.Pushing/Getting task from LocalStorage +
1.Creating task from Title,Priority,and push into LocalStorage +
2.Deleting task from {{FE Task(i)}}
    a)Push to LS id of item
    b)Bind item id in data-atribute
3.Check task as completed
//Second stage [@All,@Done,@undone]
0.Creating mutable list,View from mutable list
1.All output
2.Done output,filter tasks from unmutable list to mutable
3.Undone same as 2
//Third stage [@Asc,@Desc]
1.Asc filter
2.Desc filter
//Fourth stage [@searchInput]
0.Creating live search
*/


//ROOT DATA
const createBtn = document.querySelector('.create__btn')
const root = document.querySelector('#list_view')
let tasks = getFromLS() || []


//LS HANDLERS
function pushToLS(tasks) {
    let readyForPush = JSON.stringify(tasks)
    localStorage.setItem("tasks", readyForPush)
}
function getFromLS() {
    return JSON.parse(localStorage.getItem("tasks"))
}

//CREATION FUNC
function createTask() {
    let content = document.querySelector('.create__title').value
    if (content !== '') {
        tasks.push({
            id: Date.now(),
            content: document.querySelector('.create__title').value,
            completed: true,
            priority: document.querySelector('.create__priority').value,
        })
        root.innerHTML = ''
        pushToLS(tasks)
        tasks.forEach(task => {
            renderList(task, root)
        })
    }
    else {
        console.log("Input is empty");
    }
}
function renderList(task, root) {
    let $task = `
    <div class="list__task">
        <p style="${task.completed ? `list__task_done` : ``}">
            ${task.content}
        </p>
        <span class="list__priority">${task.priority}</span>
        <i class="close"  data-close=${task.id}>&times;</i>
    </div>
    `
    root.insertAdjacentHTML('afterbegin', $task)
}
function addListener() {
    Array.from(root.querySelectorAll('.close')).forEach(function (el, index, arr) {
        el.addEventListener("click", () => delEl(el))
    })
}

function delEl(el) {
    let closeData = el.dataset.close;
    tasks = tasks.filter(task => task.id != closeData)
    pushToLS(tasks)
    root.innerHTML = ''
    tasks.forEach((task) => renderList(task, root))
    addListener()
}
//EVENTS
createBtn.onclick = function () {
    createTask();
    addListener()
}
window.onload = function () {
    tasks.forEach((task) => renderList(task, root))
    addListener()
}