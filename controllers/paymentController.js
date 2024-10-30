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
                    id:'10291723',
                    unit_price: 400,
                    quantity: 1,
                    title: "Yerba",
                    currency_id:'ARS',
                    
                
                }
            ],
            notification_url:'https://l947bxd2-3003.brs.devtunnels.ms/payment/webhook',
            payer :{

                name:'Franco',
                surname:'Gimenez',
                email:'franco@gmail.com',
                address:{
                    zip_code:'2900',
                    street_name:'Acevedo',
                    street_number:831
                }

            },
           
            
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
    
    if (req.body.data && req.body.data.id) {

      const id = req.body.data.id;


      const payment = await new Payment(client).get({id});
     
      console.log("Estadooooooooooo: ", payment.status);

      
    } 
  
    
    res.status(200).send('OK');
  };
  
  
  
  
  

module.exports = { crearPago, successPayment, failurePayment, pendingPayment ,recibirNotificacion};
