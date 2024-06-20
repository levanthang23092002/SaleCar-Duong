var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://salexemrduong-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Tham chiếu đến cơ sở dữ liệu Firebase
const database = firebase.database();

// Truy xuất dữ liệu từ Firebase và cập nhật HTML
const carListElement = document.getElementById('carList');
const carRef = database.ref('cars/');

carRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        const carData = childSnapshot.val();

        // Tạo phần tử HTML cho mỗi chiếc xe
        const carElement = document.createElement('div');
        carElement.classList.add('col-lg-3', 'col-md-6', 'mb-4','cart-item');
        
        carElement.innerHTML = `
            <div class="card">
                <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                    <img src="${carData.imageLink}" class="w-100" />
                    <a href="#" class="getDataButton">
                        <div class="mask">
                            <div class="d-flex justify-content-start align-items-end h-100">
                                <h5><span class="badge bg-primary ms-2">New</span></h5>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="card-body">
                    <a href="#" class="text-reset getDataButton">
                        <h5 class="card-title mb-3">${carData.name}</h5>
                    </a>
                    <a href="#" class="text-reset getDataButton">
                        <p class="card-detail text-white">${carData.category}</p>
                    </a>
                    <h6 class="mb-3">
                        <s class="card-detail">${formatCurrency(carData.oldPrice)}</s><strong class="ms-2 text-danger">${formatCurrency(carData.newPrice)}</strong>
                    </h6>
                    <span class="key" style="display: none;">${childSnapshot.key}</span>
                </div>
            </div>
        `;

        // Thêm phần tử xe vào danh sách xe
        carListElement.appendChild(carElement);

        // Lắng nghe sự kiện click của nút nhận dữ liệu
        const getDataButtons = carElement.querySelectorAll('.getDataButton');
        getDataButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();  // Prevent the default action of the anchor tag
                const keyValue = carElement.querySelector('.key').innerText;
                carRef.child(keyValue).once("value", function(snapshot) {
                    var xe1 = snapshot.val();
                    localStorage.setItem("xe1Data", JSON.stringify(xe1));
                    
                    // Chuyển đến trang mới để hiển thị dữ liệu
                    window.location.href = "/chi-tiet-san-pham";
                });
            });
        });
    });
});

// Hàm định dạng tiền tệ
function formatCurrency(number) {
    // Chuyển đổi số thành chuỗi và loại bỏ các ký tự không phải là số
    const numericString = String(number).replace(/\D/g, '');
  
    // Chia chuỗi thành các phần ngàn
    const parts = numericString.split('');
    const thousands = [];
    while (parts.length > 3) {
      thousands.unshift(parts.splice(-3).join(''));
    }
    thousands.unshift(parts.join(''));
  
    // Kết hợp các phần ngàn và thêm dấu chấm
    const formattedString = thousands.join('.');
  
    // Thêm đơn vị tiền tệ
    const currencyString = formattedString + ' VNĐ';
  
    return currencyString;
}
