document.addEventListener("DOMContentLoaded", function() {
    // Điền các giá trị vào các <select>
    const daySelect = document.getElementById("day");
    const monthSelect = document.getElementById("month");
    const yearSelect = document.getElementById("year");

    // Điền options cho ngày
    for (let i = 1; i <= 31; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Điền options cho tháng
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        monthSelect.appendChild(option);
    }

    // Điền options cho năm
    for (let i = 2000; i <= 2099; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Lấy giá trị của ngày, tháng, năm khi thay đổi
    function getDateValues() {
        const day = daySelect.value;
        const month = monthSelect.value;
        const year = yearSelect.value;
        console.log(`Ngày: ${day}, Tháng: ${month}, Năm: ${year}`);
    }

    // Lắng nghe sự kiện change trên các <select>
    daySelect.addEventListener("change", getDateValues);
    monthSelect.addEventListener("change", getDateValues);
    yearSelect.addEventListener("change", getDateValues);
});

document.addEventListener("DOMContentLoaded", function() {
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");
    const wardSelect = document.getElementById("ward");

    // Dữ liệu quận/huyện và phường/xã theo tỉnh
    const locationData = {
        "Bình Định": {
            "Huyện Hoài Ân": ["Xã Ân Đức", "Thị trấn Tăng Bạt Hổ", "Xã Ân Thạnh", "Xã Ân Tường Tây"],
            "Thị xã Hoài Nhơn": ["Xã Hoài Khương", "Xã Hoài Tân"],
            "Huyện Tuy Phước": ["Thị trấn Tuy Phước", "Xã Phước Hiệp", "Xã Phước Quang", "Xã Phước Thành"],
            "TP Quy Nhơn": ["Phường Ghềnh Ráng", "Phường Nguyễn Văn Cừ", "Phường Trần Quang Diệu", "Phường Lê Hồng Phong"]
        },
        "Phú Yên": {
            "Thị xã Sông Cầu": ["Phường Xuân Phú", "Phường Xuân Thành", "Xã Vịnh Xuân"],
            "Thị xã Tuy Hòa": ["Phường 9", "Phường 10", "Phường Phú Lâm", "Xã Hòa An"],
            "Huyện Đông Hòa": ["Xã Hòa Hiệp Bắc", "Xã Hòa Tân Tây", "Thị trấn Hòa Hiệp Trung"]
        },
        "Khánh Hòa": {
            "TP Nha Trang": ["Phường Ngô Mây", "Phường Vĩnh Nguyên", "Phường Vạn Thạnh", "Phường Phước Tân"],
            "Huyện Cam Lâm": ["Xã Cam Phước Đông", "Xã Cam Lộc", "Xã Suối Cát", "Xã Cam Tân"],
            "Huyện Diên Khánh": ["Thị trấn Diên Khánh", "Xã Diên Lạc", "Xã Diên Thọ"],
            "Huyện Khánh Vĩnh": ["Thị trấn Khánh Vĩnh", "Xã Khánh Bình", "Xã Sông Cầu"]
        }
    };

    // Lắng nghe sự kiện thay đổi tỉnh/thành phố
    citySelect.addEventListener("change", function() {
        const selectedCity = citySelect.value;
        updateDistricts(selectedCity);
    });

    // Lắng nghe sự kiện thay đổi quận/huyện
    districtSelect.addEventListener("change", function() {
        const selectedCity = citySelect.value;
        const selectedDistrict = districtSelect.value;
        updateWards(selectedCity, selectedDistrict);
    });

    // Cập nhật danh sách quận/huyện khi tỉnh/thành phố thay đổi
    function updateDistricts(city) {
        districtSelect.innerHTML = '<option>-- Chọn Quận/Huyện --</option>';
        wardSelect.innerHTML = '<option>-- Chọn Xã/Phường --</option>';
        
        if (city && locationData[city]) {
            const districts = Object.keys(locationData[city]);
            districts.forEach(function(district) {
                let option = document.createElement("option");
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    }

    // Cập nhật danh sách phường/xã khi quận/huyện thay đổi
    function updateWards(city, district) {
        wardSelect.innerHTML = '<option>-- Chọn Xã/Phường --</option>';
        
        if (city && district && locationData[city][district]) {
            const wards = locationData[city][district];
            wards.forEach(function(ward) {
                let option = document.createElement("option");
                option.value = ward;
                option.textContent = ward;
                wardSelect.appendChild(option);
            });
        }
    }
});

