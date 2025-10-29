// Templates de email para el sistema de ecommerce

/**
 * Template para confirmación de compra/reserva
 * @param {Object} data - Datos para el template
 * @param {string} data.emailCompra - Email del cliente
 * @param {Array} data.items - Items del carrito
 * @param {number} data.totalItems - Total de items
 * @param {number} data.totalPrice - Precio total
 * @param {Function} data.formatPrice - Función para formatear precios
 * @param {Function} data.getImageUrlWithFallback - Función para obtener URLs de imágenes
 * @returns {string} HTML del email
 */
export const createPurchaseConfirmationTemplate = (data) => {
  const { emailCompra, items, totalItems, totalPrice, formatPrice, getImageUrlWithFallback } = data;
  
  const productosDetalle = items.map(item => `
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 15px; text-align: left;">
        <div style="display: flex; align-items: center;">
          <div style="margin-right: 15px;">
            <img src="${getImageUrlWithFallback(item.imagen_principal)}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          </div>
          <div>
            <strong style="color: #333; font-size: 16px;">${item.nombre}</strong>
            ${item.marca?.nombre ? `<br><span style="color: #666; font-size: 14px;">Marca: ${item.marca.nombre}</span>` : ''}
          </div>
        </div>
      </td>
      <td style="padding: 15px; text-align: center; color: #666;">${item.quantity}</td>
      <td style="padding: 15px; text-align: center; color: #333; font-weight: bold;">${formatPrice(item.precio)}</td>
      <td style="padding: 15px; text-align: center; color: #9a4dcf; font-weight: bold;">${formatPrice(item.precio * item.quantity)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Confirmación de Reserva - Gamer Once, Gamer Always</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1);
        color: #333;
      }

      .container {
        max-width: 700px;
        background: #fff;
        margin: 30px auto;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #9a4dcf;
      }

      .header h1 {
        color: #9a4dcf;
        margin: 0;
        font-size: 28px;
      }

      .header p {
        color: #666;
        margin: 5px 0 0 0;
        font-size: 16px;
      }

      .order-info {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }

      .products-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .products-table th {
        background: #9a4dcf;
        color: white;
        padding: 15px;
        text-align: left;
        font-weight: bold;
      }

      .products-table td {
        padding: 15px;
        border-bottom: 1px solid #eee;
      }

      .total-section {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: right;
      }

      .total-amount {
        font-size: 24px;
        font-weight: bold;
        color: #9a4dcf;
        margin: 10px 0;
      }

      .payment-methods {
        background: #e8f4fd;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        border-left: 4px solid #2196F3;
      }

      .payment-methods h3 {
        color: #1976D2;
        margin-top: 0;
      }

      .payment-methods ul {
        margin: 10px 0;
        padding-left: 20px;
      }

      .payment-methods li {
        margin: 8px 0;
        color: #333;
      }

      .whatsapp-section {
        background: #e8f5e8;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
        border-left: 4px solid #4CAF50;
      }

      .whatsapp-button {
        display: inline-block;
        background: #25D366;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 25px;
        font-weight: bold;
        margin: 10px 0;
        transition: background 0.3s;
      }

      .whatsapp-button:hover {
        background: #128C7E;
      }

      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 14px;
        color: #666;
      }

      .brand {
        text-align: center;
        margin-top: 20px;
        font-size: 20px;
        font-weight: bold;
        color: #9a4dcf;
      }

      .important-note {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        color: #856404;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>🎮 ¡Reserva Confirmada! 🎮</h1>
        <p>Gracias por tu compra en Gamer Once, Gamer Always</p>
      </div>

      <div class="order-info">
        <h3 style="margin-top: 0; color: #9a4dcf;">📋 Detalles de tu Reserva</h3>
        <p><strong>📧 Email:</strong> ${emailCompra}</p>
        <p><strong>📅 Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p><strong>🛍️ Productos:</strong> ${totalItems} artículos</p>
      </div>

      <h3 style="color: #9a4dcf;">🛒 Productos Reservados</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th style="text-align: center;">Cantidad</th>
            <th style="text-align: center;">Precio Unit.</th>
            <th style="text-align: center;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${productosDetalle}
        </tbody>
      </table>

      <div class="total-section">
        <div style="margin-bottom: 10px;">
          <span style="font-size: 16px; color: #666;">Subtotal: ${formatPrice(totalPrice)}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="font-size: 16px; color: #4CAF50;">Envío: GRATIS</span>
        </div>
        <div class="total-amount">
          Total a Pagar: ${formatPrice(totalPrice)}
        </div>
      </div>

      <div class="important-note">
        <strong>⚠️ Importante:</strong> Esta es una reserva de productos. Para completar tu compra, debes realizar el pago y coordinar el envío contactándote con nosotros.
      </div>

      <div class="payment-methods">
        <h3>💳 Métodos de Pago Disponibles</h3>
        <ul>
          <li><strong>Tarjetas de Crédito:</strong> Visa, MasterCard, American Express</li>
          <li><strong>Tarjetas de Débito:</strong> Todas las tarjetas de débito</li>
          <li><strong>Transferencia Bancaria:</strong> CBU disponible al contactarnos</li>
          <li><strong>Efectivo:</strong> Pago contra entrega (consultar disponibilidad)</li>
        </ul>
      </div>

      <div class="whatsapp-section">
        <h3 style="color: #4CAF50; margin-top: 0;">📱 ¡Contactanos para Finalizar tu Compra!</h3>
        <p>Para procesar el pago y coordinar el envío, comunícate con nosotros por WhatsApp:</p>
        <a href="https://wa.me/573178520111?text=Hola! Quiero finalizar mi compra. Email: ${emailCompra}" class="whatsapp-button" target="_blank">
          💬 Contactar por WhatsApp
        </a>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
          Horario de atención: Lunes a Viernes 9AM - 6PM
        </p>
      </div>

      <div class="footer">
        <p>Gracias por confiar en nosotros para tu setup gaming 💜</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <div class="brand">🎮 Gamer Once, Gamer Always 🎮</div>
      </div>
    </div>
  </body>
</html>`;
};

/**
 * Template para confirmación de consulta de contacto
 * @param {Object} data - Datos para el template
 * @param {string} data.nombre - Nombre del cliente
 * @param {string} data.email - Email del cliente
 * @param {string} data.consulta - Consulta del cliente
 * @returns {string} HTML del email
 */
export const createContactConfirmationTemplate = (data) => {
  const { nombre, email, consulta } = data;
  
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Gracias por tu consulta - Gamer Once, Gamer Always</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1);
        color: #333;
      }

      .container {
        max-width: 600px;
        background: #fff;
        margin: 50px auto;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      h2 {
        color: #9a4dcf;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        color: #444;
      }

      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #666;
      }

      .brand {
        text-align: center;
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #9a4dcf;
      }

      hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 20px 0;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>¡Gracias por tu consulta!</h2>
      <p>
        Hola <strong>${nombre}</strong>, gracias por comunicarte con nosotros.
        Tu mensaje fue recibido correctamente y uno de nuestros representantes se pondrá en contacto contigo a la brevedad.
      </p>

      <p><strong>Detalle de tu consulta:</strong></p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong> ${consulta}</p>

      <hr />

      <p>📅 Fecha de envío: ${new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>

      <div class="footer">
        <p>Gracias por confiar en nosotros 💜</p>
        <div class="brand">Gamer Once, Gamer Always</div>
      </div>
    </div>
  </body>
</html>`;
};

/**
 * Template para email de bienvenida/registro
 * @param {Object} data - Datos para el template
 * @param {string} data.userName - Nombre del usuario
 * @param {string} data.userEmail - Email del usuario
 * @returns {string} HTML del email
 */
export const createWelcomeEmailTemplate = (data) => {
  const { userName, userEmail } = data;
  
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>¡Bienvenido a Gamer Once, Gamer Always!</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1);
        color: #333;
      }

      .container {
        max-width: 600px;
        background: #fff;
        margin: 50px auto;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      h2 {
        color: #9a4dcf;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        color: #444;
      }

      .highlight {
        color: #9a4dcf;
        font-weight: bold;
      }

      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #666;
      }

      .brand {
        text-align: center;
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #9a4dcf;
      }

      hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 20px 0;
      }

      .button {
        display: inline-block;
        padding: 12px 24px;
        background: linear-gradient(90deg, #ba83ca, #9a9ae1);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 15px;
        transition: opacity 0.3s ease;
      }

      .button:hover {
        opacity: 0.9;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>¡Bienvenido a la comunidad Gamer!</h2>
      <p>
        Hola <strong>${userName}</strong>, gracias por registrarte en 
        <span class="highlight">Gamer Once, Gamer Always</span>. 🎮  
        Ya sos parte de una comunidad que vive y disfruta del gaming como vos.
      </p>

      <p>
        Desde ahora vas a poder acceder a ofertas exclusivas, lanzamientos y novedades de productos gamer.
      </p>

      <p>
        Te damos la bienvenida con todo nuestro entusiasmo 💜  
        ¡Estamos felices de tenerte con nosotros!
      </p>

      <hr />

      <p>📅 Fecha de registro: ${new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>

      <div style="text-align: center;">
        <a href="http://localhost:5173/" class="button">Visitar Tienda</a>
      </div>

      <div class="footer">
        <p>Gracias por elegirnos 💜</p>
        <div class="brand">Gamer Once, Gamer Always</div>
      </div>
    </div>
  </body>
</html>`;
};
