// 유저가 값을 입력한다
// + 버튼을 클릭하면, 할일 추가
// delete 버튼을 누르면 할일 삭제
// check 버튼을 누르면 할일이 끝나면서 밑줄
// 1. check 버튼을 클릭하는 순간 true false // 기본 값은 false
// 2. true면 끝난걸로 간주 > 밑줄
// 3. false면 안끝난 걸로 간주 > 그대로
// ~ing, done 탭을 누르면 언더바 이동
// done 탭은 끝난 아이템만, ~ing 탭은 진행중인 아이템만
// all 탭은 전체 아이템

// HTML 요소 선택
let startBtn = document.getElementById('start-btn');
let inputArea = document.querySelector('.input-area');
let taskInput = document.getElementById('task-input');
let addBtn = document.getElementById('add-btn');
let tabs = document.querySelectorAll('.task-tabs div');
let taskUnderline = document.getElementById('task-underline');
let taskList = [];
let mode = 'all'; // 전역변수로 선언
let filterList = []; // 전역변수로 선언

// 초기 설정
window.onload = function () {
  let initialTab = document.getElementById('all');
  taskUnderline.style.opacity = '1';
  taskUnderline.style.transition = '0.4s ease-in';
  taskUnderline.style.top = '0';
  taskUnderline.style.left = initialTab.offsetLeft + 'px';
  taskUnderline.style.width = initialTab.offsetWidth + 'px';
  taskUnderline.style.height = initialTab.offsetHeight + 'px';
};

// 현재 날짜를 가져오는 함수
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    month: 'short',
    day: '2-digit',
    weekday: 'short'
  };
  const dateStr = currentDate.toLocaleDateString('en-US', options);
  return dateStr;
}

// HTML 요소에 현재 날짜와 요일을 추가하는 함수
function displayCurrentDate() {
  const currentDate = getCurrentDate();
  const weekDay = currentDate.slice(0, 3);
  const date = currentDate.slice(4);
  const year = new Date().getFullYear(); // 연도 가져오기

  // HTML 요소 선택
  let todayDate = document.querySelector('.today-date');
  let todayWeekday = document.querySelector('.today-weekday');
  let dateHTML = '';

  todayWeekday.textContent = weekDay;

  // 생성된 HTML을 화면에 추가
  dateHTML += `
  <div class="date-container">
    <p class="day">${date.slice(5)}</p>
    <div class="day-year">
    <p class="month">${date.slice(1,4)}</p>
    <p class="year">${year}</p>
    </div>
  </div>
  `;

  // todayDate 요소에 생성된 HTML 추가
  todayDate.innerHTML = dateHTML;

  console.log("Date:", date);
  console.log("Day:", weekDay);
}

displayCurrentDate();

// 시작 버튼 클릭 시 이벤트
startBtn.addEventListener('click', function () {
  startBtn.classList.add('hidden');
  setTimeout(() => {
      startBtn.style.display='none';
      setTimeout(function (){
        inputArea.classList.add('visible');
      })
  }, 300);
  taskInput.focus();
});

// 입력 값이 없는지 확인하는 함수
function noTxt() {
  if (taskInput.value.trim() === '') { // 입력이 공백인 경우
    alert('내용을 입력해주세요.'); // 알림을 통해 메시지 출력
    taskInput.focus(); // 포커스를 다시 입력란으로 이동
    return false; // 입력이 유효하지 않음을 반환
  } else if (taskInput.value.trim().length < 2) { // 메모 내용이 2자 미만인 경우
    alert('내용은 2자 이상 입력해주세요.'); // 알림을 통해 메시지 출력
    taskInput.focus(); // 포커스를 다시 입력란으로 이동
    return false; // 입력이 유효하지 않음을 반환
  }
  return true; // 입력이 유효함을 반환
}

// 엔터 키 입력 시 이벤트
taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    if (noTxt()) {
      addTask();
    }
  }
});

// 추가 버튼 클릭 시 이벤트
addBtn.addEventListener('click', function () {
  if (noTxt()) {
    addTask();
  }
});

// 탭 클릭 시 이벤트
for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener('click', function (event) {
    filter(event);
  });
};

// 할일 추가하는 함수
function addTask() {
  if (noTxt()) {
    let taskContents = taskInput.value;
    let task = {
      id: randomIDGenerate(),
      taskContents: taskContents,
      isComplete: false
    }
    taskList.push(task);
    console.log(taskList);
    render();

    setTimeout(() => {
      taskInput.value = '';
    }, 200);

    taskInput.focus(); // 포커스를 다시 입력란으로 이동
  }
}

// 리스트를 화면에 보여주는 함수
function render() {
  // 리스트 선택
  let list = [];

  // 내가 선택한 탭에 따라 리스트 구성
  if (mode === 'all') {
    list = taskList;
  } else if (mode === 'on_going' | mode === 'done') {
    list = filterList
  }

  let resultHTML = '';
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML +=
        `
      <div class="task">
      <div class="task-txt">
      <button onclick="toggleComplete('${list[i].id}')">
      <i id="task-cheked"class="fa-solid fa-square-check"></i>
      </button>
    <div class="task-done">${list[i].taskContents}</div>
    </div>
    <div>
    <button onclick="editTask('${list[i].id}')">
    <i id="task-edit" class="fa-solid fa-trash"></i>
    </button>
      <button onclick="deleteTask('${list[i].id}')">
      <i id="task-delete" class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
      `;
    } else {
      resultHTML +=
        `
    <div class="task">
    <div class="task-txt">
    <button onclick="toggleComplete('${list[i].id}')">
    <i id="task-chek" class="fa-regular fa-square"></i>
    </button>
    <div>${list[i].taskContents}</div>
    </div>
    <div>
    <button onclick="editTask('${list[i].id}')">
    <i id="task-edit" class="fa-solid fa-pen-to-square"></i>
    </button>
      <button onclick="deleteTask('${list[i].id}')">
      <i id="task-delete" class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
    `;
    }
  }
  document.getElementById('task-board').innerHTML = resultHTML;
}

// 완료 토글 함수
function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render()
}

// 할일 수정하는 함수
function editTask(id) {
  let taskToEdit = taskList.find(task => task.id === id);
  let editInput = prompt('할 일을 수정하세요:', taskToEdit.taskContents);
  if (editInput !== null) {
    taskToEdit.taskContents = editInput;
    render();
  }
}

// 할일 삭제하는 함수
function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList.splice(i, 1);
      break;
    }
  }
  render();
}

// 탭 필터링 함수
function filter(event) {
  mode = event.target.id;
  filterList = [];
  if (mode === 'all') {
    render();
  } else if (mode === 'on_going') {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false) {
        filterList.push(taskList[i]);
      }
    }
    render();
  } else if (mode === 'done') {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === true) {
        filterList.push(taskList[i]);
      }
    }
    render();
  }

  taskUnderline.style.opacity = '1';
  taskUnderline.style.transition = '0.4s ease-in';
  taskUnderline.style.top = '0';
  taskUnderline.style.left = event.currentTarget.offsetLeft + 'px';
  taskUnderline.style.width = event.currentTarget.offsetWidth + 'px';
}

// 랜덤 아이디 생성 함수
function randomIDGenerate() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// 입력창 포커스 시 초기화
taskInput.addEventListener('focus', function () {
  taskInput.value = '';
})
