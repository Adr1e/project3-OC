const formData = new FormData();

let modal = null
let focusables = []
let previouslyFocusedElement = null

let gallery 
let worksData = [];
let category
let title
let imageUrl
const token = JSON.parse(localStorage.getItem('token')).token

let cadrePhoto = document.querySelector('.cadre-photo');
let photoIcon = cadrePhoto.querySelector('.photo-icon');
let maxSizeText = cadrePhoto.querySelector('h5');
let labelText = cadrePhoto.querySelector('.button-add-photo');
let inputFile = document.getElementById('input-file');
let img = document.getElementById('pre-img')
let sendButton = document.getElementById('send-project')

let projectIds = getAllIds(worksData);
let deleteButtonId
let targetId

const apiUrl = 'http://localhost:5678/api';
const focusableSelector = "button, a, input, textarea"


document.addEventListener("DOMContentLoaded", () => {
    gallery = document.getElementById('gallery');
    fetchWorks();
    setModal()
    setModalAdd()
})

// Add an event listener to the file input field
inputFile.onchange = function(){
    img.src = URL.createObjectURL(inputFile.files[0])
    console.log(inputFile.files[0])
    const file = inputFile.files[0]
    formData.append('image', file);

    // If there is an existing image element, replace it with the new image
    if (img) {
        img.width = 150;
        img.height = 195;
        img.style.display = 'flex'
    }

    // Hide the photo-icon div and the h5 element

    if (photoIcon) {
      photoIcon.style.display = 'none';
    }
    if (maxSizeText) {
      maxSizeText.style.display = 'none';
    }
    if (labelText) {
        labelText.style.display = 'none';
      }

};

sendButton.addEventListener('click',function(){
    sendProject()
})

document.querySelectorAll('.js-modal-close').forEach(button => {
    button.addEventListener('click', function(){
        backToModal()
        resetAddmodal()
    });
});

document.getElementById('come-back-button').addEventListener('click', function(){
    backToModal()
    resetAddmodal()
});

window.addEventListener('keydown' , function (event) {
    if (event.key === "Escape" || event.key === "esc") {
        closeModal(event)
    }
    if (event.key === "Tab" && modal !=null) {
        focusInModal(event)
    }
})

function handleClickOutside(event,modalClass) {
    if (!document.querySelector(modalClass + ' .modal-wrapper').contains(event.target)) {
        closeModal(event)
        resetAddmodal()
    }
}

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
}

function toAddmodal() {
    document.getElementById('modal').style.display ='none';
    openModal('modal-add')
}

function backToModal() {
    document.getElementById('modal-add').style.display ='none';
    openModal('modal')
    createGalleryForModal()
}

function closeModal(event) {
    event.preventDefault()
    if (modal === null) {
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

function resetAddmodal() {
    photoIcon.style.display ='flex'
    maxSizeText.style.display ='flex'
    labelText.style.display ='flex'
    img.src = ''
    img.style.display = 'none'
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
            const deleteButton = createDeleteButton(img.id);
            console.log(img.id)
            imageContainer.appendChild(deleteButton);
            modalContent.appendChild(imageContainer);
    });
}

const createDeleteButton = function(id) {
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-button';
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

    // Ensure the icon is white and centered
    const icon = deleteButton.querySelector('i');
    icon.style.color = 'white';
    icon.style.width = '9px';
    icon.style.height = '11px';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';


    deleteButton.addEventListener('click', function() {
        console.log(id)
        deleteProject(id) 
    });
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
    imgElement.id = work.id
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

async function deleteProject(id){
    try {
        let response = await fetch(`${apiUrl}/works/${id}`, {
            headers: { 
                Authorization: `Bearer ${token}`
            },
            method: "DELETE",
        })
        if (response.ok) {
            console.log('succès')
            console.log(response)
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
    
}


async function sendProject(){
    title = document.getElementById('title').value
    category = document.getElementById('category').value
    console.log(category)
    formData.append("title",title)
    formData.append("category",parseInt(category))
    console.log(category)
    try {
        let response = await fetch(`${apiUrl}/works`, {
            headers: { 
            
                Authorization: `Bearer ${token}`
            },
            method: "POST",
            body: formData
        })
        if (response.ok) {
            console.log('succès')
            console.log(response)
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
    
}


function getAllIds(worksData) {
    let projectIds = [];
    for (let i = 0; i < worksData.length; i++) {
        projectIds.push(worksData[i]);
    }
    return projectIds;
}

class project{
    constructor(imageURL,title,category){
        this.imageURL = imageURL
        this.title = title
        this.category = category
    }

    toDictionary(){
        return {
            'image': this.imageURL,
            'title': this.title,
            'category': this.category
        };
    }
}