// Inicializar EmailJS
(function(){
    emailjs.init("1KV6NLkp_bJLZwwT7"); // Reemplaza con tu User ID de EmailJS
})();

// Lógica para el carrusel de menú destacado
const items = document.querySelectorAll('.menu-item');
let currentIndex = 0;

function showNextItem() {
    items.forEach((item, index) => {
        item.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
    currentIndex = (currentIndex + 1) % items.length;
}

// Inicia la presentación en bucle
setInterval(showNextItem, 4000);

// Establece la primera pizza visible inicialmente
document.addEventListener('DOMContentLoaded', () => {
    items[currentIndex].style.transform = 'translateX(0)';
});

// Añadir una pizza más al formulario
document.getElementById('addPizza').addEventListener('click', function() {
    const pizzasContainer = document.getElementById('pizzas');
    const newPizza = document.createElement('div');
    newPizza.classList.add('pizza');
    newPizza.innerHTML = `
        <label>Elige tu Pizza:</label>
        <select name="tipo-pizza">
            <option value="margarita" data-price="8.99">Pizza Margarita - $8.99</option>
            <option value="pepperoni" data-price="9.99">Pizza Pepperoni - $9.99</option>
            <option value="vegana" data-price="10.99">Pizza Vegana - $10.99</option>
            <option value="cuatro-quesos" data-price="11.99">Pizza Cuatro Quesos - $11.99</option>
            <option value="hawaiana" data-price="10.50">Pizza Hawaiana - $10.50</option>
            <option value="barbacoa" data-price="12.99">Pizza Barbacoa - $12.99</option>
            <option value="pollo-bbq" data-price="13.99">Pizza Pollo BBQ - $13.99</option>
            <option value="carbonara" data-price="14.50">Pizza Carbonara - $14.50</option>
            <option value="mexicana" data-price="12.00">Pizza Mexicana - $12.00</option>
            <option value="marinera" data-price="15.99">Pizza Marinera - $15.99</option>
        </select>

        <label>Tamaño:</label>
        <select name="tamano">
            <option value="pequena" data-multiplier="1">Pequeña</option>
            <option value="mediana" data-multiplier="1.5">Mediana</option>
            <option value="grande" data-multiplier="2">Grande</option>
        </select>

        <label>Ingredientes Extra:</label>
        <div class="extras">
            <label><input type="checkbox" name="ingredientes-extra" value="queso" data-price="1"> Queso</label>
            <label><input type="checkbox" name="ingredientes-extra" value="pepperoni" data-price="1.5"> Pepperoni</label>
            <label><input type="checkbox" name="ingredientes-extra" value="champinones" data-price="1"> Champiñones</label>
            <label><input type="checkbox" name="ingredientes-extra" value="aceitunas" data-price="0.5"> Aceitunas</label>
            <label><input type="checkbox" name="ingredientes-extra" value="cebolla" data-price="0.5"> Cebolla</label>
            <label><input type="checkbox" name="ingredientes-extra" value="tocino" data-price="2"> Tocino</label>
            <label><input type="checkbox" name="ingredientes-extra" value="pimientos" data-price="1"> Pimientos</label>
            <label><input type="checkbox" name="ingredientes-extra" value="jalapenos" data-price="1"> Jalapeños</label>
            <label><input type="checkbox" name="ingredientes-extra" value="anchoas" data-price="2"> Anchoas</label>
        </div>
    `;
    pizzasContainer.appendChild(newPizza);
});

// Escuchar el botón de Envío a Domicilio
document.getElementById('deliveryButton').addEventListener('click', function() {
    const direccionField = document.getElementById('direccion');
    if (direccionField.value.trim() === "") {
        alert("Por favor, ingresa una dirección para el envío a domicilio.");
    } else {
        alert("Envío a domicilio activado. Se utilizará la dirección proporcionada.");
    }
});

// Enviar el formulario
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Capturar los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value || 'Sin dirección';
    
    const pizzas = document.querySelectorAll('.pizza');
    let total = 0;
    let orderDetails = '';
    
    pizzas.forEach((pizza, index) => {
        const tipoPizza = pizza.querySelector('select[name="tipo-pizza"]');
        const precioPizza = parseFloat(tipoPizza.options[tipoPizza.selectedIndex].dataset.price);
        const nombrePizza = tipoPizza.options[tipoPizza.selectedIndex].text;

        const tamano = pizza.querySelector('select[name="tamano"]');
        const multiplicador = parseFloat(tamano.options[tamano.selectedIndex].dataset.multiplier);
        const nombreTamano = tamano.options[tamano.selectedIndex].text;

        const extras = pizza.querySelectorAll('input[name="ingredientes-extra"]:checked');
        let extraTotal = 0;
        let extrasNombres = [];
        extras.forEach(extra => {
            extraTotal += parseFloat(extra.dataset.price);
            extrasNombres.push(extra.value);
        });

        const subtotal = (precioPizza * multiplicador) + extraTotal;
        total += subtotal;

        orderDetails += `Pizza ${index + 1}: ${nombrePizza} (${nombreTamano}) - Extras: ${extrasNombres.join(', ')} - Subtotal: $${subtotal.toFixed(2)}\n`;
    });

    document.getElementById('total').textContent = total.toFixed(2);

    // Guardar datos en un objeto
    const data = {
        nombre,
        email,
        telefono,
        direccion,
        total: total.toFixed(2),
        orderDetails
    };

    // Enviar con EmailJS
    emailjs.send('service_tj955yp', 'template_cerckn6', data)
        .then(function() {
            alert('Pedido enviado con éxito. Te contactaremos pronto.');
        }, function(error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un error al enviar tu pedido. Por favor, intenta de nuevo.');
        });
});
