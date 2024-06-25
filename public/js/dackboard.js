// Your Firebase configuration

var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://salexemrduong-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const addCarForm = document.getElementById('addCarForm');
const updateCarForm = document.getElementById('updateCarForm');
const deleteCarForm = document.getElementById('deleteCarForm');

document.addEventListener('DOMContentLoaded', () => {

    isTokenValid("token");
    const addBtn = document.getElementById('addBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');


    const addCarForm = document.getElementById('addCarForm');
    const updateCarForm = document.getElementById('updateCarForm');
    const deleteCarForm = document.getElementById('deleteCarForm');


    const forms = [addCarForm, updateCarForm, deleteCarForm];

    function hideAllForms() {
        forms.forEach(form => form.classList.add('hidden'));
    }

    function showForm(form) {
        hideAllForms();
        form.classList.remove('hidden');
    }

    addBtn.addEventListener('click', () => {
        showForm(addCarForm);
    });

    updateBtn.addEventListener('click', () => {
        showForm(updateCarForm);
    });

    deleteBtn.addEventListener('click', () => {
        showForm(deleteCarForm);
    });



    // Default view hides all forms
    hideAllForms();
});


/// Function to show alerts
function showAlert(message) {
    alert(message); // Simple alert, replace with a custom alert if needed
}

// Add car to Firebase when form is submitted
document.getElementById('addCarForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    isTokenValid("token");

    // Check if password is correct
    const password = prompt('Nhập mật khẩu:');

    // Get the password from Firebase
    const snapshot = await firebase.database().ref('user').once('value');
    const userData = snapshot.val();

    if (password === userData.pass) {
        const key = document.getElementById('key').value;
        const name = document.getElementById('name').value;
        const oldPrice = document.getElementById('oldPrice').value;
        const newPrice = document.getElementById('newPrice').value;
        const category = document.getElementById('category').value;
        const power = document.getElementById('power').value;
        const payload = document.getElementById('payload').value;
        const size = document.getElementById('size').value;
        const totalpayload = document.getElementById('totalpayload').value;
        const carbin = document.getElementById('carbin').value;
        const imageLink = document.getElementById('imageLink').value;
        const imageLink2 = document.getElementById('imageLink2').value;
        const imageLink3 = document.getElementById('imageLink3').value;
        const imageLink4 = document.getElementById('imageLink4').value;
        const detail = document.getElementById('detail').value;

        // Check if all required fields are filled
        if (!key || !name || !oldPrice || !newPrice || !category) {
            alert('Vui lòng điền đủ thông tin.');
            return;
        }

        // Check if key already exists within the category
        const carSnapshot = await database.ref(`cars/${key}`).once('value');
        if (carSnapshot.exists()) {
            alert('Key này đã được sử dụng.');
        } else {
            // Add data to Firebase under the category
            await database.ref(`cars/${key}`).set({
                name: name,
                oldPrice: oldPrice,
                newPrice: newPrice,
                category: category,
                power: power,
                payload: payload,
                totalpayload: totalpayload,
                size: size,
                carbin: carbin,
                imageLink: imageLink,
                imageLink2: imageLink2,
                imageLink3: imageLink3,
                imageLink4: imageLink4,
                detail: detail
            });
            alert('Thêm xe thành công.');
            loadCarList(); // Update car list after adding
            document.getElementById('addCarForm').reset();
        }
    } else {
        alert('Mật khẩu không đúng.');
    }
});
// Update car in Firebase when form is submitted
document.getElementById('updateCarForm').addEventListener('submit', async (e) => {
    isTokenValid("token");
    e.preventDefault();
    // Check if password is correct
    const password = prompt('Nhập mật khẩu:');

    // Get the password from Firebase
    const snapshot = await firebase.database().ref('user').once('value');
    const userData = snapshot.val();

    if (password === userData.pass) {
        const key = document.getElementById('updateKey').value;
        const name = document.getElementById('updateName').value;
        const oldPrice = document.getElementById('updateOldPrice').value;
        const newPrice = document.getElementById('updateNewPrice').value;
        const category = document.getElementById('updateCategory').value;
        const power = document.getElementById('updatePower').value;
        const payload = document.getElementById('updatepayload').value;
        const size = document.getElementById('updatesize').value;
        const totalpayload = document.getElementById('updatetotalpayload').value;
        const carbin = document.getElementById('updatecarbin').value;
        const imageLink = document.getElementById('updateImageLink1').value;
        const imageLink2 = document.getElementById('updateImageLink2').value;
        const imageLink3 = document.getElementById('updateImageLink3').value;
        const imageLink4 = document.getElementById('updateImageLink4').value;
        const updatedetail = document.getElementById('updatedetail').value;

        // Check if all fields are filled
        if (!key || !name || !oldPrice || !newPrice || !category) {
            showAlert('Vui lòng điền đủ thông tin.');
            return;
        }

        // Check if key exists within the category
        database.ref(`cars/${key}`).once('value', (snapshot) => {
            if (!snapshot.exists()) {
                showAlert('Key này không tồn tại.');
            } else {
                // Update data in Firebase under the category
                database.ref(`cars/${key}`).update({
                    name: name,
                    oldPrice: oldPrice,
                    newPrice: newPrice,
                    category: category,
                    power: power,
                    payload: payload,
                    totalpayload: totalpayload,
                    size: size,
                    carbin: carbin,
                    imageLink: imageLink,
                    imageLink2: imageLink2,
                    imageLink3: imageLink3,
                    imageLink4: imageLink4,
                    detail: updatedetail
                }).then(() => {
                    loadCarList(); // Update car list after updating
                });
                alert('Sửa thành công.');
                document.getElementById('updateCarForm').reset();
            }
        });
    } else {
        alert('Mật khẩu không đúng.');
    }

});

// Function to add a car to the table
// Function to add a car to the table
function addCarToTable(key, car) {
    const tableBody = document.getElementById('carList');
    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }
    const row = tableBody.insertRow();
    row.classList.add('clickable-row'); // Add class for clickable rows
    row.dataset.key = key; // Store the key as a data attribute on the row

    row.innerHTML = `
        <td>${key}</td>
        <td>${car.name}</td>
        <td>${car.oldPrice}</td>
        <td>${car.newPrice}</td>
        <td>${car.category}</td>
        <td>${car.power}</td>
        <td>${car.payload}</td>
        <td>${car.size}</td>
    `;
}

// Event listener to populate update form when row is clicked
document.addEventListener('click', function (event) {
    const row = event.target.closest('tr.clickable-row');
    if (row) {
        const key = row.dataset.key;

        database.ref('cars/' + key).once('value').then((snapshot) => {
            const car = snapshot.val();
            document.getElementById('updateKey').value = key;
            document.getElementById('updateName').value = car.name;
            document.getElementById('updateOldPrice').value = car.oldPrice;
            document.getElementById('updateNewPrice').value = car.newPrice;
            document.getElementById('updateCategory').value = car.category;
            document.getElementById('updatePower').value = car.power;
            document.getElementById('updatepayload').value = car.payload;
            document.getElementById('updatetotalpayload').value = car.totalpayload;
            document.getElementById('updatesize').value = car.size;
            document.getElementById('updatecarbin').value = car.carbin;
            document.getElementById('updateImageLink1').value = car.imageLink;
            document.getElementById('updateImageLink2').value = car.imageLink2;
            document.getElementById('updateImageLink3').value = car.imageLink3;
            document.getElementById('updateImageLink4').value = car.imageLink4;
            document.getElementById('updatedetail').value = car.detail;


            // Show the update form
            showForm(updateCarForm);
        }).catch((error) => {
            console.error('Error fetching car data:', error);
        });
    }
});
function clearCarTable() {
    const tableBody = document.getElementById('carList');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}

// Function to load the car list from the database
function loadCarList() {
    clearCarTable();
    const carsRef = database.ref('cars');
    carsRef.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const car = childSnapshot.val();
            addCarToTable(key, car);
        });
    });
}

// Initial load of the car list
loadCarList();


// Function to add a car to the table



// Delete car from Firebase when form is submitted
deleteCarForm.addEventListener('submit', async (e) => {
    isTokenValid("token");
    e.preventDefault();

    const password = prompt('Nhập mật khẩu:');

    // Get the password from Firebase
    const snapshot = await firebase.database().ref('user').once('value');
    const userData = snapshot.val();

    if (password === userData.pass) {
        const key = document.getElementById('deleteKey').value;
        if (!key) {
            showAlert('Vui lòng điền đủ thông tin.');
            return;
        }
        // Check if key exists
        database.ref('cars/' + key).once('value', (snapshot) => {
            if (!snapshot.exists()) {
                showAlert('Key này không tồn tại.');
            } else {
                // Delete data from Firebase
                database.ref('cars/' + key).remove().then(() => {
                    loadCarList(); // Reload car list after deleting
                });
                alert('Xóa thành công.');
                deleteCarForm.reset();
            }
        });
    }else {
        alert('Mật khẩu không đúng.');
    }

});

function displayCategories() {
    const viewCategoryForm = document.getElementById('viewCategoryForm');
    const categoryList = document.getElementById('categoryList');

    // Clear any existing categories in the list
    categoryList.innerHTML = '';

    // Fetch categories from Firebase
    database.ref('DanhMuc').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const category = childSnapshot.val();
            const categoryKey = childSnapshot.key;

            // Create a div element for each category
            const categoryItem = document.createElement('div');
            categoryItem.textContent = `${categoryKey}: ${category.name}`;
            categoryList.appendChild(categoryItem);
        });

        // Show the category form
        viewCategoryForm.classList.remove('hidden');
    }).catch(error => {
        console.error('Error fetching categories:', error);
    });
}





function fetchCategories(callback) {
    database.ref('DanhMuc').once('value', (snapshot) => {
        const categories = [];
        snapshot.forEach((childSnapshot) => {
            const category = childSnapshot.val();
            categories.push(category.name);
        });
        callback(categories);
    }).catch(error => {
        console.error('Error fetching categories:', error);
        callback([]);
    });
}




// Sự kiện khi click vào input "Danh Mục"
document.getElementById('category').addEventListener('click', function () {
    const dropdownContent = document.getElementById('dropdownContent');
    dropdownContent.innerHTML = ''; // Xóa các lựa chọn hiện tại

    fetchCategories(function (categories) {
        categories.forEach((category, index) => { // Sửa 'categorie' thành 'categories'
            const option = document.createElement('div');
            option.textContent = `${category}`;
            option.addEventListener('click', function () {
                document.getElementById('category').value = category; // Đặt giá trị cho input khi chọn lựa chọn
                dropdownContent.style.display = 'none'; // Ẩn dropdown sau khi chọn
            });
            dropdownContent.appendChild(option);
        });

        // Hiển thị dropdown
        dropdownContent.style.display = 'block';
    });
});
document.getElementById('updateCategory').addEventListener('click', function () {
    const dropdownContent = document.getElementById('dropdownContent1');
    dropdownContent.innerHTML = ''; // Xóa các lựa chọn hiện tại

    fetchCategories(function (categories) {
        categories.forEach((category, index) => { // Sửa 'categorie' thành 'categories'
            const option = document.createElement('div');
            option.textContent = `${category}`;
            option.addEventListener('click', function () {
                document.getElementById('updateCategory').value = category; // Đặt giá trị cho input khi chọn lựa chọn
                dropdownContent.style.display = 'none'; // Ẩn dropdown sau khi chọn
            });
            dropdownContent.appendChild(option);
        });

        // Hiển thị dropdown
        dropdownContent.style.display = 'block';
    });
});


// Đóng dropdown khi click bên ngoài
document.addEventListener('click', function (event) {
    const dropdownContent = document.getElementById('dropdownContent');
    const categoryInput = document.getElementById('category');
    if (!categoryInput.contains(event.target) && !dropdownContent.contains(event.target)) {
        dropdownContent.style.display = 'none';
    }
});
document.addEventListener('click', function (event) {
    const dropdownContent = document.getElementById('dropdownContent1');
    const categoryInput = document.getElementById('updateCategory');
    if (!categoryInput.contains(event.target) && !dropdownContent.contains(event.target)) {
        dropdownContent.style.display = 'none';
    }
});


function getItemWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);  // Xóa dữ liệu nếu đã hết hạn
        return null;
    }
    return item.value;
}

// Hàm kiểm tra sự tồn tại của token
function isTokenValid(key) {
    const token = getItemWithExpiry(key);
    if (!token) {
        alert("Bạn đã cần đăng nhập lại");
        window.location.href = '/dang-nhap';
    }
    else
        return; // Trả về true nếu token còn tồn tại và chưa hết hạn, ngược lại trả về false
}