const { ipcRenderer } = require('electron');
const items = require('./items')

// Dom Nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url')
    search = document.getElementById('search')

// Open new item modal
window.newItem = () => {
    showModal.click()
}

// Ref items.open globally
window.openItem = items.open

// Ref items.delete globally
window.deleteItem = () => {
    let selectedItem = items.getSelectedItem()
    items.delete(selectedItem.index)
}

// Open item in native browser
window.openItemNative = items.openNative

// Focus to search items
window.searchItems = () => {
    search.focus()
}

// Filter items with "search"
search.addEventListener('keyup', e => {
    // Loop items
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        // Hide items that don't match search value
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})

// Navigate item selection with up/down arrows
document.addEventListener('keydown', e => {
    if(e.key == 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

// Disable & Enable modal buttons
const toggleModalButtons = () => {
    // Check state of buttons
    if (addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

// Show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
})

// Hide modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
})

// Handle new item
addItem.addEventListener('click', e => {
    // Check if url exists
    if (itemUrl.value) {
        // Send new item url to main process
        ipcRenderer.send('new-item', itemUrl.value);

        // Disable buttons
        toggleModalButtons();
    }
})

// Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    // Add new item to "items" node
    items.addItem(newItem, true)

    // Enable buttons
    toggleModalButtons();

    // Hide modal and clear value
    modal.style.display = 'none';
    itemUrl.value = '';
})

// Listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        addItem.click();
    }
})