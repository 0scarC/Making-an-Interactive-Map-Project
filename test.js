async function getCoords() {
    var pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    var coords = [pos.coords.latitude, pos.coords.longitude]
    console.log(`Your location: ${coords[0]}, ${coords[1]}`)

    const map = L.map('map').setView(coords, 12)
    const layer = L.layerGroup([])

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '13',
    }).addTo(map)

    var redPin = {icon: L.icon({
        iconUrl: './assets/red-pin.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
    })}

    function newMarker(positionOne, positionTwo, text, location, special) {
        L.marker([positionOne, positionTwo], special).addTo(location).bindPopup(text).openPopup()
    }

    newMarker(coords[0], coords[1], '<b>You Are Here</b>', map, redPin)

    function BusinessSearch() {
        const btn = document.querySelector('#search')
        const inputs = document.getElementsByTagName('option')
        var count = 0


        btn.addEventListener('click', () => {
            //add method for removing popups
            count++
            console.log(count)

            if (count > 1) {
                layer.clearLayers()
            }

            for (const input of inputs) {
                var desiredLocation = input.value

                const options = {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      Authorization: 'fsq3UGiNdgSqWRo9y4S5oqb6bTOSEofh85xhaq1+GTRxIXc='
                    }
                };
            
                if (input.selected) {
                    fetch(`https://api.foursquare.com/v3/places/search?query=${desiredLocation}&ll=${coords[0]}%2C${coords[1]}&radius=5000`, options)
                    .then(response => response.json())
                    .then(response => {
                        for (var i = 0; i < response.results.length; i++) {
                            console.log(response.results[i].geocodes.main)
                            console.log(response.results[i].name)
                            newMarker(response.results[i].geocodes.main.latitude, response.results[i].geocodes.main.longitude, `<b>${response.results[i].name}</b>`, layer)
                            layer.addTo(map)
                        }
                    })
                    .catch(err => console.error(err));
                }
            }
        })


    }
    BusinessSearch()  
}
getCoords()