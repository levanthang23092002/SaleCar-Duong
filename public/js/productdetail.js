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

// Tham chiếu đến cơ sở dữ liệu Firebase
const database = firebase.database();
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

document.addEventListener('DOMContentLoaded', function() {
  // Đảm bảo rằng Firebase đã được khởi tạo và carRef được thiết lập trước khi sử dụng
  const database = firebase.database();
  const carRef = database.ref('cars/');

  // Đảm bảo rằng carListElement đã được định nghĩa và có tham chiếu đúng
  const carListElement = document.getElementById('carList');

  var xe1Data = localStorage.getItem("xe1Data");

  if (!xe1Data) {
      console.error("No car data found in localStorage.");
      return;
  }

  xe1Data = JSON.parse(xe1Data);

  // Cập nhật thông tin của xe 1 lên HTML
  if (xe1Data.imageLink) document.getElementById("image1").src = xe1Data.imageLink;
  if (xe1Data.imageLink2) document.getElementById("image2").src = xe1Data.imageLink2;
  if (xe1Data.imageLink3) document.getElementById("image3").src = xe1Data.imageLink3;
  if (xe1Data.imageLink4) document.getElementById("image4").src = xe1Data.imageLink4;
  if (xe1Data.name) document.getElementById("name").textContent = xe1Data.name;
  if (xe1Data.newPrice) document.getElementById("newprice").textContent = formatCurrency(xe1Data.newPrice);
  if (xe1Data.oldPrice) document.getElementById("oldprice").textContent = formatCurrency(xe1Data.oldPrice);
  if (xe1Data.category) document.getElementById("category").textContent = xe1Data.category;
  if (xe1Data.payload) document.getElementById("payload").textContent = xe1Data.payload;
  if (xe1Data.payload) document.getElementById("totalpayload").textContent = xe1Data.totalpayload;
  if (xe1Data.size) document.getElementById("size").textContent = xe1Data.size;
  if (xe1Data.size) document.getElementById("carbin").textContent = xe1Data.carbin;
  if (xe1Data.power) document.getElementById("power").textContent = xe1Data.power;
  if (xe1Data.detail) document.getElementById("detail").textContent = xe1Data.detail;

  carRef.limitToFirst(4).once('value', function(snapshot) {
      let count = 0; // Biến đếm số lượng xe đã hiển thị
      snapshot.forEach(function(childSnapshot) {
          const carData = childSnapshot.val();
          
          // Kiểm tra xem thư mục của xe có phải là ISUZU MU-X không
          if (carData.category === xe1Data.category) {
              // Kiểm tra số lượng xe đã hiển thị, nếu đã đạt tới 4 chiếc thì dừng vòng lặp
              if (count >= 4) {
                  return;
              }
              
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
              
              count++; // Tăng biến đếm lên sau mỗi lần hiển thị xe
          }
      });
  });

});
