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
