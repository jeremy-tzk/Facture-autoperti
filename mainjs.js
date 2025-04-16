
        // Calcul automatique des totaux
        document.addEventListener('DOMContentLoaded', function() {
            const table = document.getElementById('services');
            
            table.addEventListener('input', function(e) {
                const row = e.target.closest('tr');
                if (!row) return;
                
                const qty = parseFloat(row.children[1].textContent) || 0;
                const price = parseFloat(row.children[2].textContent) || 0;
                const totalCell = row.children[3];
                
                totalCell.textContent = (qty * price).toFixed(2);
                updateTotals();
            });
            
            // Initialiser les totaux
            updateTotals();
        });

        function updateTotals() {
            let subtotal = 0;
            document.querySelectorAll('#services .total').forEach(cell => {
                subtotal += parseFloat(cell.textContent);
            });
            
            const tax = subtotal * 0.2;
            const totalTTC = subtotal + tax;
            
            document.getElementById('subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('tax').textContent = tax.toFixed(2);
            document.getElementById('total-ttc').textContent = totalTTC.toFixed(2);
        }

        // Génération du PDF
        function generatePDF() {
            const { jsPDF } = window.jspdf;
            const invoice = document.getElementById('invoice');
            
            // Temporairement cacher le bouton pour le PDF
            const btn = document.querySelector('.btn-generate');
            btn.style.visibility = 'hidden';
            
            html2canvas(invoice).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // Format A4
                pdf.save('facture_convoyage_' + document.getElementById('invoice-number').textContent + '.pdf');
                
                // Réafficher le bouton
                btn.style.visibility = 'visible';
            });
        }