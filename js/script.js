// 유저가 값을 입력한다
// + 버튼을 클릭하면, 할일 추가
// delete 버튼을 누르면 할일 삭제
// check 버튼을 누르면 할일이 끝나면서 밑줄
// ~ing, done 탭을 누르면 언더바 이동
// done 탭은 끝난 아이템만, ~ing 탭은 진행중인 아이템만
// all 탭은 전체 아이템

let taskInput = document.getElementById('task-input');
let addBtn = document.getElementById('add-button');
let taskList = [];

addBtn.addEventListener('click', addTask)

function addTask() {
  let taskContents = taskInput.value;
  taskList.push(taskContents);
  console.log(taskList);
  render();
}

function render (){
  let resultHTML = '';
  for(let i=0;i<taskList.length;i++){
    resultHTML += `
    <div class="task">
    <div>${taskList[i]}</div>
    <div>
      <button>check</button>
      <button>delete</button>
    </div>
  </div>
    `;
  }

  document.getElementById('task-board').innerHTML = resultHTML;

}