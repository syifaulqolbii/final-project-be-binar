const fetch = require("node-fetch");
const { List } = require("../db/models");

module.exports = {
  createListAirport: async (req, res) => {
    try {
      // const response = await fetch(
      //   "https://port-api.com/airport/search/indonesia"
      // );
      // const data = await response.json();
      // if (!data) {
      //   res.status(404).json({
      //     status: false,
      //     message: "Airport not found",
      //     data: null,
      //   });
      // }
      // if (data) {
      //   const features = data.features;

      //   let responseData = [];
      //   features.forEach(function (data, index) {
      //     responseData[index] = {
      //       name: data.properties.name,
      //       region: data.properties.region.name,
      //       code: data.properties.iata,
      //     };
      //   });

      //   for (let i = 0; i < responseData.length; i++) {
      //     // Mencari dan mengganti kurung dan isi kurung dengan string kosong
      //     responseData[i].name = responseData[i].name.replace(/\([^)]*\)/g, "");
      //     responseData[i].region = responseData[i].region.replace(
      //       /\([^)]*\)/g,
      //       ""
      //     );
      //   }

      //   // Inisialisasi variabel hasil
      //   let result = [];

      //   // Menyimpan elemen ke-2 dari data JSON ke dalam variabel hasil
      //   result.push(
      //     responseData[4],
      //     responseData[5],
      //     responseData[6],
      //     responseData[37],
      //     responseData[121],
      //     responseData[122],
      //     responseData[58]
      //   );
      const { name, region, code } = req.body;
      const listResult = await List.create({
        name,
        region,
        code,
      });

      res.status(200).json({
        status: true,
        message: "Data Airport",
        data: listResult
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  getListAirport: async (req, res, next) => {
    try {
      const listResult = await List.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] }
      });

      res.status(200).json({
        status: true,
        message: "Data Airport",
        data: listResult
      });
    } catch (error) {
      next(error);
    }
  }
};
