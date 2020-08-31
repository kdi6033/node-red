## 크라우드 파이어스토어 웹에서 시작하기 (2)
### Get started with Cloud Firestore | Firebase for Web

웹에서 파이어스토어에 데이타를 쓰고 읽는 방법을 설명한다.<br/>
이 프로그램을 응용해 요리를 주문하고 현재 상태를 읽어오는 방법을 설명한다.

유튜브설명 : https://youtu.be/EmJ3YHEV828 

index.html
```
<html>
    <head>
      <title>Hotdog == sandwichs?</title>
      <script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-firestore.js"></script>
    </head>
    <body>
      <h1 id="hotDogOutput">핫도그 상태:</h1>
      <input type="textfield" id="latestHotDogStatus" />
      <button id="saveButton">저장</button>
      <!--<button id="loadButton">현재상태읽기</button> -->
      <script>"./app.js"</script>
    </body>
</html>
```

app.js
```
//참조문서 https://firebase.google.com/docs/firestore/quickstart

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
var firestore = firebase.firestore();


const docRef = firestore.doc("samples/sndwichData");
const outputHeader = document.querySelector("#hotDogOutput");
const inputTextField = document.querySelector("#latestHotDogStatus");
const saveButton = document.querySelector("#saveButton");
const loadButton = document.querySelector("#loadButton");

saveButton.addEventListener ("click", function(){
    const textToSave = inputTextField.value;
    console.log("I am going to save " + textToSave + " to Firestore");
    docRef.set({
        hotDogStatus: textToSave
    }).then(function() {
        console.log("Status saved!");
    }).catch(function (error) {
        console.log("Got an error: ", error);
    });
});

loadButton.addEventListener("click", function() {
    docRef.get().then(function (doc){
        if(doc && doc.exists) {
            const myData =doc.data();
            outputHeader.innerText = "핫도그 상태: " + myData.hotDogStatus;
        }
    }).catch(function (error) {
        console.log("Got an error", error);
    });
});
```


