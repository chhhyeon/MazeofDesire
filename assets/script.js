let userPoint = document.getElementById('user-point');
let line = document.getElementById('line');
let questionElement = document.getElementById('question');
let questionContainer = document.getElementById('questionContainer');
let answer1 = document.getElementById('answer1');
let answer2 = document.getElementById('answer2');
let leftBarIndicator = document.getElementById('left-bar-indicator');
let rightBarIndicator = document.getElementById('right-bar-indicator');
let popup = document.getElementById('popup');
let restartButton = document.getElementById('restart-button');


let userPath = [];
let answerScore = 0;
let answerTime = 0;
let questionIndex = 0;

let currentX = 0.5;
let currentY = 0.5;


// 배경 이미지의 크기에 맞춰 점의 비율을 동적으로 설정
function updateUserPointPosition(ratioX, ratioY) {

  const backgroundImage = document.querySelector('.background-image');
  const userPoint = document.getElementById('user-point');
  if (!backgroundImage || !userPoint) return;

  // 1. 원본 이미지 크기
  const imgNaturalWidth = backgroundImage.naturalWidth;
  const imgNaturalHeight = backgroundImage.naturalHeight;

  // 2. 렌더된(보이는) 이미지 컨테이너 크기
  const container = backgroundImage.parentElement; // .image-area
  const contRect = container.getBoundingClientRect();
  const contWidth = contRect.width;
  const contHeight = contRect.height;

  // 3. 비율 계산
  const imgAspect = imgNaturalWidth / imgNaturalHeight;
  const contAspect = contWidth / contHeight;

  let drawWidth, drawHeight, offsetX, offsetY;
  if (imgAspect > contAspect) {
    // 이미지가 더 넓음(좌우 잘림)
    drawHeight = contHeight;
    drawWidth = contHeight * imgAspect;
    offsetX = (contWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    // 이미지가 더 높음(상하 잘림)
    drawWidth = contWidth;
    drawHeight = contWidth / imgAspect;
    offsetX = 0;
    offsetY = (contHeight - drawHeight) / 2;
  }

  // 4. 실제 보이는 이미지 내에서의 픽셀 좌표
  const pointX = offsetX + drawWidth * ratioX + userPoint.offsetHeight / 2;
  const pointY = offsetY + drawHeight * ratioY - userPoint.offsetHeight / 2;

  // 5. user-point 위치 지정 (컨테이너 기준 absolute)
  userPoint.style.left = `${pointX}px`;
  userPoint.style.top = `${pointY}px`;

  currentX = ratioX;
  currentY = ratioY;

  // 선의 시작 위치도 초기화
  line.style.height = '200';
  line.style.left = `${pointX}px`;
  line.style.top = `${pointY}px`;
}




// 경로를 따라 점이 이동하도록 함수 설정
function moveAlongPath(path) {
  let totalDuration = 3000;  // 전체 경로 이동 시간 3초
  let stepDuration = totalDuration / path.length;

  let i = 0;
  const interval = setInterval(() => {
    if (i < path.length) {
      // 점을 새로운 위치로 이동
      const { x, y } = path[i];
      updateUserPointPosition(x, y); // 경로에 따라 점의 위치 갱신

      // 경로 기록
      userPath.push({ x, y });


      i++;
    } else {
      // updateUserPointPosition(x, y); // 경로에 따라 점의 위치 갱신
      clearInterval(interval); // 경로 끝에 도달하면 이동 중지
    }
  }, stepDuration); // 1초마다 새로운 위치로 이동
}




const questions = [
  {
    //1
    question: "When invited to a new gathering, how do you react?",
    answers: [
      "I look up the vibe of the group beforehand.", // Imaginary
      "I just go and experience it myself."          // Real
    ],
    values: [6, -6],
    paths: [
      [{ x: 0.474, y: 0.154 }, { x: 0.418, y: 0.154 }, { x: 0.418, y: 0.184 }, { x: 0.442, y: 0.184 },{ x: 0.442, y: 0.219 },{ x: 0.472, y: 0.219 },{ x: 0.472, y: 0.249 } ],
      [{ x: 0.527, y: 0.124 },{ x: 0.527, y: 0.154 }, { x: 0.557, y: 0.154 }]
    ]
  },
  {
    //2
    question: "If a friend you haven't heard from in a while suddenly shares their worries, what do you do?",
    answers: [
      "I just quietly listen to my friend.",         // Real
      "I hesitate, unsure what to say."              // Imaginary
    ],
    values: [-3, 3],
    paths: [
      [{ x: 0.472, y: 0.311 }, { x: 0.496, y: 0.311 }, { x: 0.496, y: 0.373}, { x: 0.527, y: 0.373}, { x: 0.527, y: 0.282}],
      [{ x: 0.418, y: 0.249 }, { x: 0.418, y: 0.219 }, { x: 0.361, y: 0.219 }]
    ]
  },
  {
    //3
    question: "If an ad you saw on your commute keeps lingering in your mind?",
    answers: [
      "I wonder why it bothered me so much.",        // Imaginary
      "I just let it go, thinking it’ll soon be forgotten." // Real
    ],
    values: [4, -2],
    paths: [
      [{ x: 0.306, y: 0.219 }, { x: 0.306, y: 0.342 }, { x: 0.472, y: 0.342 }, { x: 0.497, y: 0.310},{ x: 0.497, y: 0.374},{ x: 0.527, y: 0.374},{ x: 0.527, y: 0.282}],
      [{ x: 0.361, y: 0.246 }, { x: 0.333, y: 0.246 }, { x: 0.333, y: 0.310 }, { x: 0.441, y: 0.310 }, { x: 0.441, y: 0.280 },{ x: 0.471, y: 0.280 },{ x: 0.471, y: 0.310 },{ x: 0.497, y: 0.310 },{ x: 0.497, y: 0.374 },{ x: 0.528, y: 0.374 },{ x: 0.528, y: 0.282 }]
    ]

  },
  {
    //4
    question: "When someone compliments your taste?",
    answers: [
      "I appreciate it, but I know my taste might change.", // Real
      "I’ll probably choose something similar next time."    // Imaginary
    ],
    values: [-5, 7],
    paths: [
      [{ x: 0.554, y: 0.282},{ x: 0.554, y: 0.374},{ x: 0.638, y: 0.374}, { x: 0.638, y: 0.405}],
      [{ x: 0.499, y: 0.282},{ x: 0.499, y: 0.220},{ x: 0.527, y: 0.220},{ x: 0.527, y: 0.189},{ x: 0.555, y: 0.189},{ x: 0.555, y: 0.159},{ x: 0.580, y: 0.159},{ x: 0.580, y: 0.189},{ x: 0.609, y: 0.189},{ x: 0.609, y: 0.278}]
    ]
  },
  {
    //5
    question: "If your plans fall apart, what do you do?",
    answers: [
      "I pause for a moment and observe the situation.",     // Real
      "I make new plans or look for alternatives."           // Imaginary
    ],
    values: [-7, 5],
    paths: [
      [{ x: 0.609, y: 0.308},{ x: 0.589, y: 0.308}, { x: 0.589, y: 0.253},{ x: 0.561, y: 0.253},{ x: 0.561, y: 0.374},{ x: 0.648, y: 0.374},{ x: 0.648, y: 0.404}],
      [{ x: 0.679, y: 0.278},{ x: 0.679, y: 0.221},{ x: 0.710, y: 0.221},{ x: 0.710, y: 0.311},{ x: 0.710, y: 0.311},{ x: 0.680, y: 0.311}, {x: 0.680, y: 0.339}, {x: 0.648, y: 0.339},{x: 0.648, y: 0.404}]
    ]
  },
  {
    //6
    question: "When a friend suddenly suggests a trip?",
    answers: [
      "I first think about the schedule and what to pack.",  // Imaginary
      "I might just go along on a whim."                     // Real
    ],
    values: [4, -6],
    paths: [
      [{x: 0.470, y: 0.404}, {x: 0.470, y: 0.432},{x: 0.380, y: 0.432},{x: 0.380, y: 0.503}],
      [{x: 0.648, y: 0.465}, {x: 0.623, y: 0.465}, {x: 0.623, y: 0.438}, {x: 0.530, y: 0.463},{x: 0.556, y: 0.463},{x: 0.556, y: 0.499}]
    ]
  },
  {
    //7
    question: "When you disagree with someone?",
    answers: [
      "If the discussion drags on, I pause the conversation.", // Real
      "I ask questions to understand their logic."             // Imaginary
    ],
    values: [-2, 2],
    paths: [
      [{x: 0.556, y: 0.528},{x: 0.500, y: 0.528}, {x: 0.500, y: 0.589}],
      [{x: 0.648, y: 0.499},{x: 0.648, y: 0.528},{x: 0.679, y: 0.528},{x: 0.679, y: 0.558},{x: 0.708, y: 0.558}, {x: 0.708, y: 0.592},{x: 0.649, y: 0.562},{x: 0.620, y: 0.562},{x: 0.620, y: 0.530},{x: 0.499, y: 0.530},{x: 0.499, y: 0.589}]
    ]
  },
  {
    //8
    question: "On a day you take a different route home?",
    answers: [
      "I look forward to unexpected sights.",                // Real
      "I feel a bit anxious about the unfamiliar scenery."   // Imaginary
    ],
    values: [-8, 8],
    paths: [
      [{x: 0.407, y: 0.503},{x: 0.407, y: 0.468},{x: 0.494, y: 0.468},{x: 0.494, y: 0.497},{x: 0.470, y: 0.497},{x: 0.470, y: 0.559},{x: 0.497, y: 0.559},{x: 0.497, y: 0.589}],
      [{x: 0.380, y: 0.591},{x: 0.407, y: 0.591},{x: 0.407, y: 0.684},{x: 0.437, y: 0.684},{x: 0.437, y: 0.563},{x: 0.498, y: 0.563},{x: 0.498, y: 0.589},]
    ]
  },
  {
    //9
    question: "After finally making a decision you’ve pondered for a long time?",
    answers: [
      "I keep thinking about why I made that choice.",       // Imaginary
      "I focus on what comes after the decision."            // Real
    ],
    values: [3, -5],
    paths: [
      [{x: 0.473, y: 0.589},{x: 0.473, y: 0.658},{x: 0.497, y: 0.658},{x: 0.497, y: 0.623},{x: 0.527, y: 0.623},{x: 0.527, y: 0.683},{x: 0.584, y: 0.683},{x: 0.584, y: 0.843},{x: 0.555, y: 0.843},{x: 0.555, y: 0.873}],
      [{x: 0.525, y: 0.589},{x: 0.525, y: 0.683},{x: 0.584, y: 0.683},{x: 0.584, y: 0.843},{x: 0.555, y: 0.843},{x: 0.555, y: 0.873}]
    ]
  },
  {
  //10
    question: "When someone brushes off your mistake lightly?",
    answers: [
      "I just let the moment pass.",                         // Real
      "I wonder if they really mean it."                     // Imaginary
    ],
    values: [-3, 7],
    paths: [
      [{x: 0.581, y: 0.873}, {x: 0.581, y: 0.939}],
      [{x: 0.473, y: 0.873}, {x: 0.473, y: 0.846},{x: 0.447, y: 0.846},{x: 0.447, y: 0.903},{x: 0.580, y: 0.903},{x: 0.580, y: 0.939} ]
    ]
  }
  // {
  //   question: "When you suddenly have time alone?",
  //   answers: [
  //     "I spend the time without any particular plan.",       // Real
  //     "I think of things I’ve put off."                      // Imaginary
  //   ],
  //   values: [-2, 2],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When starting a new hobby?",
  //   answers: [
  //     "I research it thoroughly beforehand.",                // Imaginary
  //     "I just try it and learn as I go."                     // Real
  //   ],
  //   values: [4, -6],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When someone places expectations on you?",
  //   answers: [
  //     "I think about how to meet those expectations.",        // Imaginary
  //     "I consider what those expectations mean to me."        // Real
  //   ],
  //   values: [10, -10],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When you receive an unexpected compliment?",
  //   answers: [
  //     "I briefly wonder how I’ll act next time.",            // Real
  //     "I smile, recalling the situation."                    // Imaginary
  //   ],
  //   values: [-2, 3],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When everyone goes quiet in a group setting?",
  //   answers: [
  //     "Silence doesn’t feel awkward to me.",                 // Real
  //     "I mentally prepare what to say next."                 // Imaginary
  //   ],
  //   values: [-5, 5],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When you finish something sooner than planned?",
  //   answers: [
  //     "I look for the next thing to do.",                    // Imaginary
  //     "I take my time to think about what to do with the extra time." // Real
  //   ],
  //   values: [2, -2],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When someone asks you for advice?",
  //   answers: [
  //     "I share my experience.",                              // Imaginary
  //     "I think about what answer they might want."           // Real
  //   ],
  //   values: [4, -6],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When a familiar place has changed?",
  //   answers: [
  //     "I closely observe what’s different.",                 // Imaginary
  //     "I focus on the atmosphere I feel there."              // Real
  //   ],
  //   values: [3, -5],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "On a day when all your plans are canceled?",
  //   answers: [
  //     "I just watch myself doing nothing.",                  // Real
  //     "I make new plans."                                    // Imaginary
  //   ],
  //   values: [-8, 6],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // },
  // {
  //   question: "When a conversation takes an unexpected turn?",
  //   answers: [
  //     "I accept the unexpected direction.",                  // Real
  //     "I try to steer the conversation back."                // Imaginary
  //   ],
  //   values: [-7, 7],
  //   paths: [
  //     [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }],
  //     [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 }]
  //   ]
  // }
  // 질문 추가하기
];


// 질문 표시 함수
function displayQuestion() {
  let currentQuestion = questions[questionIndex];
  questionElement.textContent = currentQuestion.question;
  answer1.textContent = currentQuestion.answers[0];
  answer2.textContent = currentQuestion.answers[1];

  // 선 그리기
  const lineHeight = 50; // 선 길이 (질문까지의 거리 계산 필요)

  line.style.left = `${userPoint.offsetLeft + userPoint.offsetWidth / 2}px`; // 점에서 선의 시작 위치
  line.style.top = `${userPoint.offsetTop + userPoint.offsetHeight / 2 }px`; // 점 아래에서 시작하도록 설정

  if (questionIndex >= 8) {
    const lineBottom = line.offsetTop - questionContainer.offsetHeight - line.offsetHeight; // 선 끝의 위치
    questionContainer.style.top = `${lineBottom - questionContainer.offsetHeight - 20}px`; // 선 위에서 20px 위로
  } else {
    // 선과 질문 컨테이너를 점 아래로 연결
    const lineBottom = line.offsetTop + line.offsetHeight; // 선 끝 위치
    questionContainer.style.top = `${lineBottom + lineHeight}px`; // 선 끝에서 20px 아래로
  }

  questionContainer.style.left = `${line.offsetLeft}px`;

  // 질문 컨테이너의 초기 표시
  questionContainer.style.opacity = '1'; // 보이도록 설정
  questionContainer.style.transition = 'opacity 0.5s ease'; // 애니메이션 효과 추가
}



// 답변 처리 함수
function handleAnswer(selectedIndex, timeTaken) {
  const currentQuestion = questions[questionIndex];
  let answerValue = currentQuestion.values[selectedIndex];
  answerScore += answerValue;
  answerTime = timeTaken;
  
  answerScore += answerValue;
  answerTime = timeTaken;

  // Update the left and right bars
  leftBarIndicator.style.top = `${(answerTime / 7) * 100}%`; // Time based on response time
  rightBarIndicator.style.top = `${(answerScore + 10) * 5}%`; // Scaling the answer score
  
  hideLineAndQuestion(); // 선과 질문 숨기기
  moveUserPoint(selectedIndex, timeTaken);
}

// 선과 질문 숨기기
function hideLineAndQuestion() {
  line.style.height = '0'; // 선 숨기기
  questionContainer.style.opacity = '0'; // 질문 숨기기
  questionContainer.style.transition = 'opacity 0.3s ease'; // 빠르게 사라지게 설정
}


// 점 이동
function moveUserPoint(selectedIndex, timeTaken) {
  const currentQuestion = questions[questionIndex];
  const path = currentQuestion.paths[selectedIndex];
  moveAlongPath(path);

  moveAlongPath(path); // 경로 따라 이동
  setTimeout(() => {
    line.style.left = `${userPoint.offsetLeft + userPoint.offsetWidth / 2}px`; // 점에서 선의 시작 위치
    line.style.top = `${userPoint.offsetTop + userPoint.offsetHeight / 2}px`; // 점 아래에서 시작하도록 설정

    // 질문 컨테이너 위치 갱신
    const lineBottom = line.offsetTop + line.offsetHeight; // 선 끝의 위치
    questionContainer.style.top = `${lineBottom + 20}px`; // 선 끝에서 20px 아래로 설정
    questionContainer.style.left = `${line.offsetLeft}px`; // 선 끝과 가로 정렬

    if (questionIndex < questions.length - 1) {
      if(questionIndex == 6){
        questionIndex += 1;
      }
      if (questionIndex == 5 & selectedIndex == 0){
        questionIndex += 1;
      }
      if(questionIndex == 3 & selectedIndex == 0){
        questionIndex += 1;
      }
      if (questionIndex == 1 & selectedIndex == 0){
        questionIndex += 1;
      }
      if (questionIndex == 0 & selectedIndex == 1){
        questionIndex += 3;
      }
        
      questionIndex++;
      displayQuestion(); // 새로운 질문 표시
    } else {
      showPopup(); // 마지막 질문 후 팝업 표시
    }
  }, 4000); // 경로 이동 후 새로운 질문 표시
}



// 팝업 표시
function showPopup() {
  popup.style.display = 'block';

  // 경로 스케치 SVG 그리기
  const svg = document.getElementById('path-sketch');
  svg.innerHTML = ''; // 기존 경로 초기화

  // 이미지 영역 크기 기준
  const imageArea = document.querySelector('.image-area');
  const rect = imageArea.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  if (userPath.length > 1) {
    // polyline points 생성
    const points = userPath.map(p => `${p.x * w},${p.y * h}`).join(' ');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', points);
    poly.setAttribute('stroke', '#FBFF00');
    poly.setAttribute('stroke-width', '4');
    poly.setAttribute('fill', 'none');
    svg.appendChild(poly);
  }
}



// 게임 리셋
function restartGame() {
  currentX = 0.563;
  currentY = 0.07;
  updateUserPointPosition(currentX, currentY);
  
  questionIndex = 0;
  answerScore = 0;
  answerTime = 0;
  userPath = []; // 경로 초기화
  displayQuestion();
  popup.style.display = 'none';
}



// 답변 클릭 이벤트 처리
answer1.addEventListener('click', () => handleAnswer(0, Math.random() * 7)); // 랜덤 시간 예시
answer2.addEventListener('click', () => handleAnswer(1, Math.random() * 7)); // 랜덤 시간 예시

restartButton.addEventListener('click', restartGame);



//////////////////////////////////////////////////////////////////////////////



// 5초 후에 그래픽3과 4가 사라지고, 메인 화면으로 돌아오게 하기 위해 타이머를 설정
setTimeout(function() {
    document.querySelector('.overlay').style.visibility = 'hidden';
    document.querySelector('.sketch').style.visibility = 'hidden';
    document.querySelector('.title').style.visibility = 'hidden';
}, 3000);


const backgroundImage = document.querySelector('.background-image');



document.addEventListener('DOMContentLoaded', function() {
  const imageArea = document.querySelector('.image-area');
  const mousePositionDisplay = document.getElementById('mouse-position');

  if (imageArea && mousePositionDisplay) {
    imageArea.addEventListener('mousemove', function(event) {
      const rect = imageArea.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const ratioX = x / rect.width;
      const ratioY = y / rect.height;

      // 콘솔로 값도 확인
      // console.log('mousemove', {x, y, ratioX, ratioY, rect});

      if (ratioX >= 0 && ratioX <= 1 && ratioY >= 0 && ratioY <= 1) {
        mousePositionDisplay.textContent = `X: ${ratioX.toFixed(3)}, Y: ${ratioY.toFixed(3)}`;
      } else {
        mousePositionDisplay.textContent = `X: -, Y: -`;
      }
    });

    imageArea.addEventListener('mouseleave', function() {
      mousePositionDisplay.textContent = `X: -, Y: -`;
    });
  } else {
    console.error('imageArea or mousePositionDisplay not found!');
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const about = document.getElementById('about');
  const aboutpopup = document.getElementById('aboutpopup');
  const aboutpopupContent = document.getElementById('aboutpopup-content');

  if (about && aboutpopup && aboutpopupContent) {
    about.addEventListener('click', function() {
      aboutpopup.style.display = 'block';
    });

    aboutpopup.addEventListener('click', function(event) {
      if (!aboutpopupContent.contains(event.target)) {
        aboutpopup.style.display = 'none';
      }
    });
  } else {
    console.error('about, aboutpopup, or aboutpopupContent not found!');
  }


  //초반 그래픽 띄우기
  const tndncy = document.querySelector('.rsps_tndncy');
  const spd = document.querySelector('.rsps_spd');
  const left_ind = document.querySelector('.left-bar-indicator')
  const right_ind = document.querySelector('.right-bar-indicator')
  if (tndncy) {
    // 페이지 로드 시 z-index를 3으로
    tndncy.style.zIndex = 3;
    spd.style.zIndex = 3;
    left_ind.style.zIndex = 3;
    right_ind.style.zIndex = 3;
    // 3초 후 z-index를 2로 변경
    setTimeout(function() {
      tndncy.style.zIndex = 2;
      spd.style.zIndex = 2;
      left_ind.style.zIndex = 2;
      right_ind.style.zIndex = 2;
    }, 3000);
  }
});



// 게임 시작

updateUserPointPosition(0.563, 0.07);
window.addEventListener('resize', () => updateUserPointPosition(currentX, currentY));
backgroundImage.onload = () => updateUserPointPosition(currentX, currentY);
if (backgroundImage.complete) backgroundImage.onload();

displayQuestion();








