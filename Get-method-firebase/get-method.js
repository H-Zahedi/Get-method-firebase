/* =========================
DOM Elements
========================= */

const usersContainer =
document.querySelector('#wrap-users');

const deleteModal =
document.querySelector('#delete-modal');

const cancelDeleteBtn =
document.querySelector('#cancel-delete-btn');

const confirmDeleteBtn =
document.querySelector('#confirm-delete-btn');

const editModal =
document.querySelector('#edit-modal');

const cancelEditBtn =
document.querySelector('#cancel-edit-btn');

const editUserForm =
document.querySelector('#edit-user-form');

const firstnameInput =
document.querySelector('.firstname');

const lastnameInput =
document.querySelector('.lastname');

const passwordInput =
document.querySelector('.password');

const updateUserBtn =
document.querySelector('#update-user-btn');

/* =========================
Firebase API
========================= */

const API_URL =
'https://post-method-ef4b4-default-rtdb.firebaseio.com/users';

/* =========================
Current User ID
========================= */

let userID = null;

/* =========================
Page Load
========================= */

window.addEventListener(
'DOMContentLoaded',
() => {

    getAllUsers();

}


);

/* =========================
Get All Users
========================= */

async function getAllUsers() {

usersContainer.innerHTML = `
    <h2 class="loading">
        Loading users...
    </h2>
`;


try {

    const response =
        await fetch(`${API_URL}.json`);


    if (!response.ok) {

        throw new Error(
            'Failed to fetch users'
        );

    }


    const data =
        await response.json();


    /* =========================
       No Users
    ========================== */

    if (
        !data ||
        typeof data !== 'object'
    ) {

        usersContainer.innerHTML = `
            <h2 class="empty">
                No users found
            </h2>
        `;

        return;
    }


    const users =
        Object.entries(data);


    if (users.length === 0) {

        usersContainer.innerHTML = `
            <h2 class="empty">
                No users found
            </h2>
        `;

        return;
    }


    /* =========================
       Clear Container
    ========================== */

    usersContainer.innerHTML = '';


    /* =========================
       Create User Cards
    ========================== */

    users.forEach(
        ([id, userInfo]) => {

            const firstName =
                escapeHTML(
                    userInfo?.firstname || ''
                );


            const lastName =
                escapeHTML(
                    userInfo?.lastname || ''
                );


            const age =
                escapeHTML(
                    userInfo?.age ?? '18'
                );


            const password =
                escapeHTML(
                    userInfo?.password || 'No password'
                );


            usersContainer.insertAdjacentHTML(
                'beforeend',
                `
                <div class="user">

                    <div class="user-profile-wrap">

                        <img
                            class="user-profile"
                            src="https://i.pravatar.cc/150?u=${encodeURIComponent(id)}"
                            alt="${firstName} ${lastName}"
                            loading="lazy"
                        >


                        <div class="user-profile-description">

                            <h2 class="user-profile-name">

                                ${firstName}
                                ${lastName}

                                <span class="user-age">
                                    ${age}
                                </span>

                            </h2>


                            <p class="user-explanations">
                                Password: ${password}
                            </p>

                        </div>

                    </div>


                    <div class="btn-groups-column">

                        <button
                            type="button"
                            class="edit-user-btn"
                            data-id="${escapeHTML(id)}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-user-btn"
                            data-id="${escapeHTML(id)}"
                        >
                            Delete
                        </button>

                    </div>

                </div>
                `
            );

        }
    );

} catch (error) {

    console.error(
        'Get users error:',
        error
    );


    usersContainer.innerHTML = `
        <h2 class="error">
            Error loading users.
            Please try again.
        </h2>
    `;

}


}

/* =========================
Open Delete Modal
========================= */

function openDeleteModal(id) {

userID = id;

deleteModal.classList.add(
    'visible'
);


}

/* =========================
Close Delete Modal
========================= */

function closeDeleteModal() {

deleteModal.classList.remove(
    'visible'
);

userID = null;


}

/* =========================
Delete User
========================= */

async function deleteUser() {

if (!userID) {

    return;
}


const idToDelete =
    userID;


try {

    confirmDeleteBtn.disabled =
        true;


    confirmDeleteBtn.textContent =
        'Deleting...';


    const response =
        await fetch(
            `${API_URL}/${encodeURIComponent(idToDelete)}.json`,
            {
                method: 'DELETE'
            }
        );


    if (!response.ok) {

        throw new Error(
            'Failed to delete user'
        );

    }


    closeDeleteModal();


    await getAllUsers();


} catch (error) {

    console.error(
        'Delete error:',
        error
    );


    alert(
        'Failed to delete user. Please try again.'
    );


} finally {

    confirmDeleteBtn.disabled =
        false;


    confirmDeleteBtn.textContent =
        'Yes';

}


}

/* =========================
Open Edit Modal
========================= */

async function openEditModal(id) {

userID = id;


try {

    const response =
        await fetch(
            `${API_URL}/${encodeURIComponent(id)}.json`
        );


    if (!response.ok) {

        throw new Error(
            'Failed to get user information'
        );

    }


    const userData =
        await response.json();


    if (!userData) {

        throw new Error(
            'User not found'
        );

    }


    /* =========================
       Fill Form
    ========================== */

    firstnameInput.value =
        userData.firstname || '';


    lastnameInput.value =
        userData.lastname || '';


    passwordInput.value =
        userData.password || '';


    /* =========================
       Open Modal
    ========================== */

    editModal.classList.add(
        'visible'
    );


    firstnameInput.focus();


} catch (error) {

    console.error(
        'Open edit error:',
        error
    );


    alert(
        'Failed to load user information. Please try again.'
    );


    userID = null;

}


}

/* =========================
Close Edit Modal
========================= */

function closeEditModal() {

editModal.classList.remove(
    'visible'
);


editUserForm.reset();


userID = null;


}

/* =========================
Update User
========================= */

async function updateUser(event) {

event.preventDefault();


if (!userID) {

    alert(
        'User ID not found.'
    );

    return;
}


const firstName =
    firstnameInput.value.trim();


const lastName =
    lastnameInput.value.trim();


const password =
    passwordInput.value.trim();


/* =========================
   Validation
========================== */

if (!firstName || !lastName) {

    alert(
        'Firstname and lastname are required.'
    );

    return;
}


/* =========================
   New Data
========================== */

const userNewData = {

    firstname: firstName,

    lastname: lastName

};


/*
   Update password only
   when it is not empty.
*/

if (password) {

    userNewData.password =
        password;

}


const idToUpdate =
    userID;


try {

    updateUserBtn.disabled =
        true;


    updateUserBtn.textContent =
        'Updating...';


    const response =
        await fetch(
            `${API_URL}/${encodeURIComponent(idToUpdate)}.json`,
            {
                method: 'PATCH',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(
                        userNewData
                    )
            }
        );


    if (!response.ok) {

        throw new Error(
            'Failed to update user'
        );

    }


    const updatedUser =
        await response.json();


    console.log(
        'Updated user:',
        updatedUser
    );


    /* =========================
       Close Modal
    ========================== */

    closeEditModal();


    /* =========================
       Refresh Users
    ========================== */

    await getAllUsers();


} catch (error) {

    console.error(
        'Update error:',
        error
    );


    alert(
        'Failed to update user. Please try again.'
    );


} finally {

    updateUserBtn.disabled =
        false;


    updateUserBtn.textContent =
        'Update';

}


}

/* =========================
Users Event Delegation
========================= */

usersContainer.addEventListener(
'click',
(event) => {

    const deleteButton =
        event.target.closest(
            '.delete-user-btn'
        );


    const editButton =
        event.target.closest(
            '.edit-user-btn'
        );


    /* =========================
       Delete
    ========================== */

    if (deleteButton) {

        const id =
            deleteButton.dataset.id;


        openDeleteModal(id);

        return;
    }


    /* =========================
       Edit
    ========================== */

    if (editButton) {

        const id =
            editButton.dataset.id;


        openEditModal(id);

        return;
    }

}


);

/* =========================
Delete Modal Buttons
========================= */

cancelDeleteBtn.addEventListener(
'click',
closeDeleteModal
);

confirmDeleteBtn.addEventListener(
'click',
deleteUser
);

/* =========================
Edit Modal Buttons
========================= */

cancelEditBtn.addEventListener(
'click',
closeEditModal
);

/* =========================
Edit Form Submit
========================= */

editUserForm.addEventListener(
'submit',
updateUser
);

/* =========================
Close Delete Modal
Outside Click
========================= */

deleteModal.addEventListener(
'click',
(event) => {

    if (
        event.target === deleteModal
    ) {

        closeDeleteModal();

    }

}


);

/* =========================
Close Edit Modal
Outside Click
========================= */

editModal.addEventListener(
'click',
(event) => {

    if (
        event.target === editModal
    ) {

        closeEditModal();

    }

}


);

/* =========================
Escape Key
========================= */

document.addEventListener(
'keydown',
(event) => {

    if (
        event.key !== 'Escape'
    ) {

        return;
    }


    if (
        deleteModal.classList.contains(
            'visible'
        )
    ) {

        closeDeleteModal();

        return;
    }


    if (
        editModal.classList.contains(
            'visible'
        )
    ) {

        closeEditModal();

    }

}


);

/* =========================
Escape HTML
========================= */

function escapeHTML(value) {

return String(value)

    .replace(
        /&/g,
        '&amp;'
    )

    .replace(
        /</g,
        '&lt;'
    )

    .replace(
        />/g,
        '&gt;'
    )

    .replace(
        /"/g,
        '&quot;'
    )

    .replace(
        /'/g,
        '&#039;'
    );


}