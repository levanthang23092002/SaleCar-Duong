// Cấu hình Firebase
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

carRef.limitToFirst(8).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        const carData = childSnapshot.val();

        // Tạo phần tử HTML cho mỗi chiếc xe
        const carElement = document.createElement('div');
        carElement.classList.add('col-lg-3', 'col-md-6', 'd-flex', 'align-items-stretch');
        carElement.setAttribute('data-aos', 'fade-up');
        carElement.setAttribute('data-aos-delay', '100');
        carElement.innerHTML = `
            <div class="team-member">
                <div class="member-img">
                    <img src="${carData.imageLink}" class="img-fluid" alt="">
                    <div class="social">
                       <button class="getDataButton">xem chi tiết</button>
                    </div>
                </div>
                <div class="member-info">
                    <h4>${carData.name}</h4>
                    <span class="txtpriceold">${formatCurrency(carData.oldPrice)}</span>
                    <span class="txtpricenew">${formatCurrency(carData.newPrice)}</span>
                    <span class="key" style="display: none;">${childSnapshot.key}</span>
                </div>
            </div>
        `;

        // Thêm phần tử xe vào danh sách xe
        carListElement.appendChild(carElement);

        // Lắng nghe sự kiện click của nút nhận dữ liệu
        const getDataButton = carElement.querySelector('.getDataButton');
        

        getDataButton.addEventListener('click', function() {
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
// lấy sô lượng xe
document.addEventListener('DOMContentLoaded', function() {
    // Lấy phần tử span có class là 'purecounter' và giá trị data-purecounter-end là 521

    var countCar = firebase.database().ref('cars/');
    countCar.on('value', function(snapshot) {
        var counterElement = document.querySelector('.purecounter[data-purecounter-end="521"]');
        let vehicleCount = snapshot.numChildren(); 
        console.log(vehicleCount)
        if (counterElement) {
            // Thay đổi giá trị data-purecounter-end thành số mới (ví dụ: 1000)
            counterElement.setAttribute('data-purecounter-end', vehicleCount);
        }   
    });
});

