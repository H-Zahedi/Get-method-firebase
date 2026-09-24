const usersContainer = document.querySelector('#wrap-users');

const deleteModal = document.querySelector('#delete-modal');
const cancelDeleteBtn = document.querySelector('#cancel-delete-btn');
const confirmDeleteBtn = document.querySelector('#confirm-delete-btn');

const API_URL =
    'https://post-method-ef4b4-default-rtdb.firebaseio.com/users';

let userID = null;


/* =========================
   Page Load
========================= */

window.addEventListener('DOMContentLoaded', () => {
    getAllUsers();
});


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

        const response = await fetch(`${API_URL}.json`);

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();


        /* No users */

        if (!data) {

            usersContainer.innerHTML = `
                <h2 class="empty">
                    No users found
                </h2>
            `;

            return;
        }


        /* Clear old users */

        usersContainer.innerHTML = '';


        const users = Object.entries(data);


        /* Create users */

        users.forEach(([id, userInfo]) => {

            const firstName = escapeHTML(userInfo.firstname || '');
            const lastName = escapeHTML(userInfo.lastname || '');

            const age = userInfo.age || 18;


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

                                ${firstName} ${lastName}

                                <span class="user-age">
                                    ${age}
                                </span>

                            </h2>

                            <p class="user-explanations">
                                User ID: ${escapeHTML(id)}
                            </p>

                        </div>

                    </div>


                    <div class="btn-groups-column">

                        <button
                            type="button"
                            class="edit-user-btn"
                            data-id="${escapeHTML(id)}">
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-user-btn"
                            data-id="${escapeHTML(id)}">
                            Delete
                        </button>

                    </div>

                </div>
                `
            );

        });

    } catch (error) {

        console.error('Error:', error);

        usersContainer.innerHTML = `
            <h2 class="error">
                Error loading users. Please try again.
            </h2>
        `;
    }
}


/* =========================
   Open Delete Modal
========================= */

function openDeleteModal(id) {

    userID = id;

    deleteModal.classList.add('visible');
}


/* =========================
   Close Delete Modal
========================= */

function closeDeleteModal() {

    deleteModal.classList.remove('visible');

    userID = null;
}


/* =========================
   Delete User
========================= */

async function deleteUser() {

    if (!userID) {
        return;
    }


    const idToDelete = userID;


    try {

        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Deleting...';


        const response = await fetch(
            `${API_URL}/${idToDelete}.json`,
            {
                method: 'DELETE'
            }
        );


        if (!response.ok) {
            throw new Error('Failed to delete user');
        }


        closeDeleteModal();

        await getAllUsers();

    } catch (error) {

        console.error('Delete error:', error);

        alert('Failed to delete user. Please try again.');

    } finally {

        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = 'Yes';

    }
}


/* =========================
   Event Delegation
========================= */

usersContainer.addEventListener('click', (event) => {

    const deleteButton =
        event.target.closest('.delete-user-btn');

    const editButton =
        event.target.closest('.edit-user-btn');


    /* Delete */

    if (deleteButton) {

        const id = deleteButton.dataset.id;

        openDeleteModal(id);

        return;
    }


    /* Edit */

    if (editButton) {

        const id = editButton.dataset.id;

        console.log('Edit user:', id);

        // You can add your edit functionality here.
    }

});


/* =========================
   Modal Buttons
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
   Close modal by clicking
   outside the content
========================= */

deleteModal.addEventListener('click', (event) => {

    if (event.target === deleteModal) {
        closeDeleteModal();
    }

});


/* =========================
   Close modal with Escape
========================= */

document.addEventListener('keydown', (event) => {

    if (
        event.key === 'Escape' &&
        deleteModal.classList.contains('visible')
    ) {
        closeDeleteModal();
    }

});


/* =========================
   Escape HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}
