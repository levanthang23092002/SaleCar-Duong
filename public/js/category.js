

var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://salexemrduong-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const carListElement = document.getElementById('carList');
document.addEventListener("DOMContentLoaded", function() {
    const database = firebase.database();
    const carRef = database.ref('cars/');
    var selectedItem = localStorage.getItem("selectedItem");
    if (selectedItem) document.getElementById("category").textContent = selectedItem;
    // Kiểm tra xem dữ liệu có tồn tại không
    if(selectedItem) {
        carRef.once('value', function(snapshot) {
            let count1 = 0;
            snapshot.forEach(function(childSnapshot) {
                const carData = childSnapshot.val();
                
                // Kiểm tra xem thư mục của xe có phải là ISUZU MU-X không
                if (carData.category == selectedItem) {
                    count1 =count1 + 1 ;
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
                                <span  class="txtpricenew">${formatCurrency(carData.newPrice)}</span>
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


                }
            });
            if(count1 === 0){
                const carElement = document.createElement('div');
                carElement.innerHTML =`
                <div>Không Có Sản Phẩm</div>
                `;
                carListElement.appendChild(carElement);
            }
        });
        
    } else {
        console.log("Không có dữ liệu được lưu trữ.");
    }
})

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
