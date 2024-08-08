
var gallery 
var worksData = [];
var token = localStorage.getItem('token');



const apiUrl = 'http://localhost:5678/api';
const filterId={
    'all' : 0,
    'objets' : 1,
    'appartements':2,
    'hotels-restaurants':3}
    
document.addEventListener("DOMContentLoaded", () => {
    gallery = document.getElementById('gallery');

    // bouton "Tous"
    document.getElementById('all').addEventListener('click', () => {
        displayWorks(worksData,'all');
    });

    //  bouton "Objets"
    document.getElementById('objets').addEventListener('click', () => {
        displayWorks(worksData,'objets');
    });

    //  bouton "Appartements"
    document.getElementById('appartements').addEventListener('click', () => {
        displayWorks(worksData,'appartements');
    });

    // bouton "Hotels & restaurants"
    document.getElementById('hotels-restaurants').addEventListener('click', () => {
        displayWorks(worksData,'hotels-restaurants');
    });

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


function displayWorks(works,id) {
    gallery.innerHTML =''
    id = filterId[id]

    works.forEach(work => {
        var categoryId = work.categoryId
        if (categoryId == id) {
            createGallery(work)
        }
        else if (id == 0){
            createGallery(work)
        }
    });
};
