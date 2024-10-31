require('dotenv').config();
const { text } = require('express');
const mercadopago = require('mercadopago');
const { Payment, MercadoPagoConfig , Preference } = mercadopago;

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });



const crearPago = async (req, res) => {
  const { id,title, description, amount, currency,name,surname,email, zip_code, street_name, street_number } = req.body;



  try {
    const preference= await new Preference(client).create({
        body:{
            items:[

                {
                    id:id+'',
                    unit_price: amount,
                    quantity: 1,
                    title: description,
                    currency_id:currency,
                    
                
                }
            ],
            notification_url:'https://l947bxd2-3003.brs.devtunnels.ms/payment/webhook',
            payer :{

                name:name,
                surname:surname,
                email:email,
                address:{
                    zip_code:zip_code,
                    street_name:street_name,
                    street_number:street_number
                }

            },
           
            
            metadata:{
                text
            }

        }


    });

    const url= preference.init_point;

    res.status(200).json({ url:url });

    
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
