let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []
let previouslyFocusedElement = null

var gallery 
var worksData = [];

const apiUrl = 'http://localhost:5678/api';
const filterId={
    'all' : 0,
    'objets' : 1,
    'appartements':2,
    'hotels-restaurants':3}

document.addEventListener("DOMContentLoaded", () => {
    gallery = document.getElementById('gallery');
    fetchWorks();
    setModal()
    setModalAdd()
})

function handleClickOutside(event,modalClass) {
    if (!document.querySelector(modalClass + ' .modal-wrapper').contains(event.target)) {
        closeModal(event)
    }
}

document.querySelectorAll('.js-modal-close').forEach(button => {
    button.addEventListener('click', closeModal);
});

function setModal(){
    document.querySelector('.js-modal').addEventListener('click' , function(){
        openModal('modal')
        createGalleryForModal()
    })
    document.getElementById("modal").addEventListener('click',function(event){
        handleClickOutside(event,'#modal')
    })
}

function setModalAdd(){
    document.querySelector('.add-photo').addEventListener('click' , function(event){
        closeModal(event)
        openModal('modal-add')
    })
    document.getElementById("modal-add").addEventListener('click',function(event){
        handleClickOutside(event,'#modal-add')
    })
}

function openModal(id) {
    modal = document.getElementById(id)
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    modal.style.display = null
    focusables[0].focus()
    modal.setAttribute('aria-hidden','false')
    modal.setAttribute('aria-modal','true')
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    // to do à dégager
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

function toAddmodal() {
    document.getElementById('modal').style.display ='none';
    openModal('modal-add')
}

function closeModal(event) {
    event.preventDefault()
    if (modal === null) {
        console.log('hey')
        return
    }
    if (previouslyFocusedElement !== null) {
        previouslyFocusedElement.focus()
    }
    modal.style.display = "none"
    modal.setAttribute('aria-hidden','true')
    modal.setAttribute('aria-modal','false')

    // Remove all child nodes of the modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent){
        while (modalContent.firstChild) {
            modalContent.removeChild(modalContent.firstChild);
        }
    }

    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftkey === true){
        index--
    } else {
    index++

    }
    if (index >= focusables.length) {
        index = 0 
    }
    if(index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}



window.addEventListener('keydown' , function (event) {
    if (event.key === "Escape" || event.key === "esc") {
        closeModal(event)
    }
    if (event.key === "Tab" && modal !=null) {
        focusInModal(event)
    }
})

const createIcon= function(className) {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', className);
    icon.style.color = 'black';
    return icon;
}

function createGalleryForModal(){
    const gallery = document.getElementById('gallery');
    
    if (!gallery) return;

    const images = gallery.querySelectorAll('img');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.display = 'flex';
    modalContent.style.flexWrap = 'wrap';
    modalContent.style.justifyContent = 'space-between';

    images.forEach(img => {
            // Appel à la fonction createImageContainer pour créer le conteneur d'image
            const imageContainer = createImageContainer(img);

            // Appel à la fonction createDeleteButton pour créer le bouton de suppression
            const deleteButton = createDeleteButton();
    
            imageContainer.appendChild(deleteButton);
            modalContent.appendChild(imageContainer);
    });
}
   
const createDeleteButton = function() {
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-button';
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.style.position = 'absolute';
    deleteButton.style.top = '5px';
    deleteButton.style.right = '5px';
    deleteButton.style.background = 'black';
    deleteButton.style.border = 'none';
    deleteButton.style.color = 'white';
    deleteButton.style.width = '17px';
    deleteButton.style.height = '17px';
    deleteButton.style.display = 'flex';
    deleteButton.style.alignItems = 'center';
    deleteButton.style.justifyContent = 'center';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.borderRadius = '2px';

    // Ensure the icon is white and centered
    const icon = deleteButton.querySelector('i');
    icon.style.color = 'white';
    icon.style.width = '9px';
    icon.style.height = '11px';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';

    return deleteButton;
}

const createImageContainer = function(img) {
    const imageContainer = document.createElement('div');
    imageContainer.style.position = 'relative';
    imageContainer.style.width = 'calc(20% - 15px)';
    imageContainer.style.height = '102px';
    imageContainer.style.marginBottom = '10px';

    const clonedImg = img.cloneNode(true);
    clonedImg.style.width = '100%';
    clonedImg.style.height = '100%';

    imageContainer.appendChild(clonedImg);

    return imageContainer;
}

document.addEventListener("DOMContentLoaded", () => {
    gallery = document.getElementById('gallery');
    fetchWorks();
});

async function fetchWorks() {
    try {
        let rWorkData = await fetch(`${apiUrl}/works`);
        if (rWorkData.ok) {
            worksData =  await rWorkData.json();
            displayWorks(worksData,'all')
        } 
    } catch (error) {
        console.error('Erreur:', error);
    }
};

function createGallery(work){

    let figureElement = document.createElement('div');
    figureElement.className = 'figure';
    
    let imgElement = document.createElement('img');
    imgElement.className = 'work-image';
    imgElement.src = work.imageUrl; 
    imgElement.alt = work.title;
    
    let captionElement = document.createElement('figtitle');
    captionElement.className = 'work-title';
    captionElement.textContent = work.title;
    
    figureElement.appendChild(imgElement);
    figureElement.appendChild(captionElement);
    
    gallery.appendChild(figureElement);
}


function displayWorks(works) {
    gallery.innerHTML =''
    works.forEach(work => {
            createGallery(work)

    });
};

// async function sendProject(login){
//     try {
//         let response = await fetch(`${apiUrl}/works`, {
//             headers: { "Content-Type": "application/json" },
//             method: "POST",
//             body: 
//         })
//         if (response.ok) {
//             token = await response.json();
//             localStorage.setItem('token', token);  // Stocke le token dans localStorage
//             window.location.href = "editpage.html"
//         }
//     } catch (error) {
//         console.error('Erreur:', error);
//     }
// }