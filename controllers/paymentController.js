require('dotenv').config();
const { text } = require('express');
const mercadopago = require('mercadopago');
const { Payment, MercadoPagoConfig , Preference } = mercadopago;

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });



const crearPago = async (req, res) => {
  const { id,title, description, amount, currency,name,surname,email, zip_code, street_name, street_number } = req.body;


  const notificationUrl = `https://l947bxd2-3003.brs.devtunnels.ms/payment/webhook/${id}`;

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
            notification_url:notificationUrl,
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



const recibirNotificacion = async (req, res) => {
  const { idOrder } = req.params;
  if (req.body.data && req.body.data.id) {
    const id = req.body.data.id;

    console.log(id);

    try {
      const payment = await new Payment(client).get({ id });
      let newStatus;
      
     console.log( payment.payment_type_id); 
      
      if (payment.status === 'approved') {
        newStatus = 'Completada';
      } else if (payment.status === 'pending') {
        newStatus = 'Pendiente';
      } else {
        newStatus = 'Cancelada';
      }

      
      const response = await fetch(`http://localhost:3002/pedidos/${idOrder}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: newStatus, comprobante: id+"" })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la orden');
      }

      console.log(`Estado de la orden actualizado a ${newStatus}`);
    } catch (error) {
      console.error('Error al recibir la notificación de pago:', error.message);
    }
  }

  res.status(200).send('OK');
};

  
  
  
  
  

module.exports = { crearPago ,recibirNotificacion};
