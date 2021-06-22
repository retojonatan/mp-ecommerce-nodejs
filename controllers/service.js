
const axios = require("axios");

class PaymentService {
  constructor() {
    this.tokensMercadoPago = {
      prod: {},
      test: {
        access_token:
          "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398" 
     // el access_token de MP
      }
    }; 
    // declaramos de la siguiente manera el token
    // para que sea más fácil cambiarlo dependiendo del ambiente
    this.mercadoPagoUrl = "https://api.mercadopago.com/checkout";
    // declaramos la url en el constructor para poder accederla a lo largo de toda la class
  }

   async createPaymentMercadoPago(title, price, unit, img) {
     const url = `
    ${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}
    `;
     
     const items = [
      {
        id: "1234", 
        title: title, 
        description: "Dispositivo móvil de Tienda e-commerce", 
        picture_url:  "https://retojonatan-mp-commerce-nodejs.herokuapp.com/"+ img, 
        // picture_url:  path.join(__dirname, img), 
        category_id: "1234",
        quantity: parseInt(unit),
        // id de la moneda, que tiene que ser en ISO 4217
        currency_id: "ARS",
        unit_price: parseFloat(price)
      }
    ];  
     
     const preferences = {
      items, 
      external_reference: "retojonatanuy@gmail.com",
      payer: { 
        // información del comprador, si estan en producción tienen que traerlos del request
        //(al igual que hicimos con el precio del item) 
        name: "Lalo",
        surname: "Landa",
        email: "test_user_63274575@testuser.com",
      // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba si estan 
      //en producción, deberian completar esta información 
      //de la misma manera que lo hicimos con items, units, y price
        phone: {
          area_code: "11",
          number: "22223333"
        },
        address: {
          zip_code: "1111",
          street_name: "Falsa",
          street_number: "123"
        }
      }, 
      payment_methods: {
        excluded_payment_methods: [
          {
            id: "amex"
          }
        ],
        excluded_payment_types: [{ id: "atm" }],
        installments: 6, 
        // mayor cantidad de cuotas permitidas
        default_installments: 6
      }, 
      back_urls: {
        // url a la que va a redireccionar
        success: "https://retojonatan-mp-commerce-nodejs.herokuapp.com/success", 
        pending: "https://retojonatan-mp-commerce-nodejs.herokuapp.com/pending",
        failure: "https://retojonatan-mp-commerce-nodejs.herokuapp.com/failure"
      }, 
      notification_url: "https://retojonatan-mp-commerce-nodejs.herokuapp.com/webhook", 
      // declaramos nuestra url donde recibiremos las notificaciones
      // es la misma ruta que declaramos en app.js
      auto_return: "approved" 
      // si es exitosa automaticamente redirige a "success" de back_urls
    };

     try {
      const request = await axios.post(url, preferences, {
        headers: {
          "Content-Type": "application/json",
          "x-integrator-id": "dev_24c65fb163bf11ea96500242ac130004"
        }
      });
      // data que devuelve el POST
      return request.data;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = PaymentService;