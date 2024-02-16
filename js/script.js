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
  render();
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
      <div class="date-area">
      <section class="date-container">
        <p class="day">${date.slice(5)}</p>
        <div class="day-year">
        <p class="month">${date.slice(1,4)}</p>
        <p class="year">${year}</p>
        </div>
      </section>
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
  startBtn.classList.add('hidden'); // 시작 버튼을 숨깁니다.
  setTimeout(() => {
    startBtn.style.display = 'none'; // 시작 버튼을 완전히 숨깁니다.
    setTimeout(function () {
      inputArea.classList.add('visible'); // 입력 영역을 보이게 합니다.
    })
  }, 300);
  taskInput.focus(); // 할일 입력란에 포커스를 설정합니다.
});

// 입력 값이 없는지 확인하는 함수
function noTxt() {
  if (taskInput.value.trim() === '') { // 입력란이 비어있는지 확인합니다.
    alert('내용을 입력해주세요.'); // 알림창을 통해 메시지를 출력합니다.
    taskInput.focus(); // 할일 입력란에 포커스를 설정합니다.
    return false; // 입력이 유효하지 않음을 반환합니다.
  } else if (taskInput.value.trim().length < 2) { // 입력된 내용의 길이가 2자 미만인지 확인합니다.
    alert('내용은 2자 이상 입력해주세요.'); // 알림창을 통해 메시지를 출력합니다.
    taskInput.focus(); // 할일 입력란에 포커스를 설정합니다.
    return false; // 입력이 유효하지 않음을 반환합니다.
  }
  return true; // 입력이 유효함을 반환합니다.
}

// 엔터 키 입력 시 이벤트
taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') { // 눌린 키가 엔터 키인지 확인합니다.
    if (noTxt()) { // 입력 값이 있는지 확인합니다.
      addTask(); // 할일을 추가하는 함수를 호출합니다.
    }
  }
});

// 추가 버튼 클릭 시 이벤트
addBtn.addEventListener('click', function () {
  if (noTxt()) { // 입력 값이 있는지 확인합니다.
    addTask(); // 할일을 추가하는 함수를 호출합니다.
  }
});

// 탭 클릭 시 이벤트
for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener('click', function (event) { // 각 탭에 클릭 이벤트를 추가합니다.
    filter(event); // 탭을 필터링하는 함수를 호출합니다.
  });
};

// 할일 추가하는 함수
function addTask() {
  if (noTxt()) { // 입력 값이 있는지 확인합니다.
    let taskContents = taskInput.value; // 할일 내용을 가져옵니다.
    let task = {
      id: randomIDGenerate(), // 랜덤한 ID를 생성합니다.
      taskContents: taskContents, // 할일 내용
      isComplete: false // 할일 완료 여부 (기본값은 false)
    }
    taskList.push(task); // 할일을 목록에 추가합니다.
    console.log(taskList); // 현재 할일 목록을 콘솔에 출력합니다.
    render(); // 할일 목록을 화면에 렌더링합니다.

    setTimeout(() => { // 입력 필드를 초기화하는 딜레이를 주고 실행합니다.
      taskInput.value = ''; // 입력 필드를 초기화합니다.
    }, 200);

    taskInput.focus(); // 할일 입력란에 포커스를 설정합니다.
  }
}

// 리스트를 화면에 보여주는 함수
function render() {
  let list = []; // 화면에 보여줄 목록을 저장할 변수입니다.

  // 현재 선택된 탭에 따라 리스트를 구성합니다.
  if (mode === 'all') {
    list = taskList;
  } else if (mode === 'on_going') {
    list = taskList.filter(task => !task.isComplete); // 진행 중인 할일만 필터링
  } else if (mode === 'done') {
    list = taskList.filter(task => task.isComplete); // 완료된 할일만 필터링
  }

  let resultHTML = ''; // 화면에 출력할 HTML을 저장할 변수입니다.

  // 할 일이 없을 때 기본 메모 표시
  if (list.length === 0) {
    // 기본 메모를 HTML 문자열로 추가
    resultHTML += `
<div id ="no-task-area" class="task">
  <div class="no-task-txt">
    <!-- 기본 메모 내용 -->
    <div class="no-tasks"><h5>Note to Self</h5></div>
    <div>진짜 문제는 사람들의 마음이다. <br />
      그것은 절대로 물리학이나 윤리학의 문제가 아니다. <br />
      -아인슈타인</div>
  </div>
</div>
`;
  }



  // 리스트를 순회하면서 HTML을 생성합니다.
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) { // 할일이 완료된 경우
      resultHTML +=
        `
          <div class="task">
          <div class="task-txt">
          <button onclick="toggleComplete('${list[i].id}')"> <!-- 완료 토글 버튼 -->
          <i id="task-cheked"class="fa-solid fa-square-check"></i> <!-- 완료 아이콘 -->
          </button>
        <div class="task-done">${list[i].taskContents}</div> <!-- 완료된 할일 내용 -->
        </div>
        <div>
        <button onclick="editTask('${list[i].id}')"> <!-- 수정 버튼 -->
        <i id="task-edit" class="fa-solid fa-pen-to-square"></i> <!-- 수정 아이콘 -->
        </button>
          <button onclick="deleteTask('${list[i].id}')"> <!-- 삭제 버튼 -->
          <i id="task-delete" class="fa-solid fa-trash"></i> <!-- 삭제 아이콘 -->
          </button>
        </div>
      </div>
            `;
    } else { // 할일이 완료되지 않은 경우
      resultHTML +=
        `
        <div class="task">
        <div class="task-txt">
        <button onclick="toggleComplete('${list[i].id}')"> <!-- 완료 토글 버튼 -->
        <i id="task-chek" class="fa-regular fa-square"></i> <!-- 미완료 아이콘 -->
        </button>
        <div>${list[i].taskContents}</div> <!-- 미완료된 할일 내용 -->
        </div>
        <div>
        <button onclick="editTask('${list[i].id}')"> <!-- 수정 버튼 -->
        <i id="task-edit" class="fa-solid fa-pen-to-square"></i> <!-- 수정 아이콘 -->
        </button>
          <button onclick="deleteTask('${list[i].id}')"> <!-- 삭제 버튼 -->
          <i id="task-delete" class="fa-solid fa-trash"></i> <!-- 삭제 아이콘 -->
          </button>
        </div>
      </div>
        `;
    }
  }
  // 생성된 HTML을 화면에 출력합니다.
  document.getElementById('task-board').innerHTML = resultHTML;
}

function editTask(id) {
  if (id === 'no-task-id') {
    // 기본 메모 수정
    const newTaskContents = prompt('할 일을 수정하세요:', document.querySelector('.no-tasks').textContent.trim());
    if (newTaskContents !== null) {
      document.querySelector('.no-tasks').textContent = newTaskContents;
    }
  } else {
    // 일반 할일 수정
    const task = taskList.find(task => task.id === id);
    if (task) {
      const newTaskContents = prompt('할 일을 수정하세요:', task.taskContents);
      if (newTaskContents !== null) {
        task.taskContents = newTaskContents;
        render(); // 수정 후 목록 다시 렌더링
      }
    }
  }
}

// 할일 삭제 함수
function deleteTask(id) {
  if (id === 'no-task-id') {
    // 기본 메모 삭제
    document.querySelector('#no-task-area').remove(); // 해당 요소를 삭제
  } else {
    // 일반 할일 삭제
    const index = taskList.findIndex(task => task.id === id);
    if (index !== -1) {
      taskList.splice(index, 1);
      render(); // 삭제 후 목록 다시 렌더링
    }
  }
}
// 할일을 완료 또는 미완료로 토글하는 함수
function toggleComplete(id) {
  const task = taskList.find(task => task.id === id);
  if (task) {
    if (id === 'no-task-id') {
      // 기본 메모의 완료 상태를 토글합니다.
      task.isComplete = !task.isComplete;
      if (mode === 'on_going' && task.isComplete) {
        // 진행 중인 항목에서 완료된 항목은 filterList에서 제외합니다.
        const index = filterList.findIndex(taskItem => taskItem.id === id);
        if (index !== -1) {
          filterList.splice(index, 1);
        }
      }
      render(); // 변경된 상태로 목록 다시 렌더링
    } else {
      // 일반 할일의 완료 상태를 토글하고 완료된 상태에서 on_going 탭에 있을 때 숨깁니다.
      task.isComplete = !task.isComplete;
      if (mode === 'on_going' && task.isComplete) {
        // 진행 중인 항목에서 완료된 항목은 filterList에서 제외합니다.
        const index = filterList.findIndex(taskItem => taskItem.id === id);
        if (index !== -1) {
          filterList.splice(index, 1);
        }
      }
      render(); // 변경된 상태로 목록 다시 렌더링
    }
  }
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

// 여기서 문제
// on_going 내에서 수정 버튼, 삭제 버튼 실행 안됨
// on_going 내에서 토글 버튼 체크 시 display : none; 처리가 되어야 함 (왜냐하면 on_going 은 현재 진행중인 task만 보이도록 해야 함)
// 주어진 코드에서 진행 중인 할일과 완료된 할일을 구분하여 보여주는 점 중요
// 또한 수정 및 삭제 버튼이 올바르게 동작해야 함
// 1. 진행 중인 할일과 완료된 할일을 구분하여 보여주는 기능을 추가
// 이를 위해 render() 함수에서 filterList를 사용하여 목록을 필터링
// 2. 수정 및 삭제 버튼이 해당 할일에 대해서만 동작하도록 수정해야 함
// 이를 위해 editTask() 및 deleteTask() 함수를 수정
// 3. 진행 중인 할일에서는 토글 버튼을 클릭했을 때 완료된 할일로 처리되어서는 안 됨
// 토글 버튼을 클릭할 때 해당 버튼이 속한 할일만 처리되도록 수정