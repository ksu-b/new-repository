// document.addEventListener('DOMContentLoaded', () => {
//     let form = document.getElementById('signup-form');
//     form && form.addEventListener('submit', async event => {
//         event.preventDefault();
//         try {
//             let elements = event.target.elements;
//             let response = await fetch(event.target.action, {
//                 method: 'post',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     username: elements.username.value,
//                     email: elements.email.value,
//                     password: elements.password.value
//                 })
//             });

//             let resp = await response.json();
//             if (resp.isOk === false) {
                
//             }

//             //window.location = "/";
//         } catch (e) {
//             debugger;
//             console.log(e);
//         }
//     })
// });