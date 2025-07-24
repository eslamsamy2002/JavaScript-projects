// DOM Elements 
let title = document.getElementById('tit');
let price = document.getElementById('p');
let taxes = document.getElementById('t');
let ads = document.getElementById('a');
let discount = document.getElementById('d');
let total = document.getElementById('total');
let count = document.getElementById('c');
let category = document.getElementById("ca");
let create = document.getElementById('create');
let del = document.getElementById("delete");
let mood = "create"; 
let tmp;

// Function to calculate the total price
function get_total() {
    if (price.value != "") {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.backgroundColor = 'green';
    } else {
        total.innerHTML = '';
        total.style.backgroundColor = 'red';
    }
}

// Retrieve existing data from localStorage or initialize an empty array
let datapro;

const initialData = [
  {
    title: "Samsung Galaxy A52",
    price: 2500,
    taxes: 20,
    ads: 15,
    discount: 10,
    total: 2525,
    count: 1,
    category: "phone"
  },
  {
    title: "HP Pavilion Laptop",
    price: 7500,
    taxes: 50,
    ads: 30,
    discount: 100,
    total: 7480,
    count: 1,
    category: "laptop"
  },
  {
    title: "Bluetooth Headphones",
    price: 400,
    taxes: 10,
    ads: 5,
    discount: 0,
    total: 415,
    count: 1,
    category: "accessory"
  },
  {
    title: "Smartwatch",
    price: 600,
    taxes: 15,
    ads: 10,
    discount: 5,
    total: 620,
    count: 1,
    category: "watch"
  },
  {
    title: "Dell Monitor 24”",
    price: 1800,
    taxes: 30,
    ads: 10,
    discount: 50,
    total: 1790,
    count: 1,
    category: "display"
  },
  {
    title: "iPhone 13",
    price: 13000,
    taxes: 100,
    ads: 50,
    discount: 300,
    total: 12850,
    count: 1,
    category: "phone"
  }
];

if (!localStorage.getItem("data")) {
  localStorage.setItem("data", JSON.stringify(initialData));
}

datapro = JSON.parse(localStorage.getItem("data"));


// Create or update product
create.onclick = function() {
    let newpro = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value
    };

    if(title.value!='' &&price.value !='' && category!='' &&count.value<=1000){
        if (mood == 'create') {
            if (newpro.count > 1) {
                for (let i = 0; i < newpro.count; i++) {
                    datapro.push(newpro);
                }
            } else {
                datapro.push(newpro);
            }
        } else {
            datapro[tmp] = newpro;
            mood = 'create';
            create.innerHTML = 'create';
            count.style.display = 'block';
        }
        clean();
    }
   

    // Save data to localStorage
    localStorage.setItem('data', JSON.stringify(datapro));

    read();
    
}

// Function to clear input fields
function clean() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// Function to delete a product
function delete_data(i) {
    let confirmDelete = confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
        datapro.splice(i, 1);
        localStorage.data = JSON.stringify(datapro);
        read();
    }
}

// Function to delete all products
function cleanall() {
    let confirmCleanAll = confirm("Are you sure you want to delete all items?");
    if (confirmCleanAll) {
        datapro.splice(0);
        localStorage.clear();
        read();
    }
}

// Function to update a product
function updatedata(i) {
    title.value = datapro[i].title;
    price.value = datapro[i].price;
    taxes.value = datapro[i].taxes;
    ads.value = datapro[i].ads;
    discount.value = datapro[i].discount;
    get_total();
    category.value = datapro[i].category;
    count.style.display = 'none';
    create.innerHTML = 'update';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: "smooth"
    });
}

// Function to display the products in a table
function read() {
    get_total();
    let table = '';
    for (let i = 0; i < datapro.length; i++) {
        table += `
            <tr>
                <td>${i+1}</td>
                <td>${datapro[i].title}</td>
                <td>${datapro[i].price}</td>
                <td>${datapro[i].taxes}</td>
                <td>${datapro[i].ads}</td>
                <td>${datapro[i].discount}</td>
                <td>${datapro[i].total}</td>
                <td>${datapro[i].category}</td>
                <td><button onclick="updatedata(${i})" id="udate">update</button></td>
                <td><button onclick='delete_data(${i})' id="delete">delete</button></td>
            </tr>
        `;
    }

    document.getElementById("content").innerHTML = table;

    let btndelete = document.getElementById("deleteall");
    if (datapro.length > 0) {
        btndelete.innerHTML = `
            <button onclick='cleanall()'>delete all (${datapro.length})</button>
        `;
    } else {
        btndelete.innerHTML = '';
    }
}

// Search functionality
let searchmode = 'title';
let search = document.getElementById('searchbar');

function getsearchmode(id) {
    if (id == 'title') {
        searchmode = 'title';
    } else {
        searchmode = 'category';
    }
    search.placeholder = 'Search By ' + searchmode;
    search.focus();
    search.value = '';
    read();
}

function searchd(value) {
    let table = '';
    for (let i = 0; i < datapro.length; i++) {
        if (searchmode == 'title') {
            if (datapro[i].title.toLowerCase().includes(value.toLowerCase())) {
                table += `
                    <tr>
                        <td>${i}</td>
                        <td>${datapro[i].title}</td>
                        <td>${datapro[i].price}</td>
                        <td>${datapro[i].taxes}</td>
                        <td>${datapro[i].ads}</td>
                        <td>${datapro[i].discount}</td>
                        <td>${datapro[i].total}</td>
                        <td>${datapro[i].category}</td>
                        <td><button onclick="updatedata(${i})" id="udate">update</button></td>
                        <td><button onclick='delete_data(${i})' id="delete">delete</button></td>
                    </tr>
                `;
            }
        } else {
            if (datapro[i].category.toLowerCase().includes(value.toLowerCase())) {
                table += `
                    <tr>
                        <td>${i}</td>
                        <td>${datapro[i].title}</td>
                        <td>${datapro[i].price}</td>
                        <td>${datapro[i].taxes}</td>
                        <td>${datapro[i].ads}</td>
                        <td>${datapro[i].discount}</td>
                        <td>${datapro[i].total}</td>
                        <td>${datapro[i].category}</td>
                        <td><button onclick="updatedata(${i})" id="udate">update</button></td>
                        <td><button onclick='delete_data(${i})' id="delete">delete</button></td>
                    </tr>
                `;
            }
        }
    }

    document.getElementById("content").innerHTML = table;
}

// Initial read to display products
read();
