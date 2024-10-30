require('dotenv').config();
const { text } = require('express');
const mercadopago = require('mercadopago');
const { Payment, MercadoPagoConfig , Preference } = mercadopago;

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });



const crearPago = async (req, res) => {
  const { title, description, amount, currency } = req.body;


  try {
    const preference= await new Preference(client).create({
        body:{
            items:[

                {
                    id:'1234',
                    unit_price: 200,
                    quantity: 1,
                    title: "Product",
                    currency_id:'ARS'
                
                }
            ],
            notification_url:'http://localhost:3003/payment/webhook',
            metadata:{
                text
            }

        }


    });

    const url= preference.init_point;

    res.json({ url:url });

    
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la preferencia', error: error.message });
  }
};

const successPayment = async (req, res) => {
  res.send('¡Pago exitoso! Gracias por tu compra.');
};

const failurePayment = async (req, res) => {
  res.send('El pago ha fallado. Por favor, inténtalo de nuevo.');
};

const pendingPayment = async (req, res) => {
  res.send('El pago está pendiente. Te notificaremos una vez que se procese.');
};


const recibirNotificacion = async (req, res) => {
    try {
      const paymentId = req.query['data.id'];
      
      const payment = await new Payment(client).get({paymentId});


      if (payment.status === 'approved') {
        
        console.log("Notificación de pago recibida:", payment.body);
      }
  
      res.status(200).send('Notificación recibida'); 
    } catch (error) {
      console.error("Error al procesar la notificación:", error.message);
      res.status(500).send('Error al procesar la notificación');
    }
  };
  

module.exports = { crearPago, successPayment, failurePayment, pendingPayment ,recibirNotificacion};
