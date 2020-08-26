## 파이어스토어 웹으로 매장관리 프로그램 만들기 (1)

웹에서 파이어스토어를 이용해 실시간으로 매장관리 프로그램을 만든다.<br/>
이 프로그램을 따라하면 파이어스토어의 데이터를 관리하는 기본 명령을 학습 할 수 있습니다.
본 과정은 아래 유튜브를 참조해 설명하오니 여기서 부족한 설명은 아래 유튜브를 참조 하세요. 
참조유튜브 : https://www.youtube.com/watch?v=4d-gIPGzmK4&list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB 
구글 파이어스토어 메뉴얼 : https://firebase.google.com/docs/firestore

1. 프로그램 구조와 파이어스토어 연결
2. 데이터 읽기와 웹에 기록하기
3. 데이타 저장하기
4. 데이타 삭제하기
5. 데이타 쿼리 사용하기
6. 데이타 순서대로 나열하기 (order, sort)
7. 실시간 데이타 처리 (Real-time Data)
8. 데이타 update와 set


## 초기 시작파일
index.html
```
<html>
    <head>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>

        <h1>크라우드 까페</h1>

        <div class="content">

            <form id="add-cafe-form">

            </form>

            <ul id="cafe-list"></ul>

        </div>
    </body>
</html>
```

## 최종 완성 파일
index.html
```
<html>
    <head>
        <script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-firestore.js"></script>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>

        <h1>크라우드 까페</h1>

        <div class="content">

            <form id="add-cafe-form">
                <input type="text" name="name" placeholder="까페 이름">
                <input type="text" name="city" placeholder="까페 도시">
                <button>까페추가</button>
            </form>

            <ul id="cafe-list"></ul>

        </div>
        <script src="app.js"></script>
    </body>
</html>
```

app.js
```
// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCek0u4PRS4bAuMPLIvCz3oq0YL4zeJO7Q",
    authDomain: "webtest02-727d2.firebaseapp.com",
    databaseURL: "https://webtest02-727d2.firebaseio.com",
    projectId: "webtest02-727d2",
    storageBucket: "webtest02-727d2.appspot.com",
    messagingSenderId: "920162336844",
    appId: "1:920162336844:web:3ccbaed05fa2f7e845f4e9",
    measurementId: "G-ELH2QQ922H"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create element & render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);
    //console.log(li);
    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute('data-id');
      db.collection('cafes').doc(id).delete();
    })

}

//getting data
/*
db.collection('cafes').where('city','==','서울').orderBy('name').get().then(snapshot => {
    //console.log(snapshot.docs);
    snapshot.docs.forEach(doc => {
        //console.log(doc.data());
        renderCafe(doc);
    });
});
*/

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  //console.log(changes);
  changes.forEach(change => {
      console.log(change.doc.data());
      if(change.type == 'added'){
          renderCafe(change.doc);
      } else if (change.type == 'removed'){
          let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
          cafeList.removeChild(li);
      }
  });
});

//db.collection('cafes').doc('PKMqsKn6BfhLGpvR5VdW').update({city:'울산'})
//db.collection('cafes').doc('PKMqsKn6BfhLGpvR5VdW').set({name:'옥동자',city:'목포'})

// saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('cafes').add({
      name: form.name.value,
      city: form.city.value
  });
  form.name.value = '';
  form.city.value = '';
});
```

