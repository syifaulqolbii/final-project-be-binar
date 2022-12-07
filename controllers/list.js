import fetch from 'node-fetch';

module.exports = {
    listAirport: async (req, res) => {
        try {
            const response = await fetch('https://port-api.com/airport/search/indonesia');
            const data = await response.json();
            if(!data){
                res.status(404).json({
                    status: false,
                    message : "Airport not found",
                    data : null
                })
            }
            if (data) {
                const features = data.features;
                let responseData = [];
                features.forEach(function (data, index) {
                    responseData[index] = {
                        name: data.properties.name,
                        region: data.properties.region.name,
                        code : data.properties.iata
                    }
                });

                res.status(200).json({
                    status:true,
                    message: "Data Airport",
                    data: responseData
                });
            }

        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }
}