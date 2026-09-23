const usersContainer = document.querySelector('#wrap-users');


window.addEventListener('load', () => {

    fetch('https://post-method-ef4b4-default-rtdb.firebaseio.com/users.json')

    .then(response => response.json())

    .then(data => {


        if (!data) {
            usersContainer.innerHTML = `
                <h2 class="empty">
                    No users found
                </h2>
            `;
            return;
        }


        const users = Object.entries(data);


        users.forEach(user => {


            const userInfo = user[1];


            usersContainer.insertAdjacentHTML('beforeend', `

                <div class="user">


                    <div class="user-profile-wrap">


                        <img 
                        class="user-profile"
                        src="https://i.pravatar.cc/150"
                        alt="user image">


                        <div class="user-profile-description">

                            <h2 class="user-profile-name">
                                ${userInfo.firstname} ${userInfo.lastname}

                                <span class="user-age">
                                    18
                                </span>

                            </h2>


                            <p class="user-explanations">
                                User ID: ${user[0]}
                            </p>


                        </div>


                    </div>



                    <div class="btn-groups-column">

                        <button class="edit-user-btn">
                            Edit
                        </button>


                        <button class="delete-user-btn">
                            Delete
                        </button>


                    </div>


                </div>

            `);


        });


    })


    .catch(error => {

        usersContainer.innerHTML = `
            <h2 class="error">
                Error loading users
            </h2>
        `;

        console.log(error);

    });


});
