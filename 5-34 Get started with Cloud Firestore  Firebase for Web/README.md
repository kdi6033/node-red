## 크라우드 파이어스토어 웹에서 시작하기 (1)
### Get started with Cloud Firestore | Firebase for Web

웹에서 파이어스토어에 데이타를 쓰고 읽는 방법을 설명한다.<br/>

유튜브설명 : https://youtu.be/EmJ3YHEV828 

index.html
```
<html>
    <head>
        <script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-firestore.js"></script>
    </head>
    <body>
        <h1>Firestore 테스트</h1>
        <script>
            // Your web app's Firebase configuration
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
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            var db = firebase.firestore();
          </script>
          <script src="app.js"></script>

    </body>
</html>
```

app.js
```
//참조문서 https://firebase.google.com/docs/firestore/quickstart
/*
// 데이타 쓰기
db.collection("users").add({
    first: "Ada",
    middle: "Mathison",
    last: "Lovelace",
    born: 1815
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

// 데이타 읽기
db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
*/

// 데이타 쓰기
const docRef=db.doc("users/nameDoc");
docRef.set({
   first: "Alan",
   middle: "Mathison",
   last: "Turing",
   born: 1912
});
```


