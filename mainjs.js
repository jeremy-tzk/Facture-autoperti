document.addEventListener('DOMContentLoaded', function() {
    // Ajouter une nouvelle ligne
    document.getElementById('add-row').addEventListener('click', function() {
        const tbody = document.querySelector('#services tbody');
        const newRow = document.createElement('tr');
        newRow.className = 'service-row';
        newRow.innerHTML = `
            <td contenteditable="true">Nouveau convoyage</td>
            <td><input type="number" class="qty" value="1" min="0" step="1"></td>
            <td><input type="number" class="price" value="0.00" min="0" step="0.01"></td>
            <td>
                <select class="tva-select">
                    <option value="20">20%</option>
                    <option value="10">10%</option>
                    <option value="5.5">5.5%</option>
                    <option value="0">0%</option>
                </select>
            </td>
            <td class="total">0.00</td>
            <td><button class="remove-btn">×</button></td>
        `;
        tbody.appendChild(newRow);
        
        // Ajouter l'événement de suppression
        newRow.querySelector('.remove-btn').addEventListener('click', function() {
            newRow.remove();
        });
    });

    // Calculer les totaux
    document.getElementById('calculate-btn').addEventListener('click', calculateTotals);

    // Supprimer une ligne
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('tr').remove();
        });
    });
});

function calculateTotals() {
    let subtotal = 0;
    let tvaRate = 20; // Valeur par défaut
    
    document.querySelectorAll('.service-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const total = qty * price;
        
        // Mettre à jour le total de la ligne
        row.querySelector('.total').textContent = total.toFixed(2);
        
        subtotal += total;
        
        // Prendre le taux de TVA de la première ligne
        if (tvaRate === 20) {
            tvaRate = parseFloat(row.querySelector('.tva-select').value) || 0;
        }
    });

    const taxAmount = subtotal * (tvaRate / 100);
    const totalTTC = subtotal + taxAmount;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax-amount').textContent = taxAmount.toFixed(2);
    document.getElementById('tax-rate').textContent = tvaRate;
    document.getElementById('total-ttc').textContent = totalTTC.toFixed(2);
}

// Génération PDF
document.getElementById('generate-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const invoice = document.getElementById('invoice');
    const btn = this;
    
    btn.disabled = true;
    btn.textContent = "Génération en cours...";
    
    html2canvas(invoice).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save('facture-convoyage-' + document.getElementById('invoice-number').textContent + '.pdf');
        
        btn.disabled = false;
        btn.textContent = "Générer PDF";
    });
});