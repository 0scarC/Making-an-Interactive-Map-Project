async function getCoords() {
    let pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    let coords = [pos.coords.latitude, pos.coords.longitude]
    console.log('Your geolocation: ' + coords)

    const myMap = L.map('map', {
        center: [coords], 
        zoom: 10})

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: '14',
    }).addTo(myMap)

    var redPin = {icon: L.icon({
        iconUrl: './red-pin.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
    })}

    async function location(spot, text) {
        let marker = await L.marker(spot)
        marker.addTo(myMap)
        marker.bindPopup(text)
        marker.openPopup() 
    }
    location(coords, '<b>You Are Here</b>')

    function businessSearch() {
        const btn = document.querySelector('#submit')
        const inputs = document.getElementsByTagName('option')
        
        btn.addEventListener('click', () => {
            for (const input of inputs) {
                if (input.checked) {
                    let desiredLocation = input.value
                    console.log(desiredLocation)
                    async function locations() {
                        const options = {
                            method: 'GET',
                            headers: {
                            Accept: 'application/json',
                            Authorization: 'fsq3UGiNdgSqWRo9y4S5oqb6bTOSEofh85xhaq1+GTRxIXc='
                            }
                        };
            
                        await fetch(`https://api.foursquare.com/v3/places/search?query=${desiredLocation}&ll=${coords[0]}%2C${coords[1]}&radius=5000`, options)
                            .then(response => response.json())
                            .then(response => {
                                for (let i = 0; i < response.results.length; i++) {
                                    console.log(response.results[i].geocodes.main.latitude)
                                    console.log(response.results[i].geocodes.main.longitude)
                                    console.log(response.results[i].name)
                                }
                            })
                            .catch(err => console.error(err));
                    }
                    locations()
                }
            }
        })
    }
    businessSearch()
}
getCoords()

