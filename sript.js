let api_key = '6adb8dac3bcd1e82b8f138233342b2b1'
let main = document.getElementsByClassName('main')[0]

function createElem(name, place = null) {
  let elem = document.createElement("div");
  elem.classList.add(name);
  if (place) {
    place.appendChild(elem);
  } else {
    document.body.appendChild(elem);
  }
  return elem;
}
if (!main) {
  main = createElem("main", document.body);
}

function fetchRegistrationPlate(registration_plate)
{
    let url = `https://baza-gai.com.ua/nomer/${registration_plate}`;

    fetch(url, {
        headers: {
            "Accept": "application/json", "X-Api-Key": api_key 
        
        }
    })
        .then(r => r.json())
        .then((data) => {
            console.log(data)
             if (data.error) {
            displayError(data.error);
        } else {
             displayCarInfo(data)
        }
    })
    .catch((error) => {
               console.error("Error fetching data: ", error);
        displayError("Ошибка при получении данных.");
            });
}

function fetchVinCode(vin_code) {
   
    let url = `https://baza-gai.com.ua/vin/${vin_code}`;

    fetch(url, {
        headers: {
            "Accept": "application/json", "X-Api-Key": api_key 
        
        }
    })
        .then(r => r.json())
        .then((data) => {
            console.log(data)
             if (data.error) {
            displayError(data.error);
        } else {
           displayCarInfo(data)
        }
    })
    .catch((error) => {
               console.error("Error fetching data: ", error);
        displayError("Ошибка при получении данных.");
            });
}

let inner_container = createElem("inner_container", main)
let search_box_container = createElem("container-fluid", inner_container)
let label_search_box = createElem('label_search_box', search_box_container)
label_search_box.textContent = 'Проверка авто по номеру и VIN'
let search_box = document.createElement('form')
 search_box.classList.add("d-flex");
search_box_container.appendChild(search_box)
search_box.role = 'search'


let input_search_box = document.createElement('input')
 input_search_box.classList.add('form-control','me-2');
input_search_box.type = 'search'
input_search_box.placeholder = "Номерной знак или VIN"
input_search_box.ariaLabel = 'Search'
search_box.appendChild(input_search_box);

let btn_search_box = document.createElement('button')
 btn_search_box.classList.add('btn','btn-outline-success');
btn_search_box.type = "submit"
btn_search_box.textContent = 'Поиск'
search_box.appendChild(btn_search_box);
btn_search_box.addEventListener('click', e =>
{
   e.preventDefault();
    let inputValue = input_search_box.value.trim();

    if (inputValue !== '') { // Проверка на непустое значение
        if (inputValue.length === 17) {
            fetchVinCode(inputValue);
        } else if (inputValue.length >= 6 && inputValue.length <= 8) {
            fetchRegistrationPlate(inputValue);
        } else {
            displayError("Неверный формат ввода. Пожалуйста, введите VIN-код (17 символов) или регистрационный номер (6-8 символов).");
        }
    } else {
        displayError("Поле ввода пустое. Пожалуйста, введите VIN-код или регистрационный номер.");
    }
});

// Функция для вывода ошибки на экран
function displayError(errorMessage) {
    let errorBox = document.getElementById('errorBox');
    if (!errorBox) {
        errorBox = document.createElement('div');
        errorBox.id = 'errorBox';
        errorBox.classList.add('alert', 'alert-danger');
        document.body.appendChild(errorBox);
    }
    errorBox.textContent = errorMessage;
}

let registration_plate_model_car = createElem('registration_plate_model_car', inner_container)
    

function createCard(title, imgSrc) {
    let card = createElem('card', registration_plate_model_car);
    card.classList.add('card', 'text-bg-dark');

    let img = document.createElement('img');
    img.classList.add('card-img');
    img.src = imgSrc;
    img.alt = 'Car Image';

    let overlay = document.createElement('div');
    overlay.classList.add('card-img-overlay');

    let titleElem = document.createElement('h5');
    titleElem.classList.add('card-title');
    titleElem.textContent = title;

    overlay.appendChild(titleElem);
    card.appendChild(img);
    card.appendChild(overlay);

    return card;
}

function fetchModelCar() {
    let url = 'https://baza-gai.com.ua/make';

    fetch(url, {
        headers: {
            "Accept": "application/json",
            "X-Api-Key": api_key
        }
    })
    .then(r => r.json())
    .then((data) => {
        data.forEach(item => {
            if (item.img_url != null) {
                let card = createCard(item.title, `https://baza-gai.com.ua${item.img_url}`);
               
            } else {
                console.log(`Image URL is null for item with id: ${item.id}`);
            }
        });
    })
    .catch((error) => {
        console.error("Error fetching data: ", error);
    });
}
 

fetchModelCar()

  function displayCarInfo(data) {
            const carInfoDiv = document.getElementsByClassName('main')[0];
            carInfoDiv.innerHTML = ''; // Очищаем предыдущее содержимое

      const card_container = document.createElement('div');
       card_container.classList.add('card_container_main');
      
  const card = document.createElement('div');
            card.classList.add('card', 'card-img-overlay');
      
      
          
       const img = document.createElement('img');
            img.src = data.photo_url;
      img.alt = `${data.vendor} ${data.model}`;
       img.classList.add('card-img', 'extra-info');


          
       let overlay = document.createElement('div');
      overlay.classList.add('card-img-overlay');
      
      
      let top_container = createElem('top_container', overlay)
      let data_digits_container = createElem('data_digits', top_container)
      let registered_at_container = createElem('data_digits', top_container)
      data_digits_container.textContent = `${data.digits}`
      registered_at_container.textContent =`${data.operations[0].registered_at}`

      let bottom_container = createElem('bottom_container', overlay)
 let model_year_container = createElem('model_year_container', bottom_container)
      model_year_container.textContent = `${data.model_year}`

        const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = `${data.vendor} ${data.model}`;

  

      
            const vin = document.createElement('p');
      vin.innerHTML = `<strong>VIN:</strong> ${data.vin}`;
       vin.classList.add('vin');

            const plate = document.createElement('p');
      plate.innerHTML = `<strong>Номерной знак:</strong> ${data.digits}`;
       plate.classList.add('plate');

            const year = document.createElement('p');
      year.innerHTML = `<strong>Год выпуска:</strong> ${data.model_year}`;
       year.classList.add('year');

            const region = document.createElement('p');
      region.innerHTML = `<strong>Регион:</strong> ${data.region.name_ua}`;
       region.classList.add('region');

            const operations = document.createElement('ul');
            data.operations.forEach(op => {
                const li = document.createElement('li');
                li.textContent = `Опер: ${op.registered_at}, ${op.vendor}, ${op.model_year}`;
                 operations.classList.add('operations');
                operations.appendChild(li);
            });

           // card.appendChild(img);
      //   card.appendChild(title);
      
      
            
      
        
      overlay.appendChild(top_container);
       overlay.appendChild(bottom_container);
      bottom_container.appendChild(title);
     
    card.appendChild(img);
      card.appendChild(overlay);
      
            card.appendChild(vin);
            card.appendChild(plate);
            card.appendChild(year);
            card.appendChild(region);
            card.appendChild(operations);
            
      card_container.appendChild(card)
    carInfoDiv.appendChild(card_container)

      


     

   



        }