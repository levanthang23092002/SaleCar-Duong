

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
// Initialize Firestore
var db = firebase.database();

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const password = pass.toString();
        // Truy vấn Realtime Database để kiểm tra thông tin đăng nhập
        firebase.database().ref('user').once('value').then((snapshot) => {
            const userData = snapshot.val();
            


            if (userData) {
                if (userData.email == email) {
                    if (userData.password = password) {
                    const token = generateRandomString();  // Giả sử bạn có một token cần lưu
                    setItemWithExpiry('token', token, 3600);
                   
                    window.location.href = '/quan-li'; 
                    } else {
                        alert('Sai Mật Khẩu');
                    }

                } else {
                    // Mật khẩu không đúng
                    alert('sai email');
                }
            } else {
                // Tài khoản không tồn tại
                alert('Tài khoản không tồn tại');
            }
        }).catch((error) => {
            console.error("Lỗi khi lấy dữ liệu tài khoản: ", error);
            alert('Lỗi khi lấy dữ liệu tài khoản');
        });
    });
});
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 10;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
function setItemWithExpiry(key, value, expiryInSeconds) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + expiryInSeconds * 1000  // Thời gian hết hạn tính bằng milliseconds từ epoch
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// Lấy dữ liệu từ localStorage và kiểm tra thời gian hết hạn
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

