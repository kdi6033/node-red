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
const db = firebase.firestore();
//db.settings({ timestampsInSnapshots: true }); 


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
    });
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


//db.collection('cafes').doc('VSxcSxkJQtXddKF9fpz8').update({city:'대전'})
//db.collection('cafes').doc('VSxcSxkJQtXddKF9fpz8').set({name:'옥동자',city:'목포'})

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

