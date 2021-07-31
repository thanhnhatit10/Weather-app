
const APIKEY = 'KkOI9NZ43cjdzQqUDJQAdLGYm3JyVGWh';

// Lấy thời tiết theo ngày

var getDayWeather = async function(id) {
    const citys = `${id}`;
    const detail = '&details=true&metric=true';
    const apiKey = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${citys}?apikey=${APIKEY}${detail}`;
    const response = await fetch(apiKey)
    const res = await response.json()
    return res;
}
// Lấy điều kiện thời tiết 

var getWeather = async function(id) {
    const citys = `${id}`;
    const detail = '&details=true';
    const apiKey = `http://dataservice.accuweather.com/currentconditions/v1/${citys}?apikey=${APIKEY}${detail}`;
    const response = await fetch(apiKey)
    const data = await response.json();
    return data[0];
}
// Lấy tên thành phố, tỉnh
var citySearch = async (city) => {

    const citys = `&q=${city}`;
    const apiKey = `?apikey=${APIKEY}${citys}`;
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search${apiKey}`)
    
    const data = await response.json();
    return data[0];
}

// Trả về object thời tiết thông qua id
const updateCity = async (city) => {
    const cityFull = await citySearch(city);
    const weatherFull = await getWeather(cityFull.Key)
    const dayWeather =  await getDayWeather(cityFull.Key);
    
    return {
        'location': cityFull,
        'forcase': weatherFull,
        'dayweathers': dayWeather,
    }
}

// Lấy giá trị tìm kiếm ở ô input
const inputValue = document.querySelector('.search-input');
const inputValueDefault = document.querySelector('.search-input-default').value;
inputValue.addEventListener('change',function(e) {
    if(inputValue.value == "") {
        modal('Vui lòng nhập từ khoá tìm kiếm');
        document.querySelector('.header-search').classList.add('error');
    }
    else {
    document.querySelector('.header-search').classList.remove('error');
     updateCity(e.target.value)
        .then(function(data) {
            console.log(data);
            const countryName = document.querySelector('.country-name');
            const cityName = document.querySelector('.city-name');
            const cityTemperature = document.querySelector('.city-temperature-name');
            const temperature = document.querySelector('.temperature--');
            const Wind = document.querySelectorAll('.detail-item:first-child .detail-if > p');
            const RealFeel = document.querySelectorAll('.detail-item:nth-child(2) .detail-if > p');
            const UVIndex = document.querySelectorAll('.detail-item:nth-child(3) .detail-if > p');
            const pressure = document.querySelectorAll('.detail-item:nth-child(4) .detail-if > p');
            const visibility = document.querySelectorAll('.detail-item:nth-child(5) .detail-if > p');
            const relativeHumidity = document.querySelectorAll('.detail-item:nth-child(6) .detail-if > p');
            const cloudCover = document.querySelectorAll('.detail-item:nth-child(7) .detail-if > p');
            const iconWeather =document.querySelector('.header-img-weather');
            // console.log(pressure);

            // Thêm ảnh nền theo điều kiện ngày/ đêm
            const bgImg = document.querySelector('.wrapper');
            let isTime = null;
            if(data.forcase.IsDayTime) {
                isTime = "url('./assets/img/day.svg')";
            }
            else {
                isTime = "url('./assets/img/night.svg')";
            }
            Object.assign(bgImg.style, {
                backgroundImage: `${isTime}`
            })

            // Icon thời tiết hiện tại
             const icon = data.forcase.WeatherIcon;
             iconWeather.setAttribute('src', `./assets/img/icons/${icon}.svg`)
 
            countryName.innerHTML = data.location.Country.EnglishName;
            cityName.innerHTML = data.location.LocalizedName;
            cityTemperature.innerHTML = data.forcase.WeatherText;
            temperature.innerHTML = Math.round(data.forcase.Temperature.Metric.Value);

            // Khí áp 
            pressure[0].innerHTML = Math.round(data.forcase.Pressure.Metric.Value)+ ' ' + 'mbar';

            // Kiểm tra chỉ số tia UV
            let IndexUVtext = data.forcase.UVIndexText == 'Low' ? 'Thấp' : 'Cao';
            UVIndex[0].innerHTML = Math.round(data.forcase.UVIndex) + ' ' + IndexUVtext;
            // Khí áp
            RealFeel[0].innerHTML = Math.round(Math.floor(data.forcase.RealFeelTemperature.Metric.Value))+ ' '+ '<sup>o</sup>C';
            // Gió
            Wind[0].innerHTML = Math.round(Math.ceil(data.forcase.Wind.Speed.Metric.Value)) + ' ' + 'km/h';
            // Tầm nhìn
            visibility[0].innerHTML = Math.round(data.forcase.Visibility.Metric.Value)+ ' ' + 'km/h';
            // Độ ẩm 
            relativeHumidity[0].innerHTML = data.forcase.RelativeHumidity + ' ' + '%';
            // Mật độ mây 
            cloudCover[0].innerHTML = data.forcase.CloudCover + ' ' + '%';

            // Weather 5 day
            const dayW = data.dayweathers.DailyForecasts;
            var dayS = dayW.map(function(days){
                var date = new Date(days.Date);
                var thu = ['CN', 'TH 2', 'TH 3', 'TH 4', 'TH 5', 'TH 6', 'TH 7'];
                console.log(date);
                return `
                    <li class="--day-list-item">
                        <span>${thu[date.getDay()]}</span>
                        <span>${Math.round(days.Temperature.Maximum.Value)}<sup>o</sup></span>
                    </li>
                `
            }).join('');

            document.querySelector('.weather--day-list').innerHTML = dayS;

        })
        .catch(error => {
            modal(error);
        })
    }
})


// Modal JS

function modal(index) {
    
    const modal = document.querySelector('.modal');
    if(index) {
        modal.classList.add('open');
        document.querySelector('.modal-alert').innerHTML = index;
    }
}

function closeModal() {
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.modal-close');
    closeModal.addEventListener('click', function(e) {
        modal.classList.remove('open');
    })
}

closeModal();