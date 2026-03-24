frappe.ui.form.on('Customs Clearance', {
    refresh(frm) {
        if (frm.doc.docstatus === 0) {
        calculate_all(frm);
        }
        

    },
    on_submit(frm) {

        if (!frm.doc.shipment) return;

        frappe.call({
            method: "frappe.client.set_value",
            args: {
                doctype: "Shipment",
                name: frm.doc.shipment,
                fieldname: "custom_customs_clearance",
                value: frm.doc.total
            },
            callback: function() {
                frappe.msgprint("Shipment updated");
            }
        });


    },
    other_charges_add: calculate_all,
    other_charges_remove: calculate_all
    
});


function calculate_all(frm) {


    let other_total = (frm.doc.other_charges || [])
        .reduce((sum, row) => {
            console.log("Row amount_to_bill:", row.amount_to_bill);
            return sum + flt(row.amount_to_bill);
        }, 0);

    frm.set_value("total", other_total);
    frm.save();

}
