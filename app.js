//Storage Controller
const StorageCtrl = (function(){
    //public methods
    return{
        storeItem: function(newItem) {
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(newItem);
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(newItem);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function () {
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }
            else{
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemStorage: function (updatedItem) {
            
            let items = this.getItemsFromStorage();
            items.forEach(function (item, index) {
                if(item.id === updatedItem.id){
                    items.splice(index, 1, updatedItem);
                }
            })
            localStorage.setItem('items', JSON.stringify(items));

        },
        deleteItemFromStorage: function(id){
            let items = this.getItemsFromStorage();
            items.forEach(function (item, index) {
                if(item.id === id){
                    items.splice(index, 1);
                }
            })
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }

    }
})();

//This a modular pattern
//This is done to make properties private and only expose function to manupulate the
//properties
//Hence helps in achieving encapsulation
const itemCtrl = (function(){

    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure /State
    const data = {
        items : StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories : 0
    }

    return{
        //public methods
        logData: function(){
            return {
                data,
            }
        },
        getItems: function(){
            return data.items;
        },

        getItemById: function(id){
            let found;
            data.items.forEach((item) => {
                if(item.id === id){
                    found = item;
                }
            })

            return found;

        },
        addItem: function(itemInput){
            
            //Generating ids
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            const item = new Item(ID, itemInput.name, parseInt(itemInput.calories));
            data.items.push(item);
            return item;
        },

        updateItem: function(item){
            const calories = parseInt(item.calories);
            const name = item.name;

            let found = null;
            
            data.items.forEach((item) => {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })

            return found;
        },

        deleteItem: function(id){

            const ids = data.items.map(function(item){
                return item.id;
            })

            const index = ids.indexOf(id);

            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },

        setCurentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });

            data.totalCalories = total;
            return total;
        }

    }


})();

const UICtrl = (function(){

    const UISelector = {
        itemList: "#item-list",
        listItems: '#item-list li',
        addBtn: '.add-btn',
        editBtn: '.edit-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '#total-calories'
    }

    return{
        populateItemList: function(items){

            let html = "";

            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                    <a href="#" class="edit-btn secondary-content"><i class="fa fa-pencil"></i></a>
                </li>
                `
            })

            document.querySelector(UISelector.itemList).innerHTML = html;
           
        },
        getSelectors: function(){
            return UISelector;
        },
        getInputItem: function(){
            return {
                name: document.querySelector(UISelector.itemName).value,
                calories:document.querySelector(UISelector.itemCalories).value
            }
        },
        addListItem: function(item){
            document.querySelector(UISelector.itemList).style.display = 'block';

            const li = document.createElement('li');

            li.className += 'collection-item';
            
            li.id += `item-${item.id}`;

            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                <a href="#" class="edit-btn secondary-content"><i class="fa fa-pencil"></i></a>
            `

            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',
            li);
        },

        updateListItem: function(updatedItem){

            let listItems = document.querySelectorAll(UISelector.listItems);

            //converting node list to array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                
                const listItemId = item.id;

                if(listItemId === `item-${updatedItem.id}`){
                    item.innerHTML = `
                    <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} calories</em>
                    <a href="#" class="edit-btn secondary-content"><i class="fa fa-pencil"></i></a>
                    `
                }

            })
        },
        removeItem: function(id){

            const itemid = `#item-${id}`;

            const listItem = document.querySelector(itemid);

            listItem.remove();


            if(itemCtrl.getItems().length === 0){
                UICtrl.hideList();
            }
        },

        clearListItems: function () {
            
            let listItems = document.querySelectorAll(UISelector.listItems);

            //Converting from nodelist to array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            })

        },

        hideList: function(){
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        clearInputFields: function(){
            document.querySelector(UISelector.itemName).value = '';
            document.querySelector(UISelector.itemCalories).value = '';
        },
        setInputField: function(){
            document.querySelector(UISelector.itemName).value = itemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCalories).value = itemCtrl.getCurrentItem().calories;
        },
        showEditState: function(){
            this.setInputField();
            document.querySelector(UISelector.addBtn).style.display = 'none';
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
        },
        clearEditState: function(){
            this.clearInputFields();
            document.querySelector(UISelector.addBtn).style.display = 'inline';
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';

        },
        populateTotalCalories: function(totalCalories){
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        }

    }


})();

const appCtrl = (function(itemCtrl,StorageCtrl, UICtrl){

    //load event listeners
    const loadEventListners = function(){

        //Fetch UI selectors
        const UISelector = UICtrl.getSelectors();

        //Add meal event
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit)

        //Disabling 

        //Event Delgation to the edit button
        document.querySelector(UISelector.itemList).addEventListener('click', clickEditItem)

        //Updating the item
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit)

        //Deleting an item
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit)

        //Clear All button
        //Deleting an item
        document.querySelector(UISelector.clearBtn).addEventListener('click', clearItemClick)

        //Back button
        document.querySelector(UISelector.backBtn).addEventListener('click', function(){
            UICtrl.clearEditState();
        })

    }

    //Add and submit item
    function itemAddSubmit(e){
        //Getting input item
        const item = UICtrl.getInputItem();
        
        //Checking for the input value is not blank
        if(item.name !== '' && item.calories !== ''){
             //adding to the items in datastructure
            const newItem = itemCtrl.addItem(item);

            //adding item to the list in the UI
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = itemCtrl.getTotalCalories();

            //populate calories
            UICtrl.populateTotalCalories(totalCalories);

            //Storing item in ls
            StorageCtrl.storeItem(newItem);

            //clear input field
            UICtrl.clearInputFields();
        }

        e.preventDefault();
    }

    //Update Submit Item
    function clickEditItem(e){
        if(e.target.parentNode.classList.contains('edit-btn')){
            //Getting item id from list item
            const listId = e.target.parentNode.parentNode.id;
            
            //splitting the result to get just the id
            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            const item = itemCtrl.getItemById(id);

            //setting current item in datastructure
            itemCtrl.setCurentItem(item);

            //Show Edit State
            UICtrl.showEditState();

        }

        e.preventDefault();
    }

    //Update item on submit
    function itemUpdateSubmit(e){
        
        const item = UICtrl.getInputItem();

        const updatedItem = itemCtrl.updateItem(item);

        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = itemCtrl.getTotalCalories();

        //populate calories
        UICtrl.populateTotalCalories(totalCalories);

        //updating item in ls
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Deleting an item
    function itemDeleteSubmit(){

        const currentItem = itemCtrl.getCurrentItem();

        //deleting item from the datastructure
        itemCtrl.deleteItem(currentItem.id);

        //Removing item from the ui
        UICtrl.removeItem(currentItem.id);

        //Get total calories
        const totalCalories = itemCtrl.getTotalCalories();

        //populate calories
        UICtrl.populateTotalCalories(totalCalories);

        //Deleting item from storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

    }

    //Clearing all the item
    function clearItemClick() {
        //clearing all the items from the datastructure
        itemCtrl.clearAllItems();

        //clear all the items from the ui
        UICtrl.clearListItems();

        //Get total calories
        const totalCalories = itemCtrl.getTotalCalories();

        //populate calories
        UICtrl.populateTotalCalories(totalCalories);

        //Clearing all the items from the storage
        StorageCtrl.clearItemsFromStorage();

        UICtrl.hideList();


    }

    return{
        //public methods
        init: function(){
            //clearing edit state
            UICtrl.clearEditState();

            //loading eventlisteners
            loadEventListners();

            //Fetch items from datastructure
            const items = itemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            }
            else{

                //Populate items in the ui
                UICtrl.populateItemList(items);
            }

            //Get total calories
            const totalCalories = itemCtrl.getTotalCalories();

            //populate calories
            UICtrl.populateTotalCalories(totalCalories);

        }
    }

})(itemCtrl,StorageCtrl, UICtrl);

appCtrl.init();

