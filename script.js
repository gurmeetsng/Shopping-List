const form= document.querySelector('#item-form');
const btn = form.querySelector('.btn');
const textInput= document.querySelector('#item-input');
const ul= document.querySelector('#item-list');
const clearBtn= document.querySelector('#clear');
const filterTextBox= document.querySelector('#filter');
editMode=false;

function onDomLoadAddExisitingItems(){
    const itemsStored = getItemsFromStorage();
    itemsStored.forEach(item => {
        addItemToDom(item);
    });
    checkUIOnLoad();
}

function onAddUpdate(e){
    e.preventDefault();
    const inputText= textInput.value;
    if(inputText === ''){
        alert('Please enter an item');
        return;
    }
    if(btn.textContent.trim() == 'Update Item'){
        const oldText = localStorage.getItem('oldValue');
        //updating an item to DOM
        updateItemToDom(oldText,inputText);
        //updating an item to Storage
        updateItemToStorage();
        for(let l of ul.children){
            l.classList.remove('edit-mode');
         }
    }
    else{
        if(checkDuplicates(inputText)){
            alert('That item already exists!');
            return;
        }
        //adding an item to DOM
        addItemToDom(inputText);
        //adding an item to Storage
        addItemToStorage(inputText);        
    }
    checkUIOnLoad();
}

function updateItemToDom(oldText,newText){
    for(let li of ul.children){
        if(li.firstChild.textContent === oldText){
            li.firstChild.textContent = newText;
        }
    }
    btn.innerHTML='<i class=\'fa-solid fa-plus\'></i>  Add Item';
    btn.style.backgroundColor="black";
    checkUIOnLoad();
    textInput.value='';
}

function updateItemToStorage(){
    let newArr=[];
    for(let li of ul.children){
        newArr.push(li.firstChild.textContent);
    }
    localStorage.setItem('items',JSON.stringify(newArr));
}

function addItemToDom(inputText){
    
    //Create List Item for entered value
    const li= document.createElement('li');
    li.appendChild(document.createTextNode(inputText));
    const btn= document.createElement('button');
    btn.className='remove-item btn-link text-red';
    const i= document.createElement('i');
    i.className='fa-solid fa-xmark';

    btn.appendChild(i);
    li.appendChild(btn);
    ul.appendChild(li);
}

function checkDuplicates(inputText){
    const storedItems = getItemsFromStorage();
    return storedItems.includes(inputText);
}

function getItemsFromStorage(){
    let itemsStored;
    
    if(localStorage.getItem('items') === null || localStorage.getItem('items') === '' ){
        itemsStored =[];
    }
    else{
        itemsStored = JSON.parse(localStorage.getItem('items'));
    }
    return itemsStored;
}

function addItemToStorage(inputText){
    const itemsStored = getItemsFromStorage();
    itemsStored.push(inputText);

    //convert to JSON String and add back to local storage
    localStorage.setItem('items', JSON.stringify(itemsStored));
}

function onClickItem(e){
    if(e.target.tagName === 'I'){
        onDeleteItem(e.target);
        removeItemFormStorage(e.target.parentElement.parentElement.textContent);
        checkUIOnLoad();
    }
    else{
        updateItem(e.target);
    }
    
}

function updateItem(item){
    editMode=true;
    for(let l of ul.children){
       l.classList.remove('edit-mode');
    }
    btn.innerHTML='<i class=\'fa-solid fa-edit\'></i>  Update Item';
    btn.style.backgroundColor="green";
    item.classList.add('edit-mode');    
    textInput.value=item.firstChild.textContent;
    localStorage.setItem('oldValue',item.firstChild.textContent);
}

function onDeleteItem(item){    
    if(confirm('Are you sure?')){
        item.parentElement.parentElement.remove();
    }    
    checkUIOnLoad();
}

function removeItemFormStorage(item){
    let itemsStored = getItemsFromStorage();
    itemsStored = itemsStored.filter((i) => i !== item);
    localStorage.setItem('items',JSON.stringify(itemsStored));
    checkUIOnLoad();
}

function onClearAll(){
    ul.textContent='';
    filterTextBox.textContent='';
    localStorage.removeItem('items');
    checkUIOnLoad();
}


function onFilterItem(e){
    const filterText= e.target.value.toLowerCase();
    const lis=ul.children;
    const filteredItems = Array.from(lis).filter(li =>{        
        const firstChildText= li.firstChild.textContent.toLowerCase();
        if(firstChildText.indexOf(filterText) != -1){
            li.style.display='flex';
        }
        else{
            li.style.display='none';
        }
    })


}

//Hide or Remove unwanted items on load
function checkUIOnLoad(){
    filterTextBox.value='';
    textInput.value='';
    const lis= document.querySelectorAll('li');

    if(lis.length === 0)// No item available to show thus hide filter and clear button
    {
        clearBtn.style.display = 'none';
        filterTextBox.style.display ='none';
    }
    else{
        clearBtn.style.display = 'block';
        filterTextBox.style.display ='block';
    }
}
//Intialize App
function init(){
    //Event Listners
    form.addEventListener('submit', onAddUpdate);
    ul.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', onClearAll);
    filterTextBox.addEventListener('input', onFilterItem);
    document.addEventListener('DOMContentLoaded',onDomLoadAddExisitingItems);
    
    checkUIOnLoad();
}

init();
