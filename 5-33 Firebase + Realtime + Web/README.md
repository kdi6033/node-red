## 파이어베이스 실시간으로 웹페이지 연동하기 
### Firebase + Realtime + Web 


웹 닉네임 입력 후 앱등록을 누른다.
<img src="https://i2r.link/image/git/5-33-01.png" width="50%" height="50%" title="5-33-01" alt="5-33-01"></img><br/>

firebaseConfig를 복사해서 index.html에 붙여 넣는다.
<img src="https://i2r.link/image/git/5-33-02.png" width="50%" height="50%" title="5-33-02" alt="5-33-02"></img><br/>

index.html
```
<html>
    <head>
        <meta charset="utf-8">
        <script src="https://www.gstatic.com/firebasejs/7.2/firebase.js"></script>
    </head>
    <body>
        테스트1
        <p id="demo">A Paragraph.</p>
        <pre id="object"></pre>
        <button type="button" onclick="myFunction()">데이터 쓰기</button>

        <script>
            var firebaseConfig = {
                apiKey: "AIzaSyBER47eiJoAJfhaP9CdjPuqFkCfPp30UoE",
                authDomain: "webtest-38a08.firebaseapp.com",
                databaseURL: "https://webtest-38a08.firebaseio.com",
                projectId: "webtest-38a08",
                storageBucket: "webtest-38a08.appspot.com",
                messagingSenderId: "468063990879",
                appId: "1:468063990879:web:bff323ac9357a0c23757ea",
                measurementId: "G-8P0W60GG1X"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            // firebase에서 읽기
            var demo = document.getElementById("demo");
            var preObject = document.getElementById("object");
            var dbRef = firebase.database().ref().child("object");
            dbRef.on('value',snap => demo.innerHTML = snap.val());
            dbRef.on('value',snap => {
                preObject.innerText = JSON.stringify(snap.val(),null,3);
            });
        </script>

        <script>
            function myFunction() {
                document.getElementById("demo").innerHTML = "쓰기를 완료";
                alert("쓰기 완료");
                
                //firebase에 쓰기
                var dbRefObject = firebase.database().ref();
                dbRefObject.child("object").set("Some Value");
            }
        </script>
    </body>
</html>
```


