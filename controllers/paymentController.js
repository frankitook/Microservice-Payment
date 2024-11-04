require('dotenv').config();
const { text } = require('express');
const mercadopago = require('mercadopago');
const { Payment, MercadoPagoConfig , Preference } = mercadopago;

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });



const crearPago = async (req, res) => {
  const { id,title, description, amount, currency,name,surname,email, zip_code, street_name, street_number } = req.body;


  const notificationUrl = `https://3t9v70w8-3003.brs.devtunnels.ms/payment/webhook/${id}`;

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

      

      if (payment.status === 'approved') {
        newStatus = 'Completada';
        
        
        const cartResponse = await fetch(`http://localhost:3002/cart/${idOrder}`);

        if (!cartResponse.ok) {
          throw new Error('Error al obtener los productos del carrito');
        }

        const productosDelCarrito = await cartResponse.json();
        
        
        await Promise.all(productosDelCarrito.map(async (item) => {
          
          const productoResponse = await fetch(`http://localhost:3001/products/${item.idProducto}`);
        
          if (!productoResponse.ok) {
            throw new Error(`Error al obtener el producto ${item.idProducto}`);
          }
        
          const producto = await productoResponse.json();
          const stockActual = producto.stock;
        
          
        
          
          const actualizarStockResponse = await fetch(`http://localhost:3001/products/${item.idProducto}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              stock: stockActual - item.cantidad
            })
          });
        
          if (!actualizarStockResponse.ok) {
            throw new Error(`Error al actualizar el stock del producto ${item.idProducto}`);
          }
        }));
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
        body: JSON.stringify({ estado: newStatus, comprobante: id + "" })
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
