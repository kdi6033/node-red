//참조문서 https://firebase.google.com/docs/firestore/quickstart

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBleErFQNhVbw9du09sG7ud7xZQL_hVemY",
    authDomain: "webtest02-b4a3b.firebaseapp.com",
    databaseURL: "https://webtest02-b4a3b.firebaseio.com",
    projectId: "webtest02-b4a3b",
    storageBucket: "webtest02-b4a3b.appspot.com",
    messagingSenderId: "389618479649",
    appId: "1:389618479649:web:6931d12b694485ef1e2960",
    measurementId: "G-MYN5L29R6W"
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

/*
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
*/
