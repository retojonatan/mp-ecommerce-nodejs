class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService; 
  }
  async getMercadoPagoLink(req, res) {
    const { title, price, unit, img } = req.body;
    try {
      const checkout = await this.paymentService.createPaymentMercadoPago(
        title,
        price,
        unit,
        img
      );
      
      return res.redirect(checkout.init_point); 

    } catch (err) { 
      return res.status(500).json({
        error: true,
        msg: "Hubo un error con Mercado Pago"
      });
    }
  }

  async webhook(req, res) { 
    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        console.log(body, "webhook response");
        res.end("ok");
      });
    }
    return res.status(201);
  }
}

module.exports = PaymentController;