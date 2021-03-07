const baseUrl = "http://web101.plab.fi/api/todos/";
const apiKey = "34589053487435453öklsdjfldsf";

/** start: api */
//------------------fetch data--------------------------------
async function getTodos() {
    try {
        const response = await axios.get(`${baseUrl}?API_KEY=${apiKey}`);
        return {
            data: response.data.todos,
            status: true,
        };
    } catch (e) {
        return {
            data: e,
            status: false,
        };
    }
}

//------------------create data-------------------------------
async function createTask(task) {
    try {
        const response = await axios.post(
            `${baseUrl}?API_KEY=${apiKey}`,
            {
                body: task,
            }
        );
        return {
            data: response.data.todo,
            status: response.status === 200,
        };
    } catch (e) {
        return {
            data: e.response,
            status: false,
        };
    }
}

//------------------delete data-------------------------------
async function deleteTask(id) {
    try {
        const response = await axios.delete(`${baseUrl}${id}/?API_KEY=${apiKey}`);
        return response.status === 200;
    } catch (e) {
        return false;
    }
}

//------------------path data---------------------------------
async function pathTask(id) {
    try {
        const response = await axios(
            {
                method: 'PATH',
                url: `${baseUrl}${id}/done?API_KEY=${apiKey}`,
            }
        );
        return response.status === 200;
    } catch (e) {
        console.log(e)
        return false;
    }
}

/** end: api */

const list = document.getElementById('list')
const inputTask = document.getElementById('input-task')
const addTaskButton = document.getElementById('add-task-button')
const lineThrough = 'style="text-decoration: line-through;"'

function taskAdder(task) { // adding task to document
    const taskElement = document.createElement("li");
    taskElement.id = `task-${task.id}`;
    taskElement.innerHTML =
        `<button onclick="handleDelete(event, ${task.id})">
    <svg xmlns="http://www.w3.org/2000/svg" width="15.9" height="17.5" viewBox="0 0 15.9 17.5"><g id="trash-2" transform="translate(-2.25 -1.25)"><path id="Path_2584" data-name="Path 2584" d="M3,6H17.4" transform="translate(0 -0.8)"fill="none" stroke="#f16522" stroke-linecap="round" stroke-linejoin="round"stroke-width="1.5" /><path id="Path_2585" data-name="Path 2585"d="M16.2,5.2V16.4A1.6,1.6,0,0,1,14.6,18h-8A1.6,1.6,0,0,1,5,16.4V5.2m2.4,0V3.6A1.6,1.6,0,0,1,9,2h3.2a1.6,1.6,0,0,1,1.6,1.6V5.2"transform="translate(-0.4)" fill="none" stroke="#f16522" stroke-linecap="round"stroke-linejoin="round" stroke-width="1.5" /><line id="Line_26" data-name="Line 26" y2="4.8" transform="translate(8.6 9.2)" fill="none"stroke="#f16522" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><line id="Line_27" data-name="Line 27" y2="4.8" transform="translate(11.8 9.2)" fill="none"stroke="#f16522" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></g></svg>
    </button>
    <span id="body-${task.id}" ${task.done ? lineThrough : ''}>${task.body}</span>
    </div>
    <input id="checkbox-${task.id}" ${task.done ? 'checked' : ''} onchange="handleChange(event, ${task.id})" type="checkbox" />`
    list.appendChild(taskElement)
    document.getElementById(`checkbox-${task.id}`).addEventListener("change", () => {
        if (document.getElementById(`checkbox-${task.id}`).checked) {
            document.getElementById(`body-${task.id}`).style.textDecoration = 'line-through'
        } else {
            document.getElementById(`body-${task.id}`).style.textDecoration = 'none'
        }
    })
}

inputTask.addEventListener('input', () => { // the button cannot be pressed if the text field is empty
    addTaskButton.disabled = inputTask.value === '';
})

//*--------start: add data to dom---------------------------*//
getTodos().then((res) => {
    if (res.status) {
        for (let i = 0; i < res.data.length; i++) {
            taskAdder(res.data[i])
        }
    } else {
        console.log(res.data);
    }
}).catch((err) => {
    console.log(err.response);
})
//*--------end: add data to dom ---------------------------*//

//*--------start: creating a task ---------------------------*//
function handleSubmit(event) {
    event.preventDefault();
    createTask(inputTask.value).then((res) => {
        if (res.status === true) {
            taskAdder(res.data)
            inputTask.value = ''
        } else {
            console.log(res.data);
        }
    }).catch((err) => {
        console.log(err.response);
    })
}

//*--------end: creating a task ---------------------------*//

//*--------start: deleting a task ---------------------------*//
function handleDelete(event, id) {
    event.preventDefault();
    deleteTask(id).then((res) => {
        if (res) {
            document.getElementById(`task-${id}`).remove()
        } else {
            console.log(res)
        }
    })
}

//*--------end: deleting a task ---------------------------*//

//*--------start: done a task ---------------------------*//

function handleChange(event, id) {
    console.log(id)
    event.preventDefault();
    pathTask(id).then((res) => {
        if (res) {
            if (res.data.done) {
                document.getElementById(`checkbox-${id}`).checked = true
                document.getElementById(`body-${id}`).style.textDecoration = 'line-through'
            } else {
                document.getElementById(`checkbox-${id}`).checked = false
                document.getElementById(`body-${id}`).style.textDecoration = 'none'
            }
        } else {
            console.log('something went wrong')
        }
    })
}

//*--------end: done a task ---------------------------*//
