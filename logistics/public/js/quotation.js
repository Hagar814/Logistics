frappe.ui.form.on('Quotation', {
	refresh(frm) {
        if (!frm.is_new()) {
        if (frm.doc.docstatus === 0) {
                    return;
                }
		frm.add_custom_button('Create Freight', () => {

				let shipment_doc = frappe.model.get_new_doc('Freight');
				shipment_doc.quotation = frm.doc.name;
                shipment_doc.customer = frm.doc.party_name;
                shipment_doc.place_of_receipt = frm.doc.custom_place_of_receipt;
                shipment_doc.place_of_delivery = frm.doc.custom_place_of_delivery;
                shipment_doc.direction = frm.doc.custom_direction;
                shipment_doc.incoterm = frm.doc.incoterm;
                shipment_doc.stackable = frm.doc.custom_stackable;
                shipment_doc.dangerous_goods = frm.doc.custom_dangerous_goods;
                shipment_doc.non_negotiable = frm.doc.custom_nonnegotiable;
                shipment_doc.freight_booking = frm.doc.custom_freight_booking;
				shipment_doc.freight_type = frm.doc.custom_freight_type;
                shipment_doc.shipment_type = frm.doc.custom_shipment_type;
                shipment_doc.un_number = frm.doc.custom__un_number_;
                shipment_doc.net_weight = frm.doc.custom_net_weight_kg;
                shipment_doc.gross_weight = frm.doc.custom_gross_weight_kg;
                shipment_doc.no_of_package = frm.doc.custom_no_of_package;
                shipment_doc.chargeable_weight = frm.doc.custom_chargeable_weight;
                shipment_doc.cbm = frm.doc.custom_cbm;
                if (frm.doc.custom_freight_type == "Sea Freight")
                {
                shipment_doc.pol = frm.doc.custom_pol;
                shipment_doc.pod = frm.doc.custom_pod;
                }
                if (frm.doc.custom_freight_type == "Air Freight")
                {
                shipment_doc.airport_of_depature = frm.doc.custom_airport_of_depature;
                shipment_doc.airport_of_destination = frm.doc.custom_airport_of_destination;   
                }

				frappe.set_route('Form', 'Freight', shipment_doc.name);

			});
	}
}
})