frappe.ui.form.on('Quotation', {
	refresh(frm) {
        if (!frm.is_new()) {
        if (frm.doc.docstatus === 0) {
                    return;
                }
		frm.add_custom_button('Create Shipment', () => {

				let shipment_doc = frappe.model.get_new_doc('Shipment');
				shipment_doc.custom_quotation = frm.doc.name;
                shipment_doc.pickup_from_type = frm.doc.quotation_to;
                shipment_doc.pickup_customer = frm.doc.party_name;
                shipment_doc.custom_place_of_receipt = frm.doc.custom_place_of_receipt;
                shipment_doc.custom_place_of_delivery = frm.doc.custom_place_of_delivery;
                shipment_doc.custom_direction = frm.doc.custom_direction;
                shipment_doc.incoterm = frm.doc.incoterm;
                shipment_doc.custom_stackable = frm.doc.custom_stackable;
                shipment_doc.custom_dangerous_goods = frm.doc.custom_dangerous_goods;
                shipment_doc.custom_nonnegotiable = frm.doc.custom_nonnegotiable;
                shipment_doc.custom_freight_booking = frm.doc.custom_freight_booking;
				shipment_doc.custom_freight_type = frm.doc.custom_freight_type;
                shipment_doc.shipment_type = frm.doc.custom_shipment_type;
                shipment_doc.custom_un_number = frm.doc.custom__un_number_;
                shipment_doc.custom_net_weight = frm.doc.custom_net_weight_kg;
                shipment_doc.custom_gross_weight = frm.doc.custom_gross_weight_kg;
                shipment_doc.custom_package_count = frm.doc.custom_no_of_package;
                shipment_doc.custom_chargeable_weight = frm.doc.custom_chargeable_weight;
                shipment_doc.custom_cbm = frm.doc.custom_cbm;
                if (frm.doc.custom_freight_type == "Sea Freight")
                {
                shipment_doc.custom_pol = frm.doc.custom_pol;
                shipment_doc.custom_pod = frm.doc.custom_pod;
                }
                if (frm.doc.custom_freight_type == "Air Freight")
                {
                shipment_doc.custom_airport_of_depature = frm.doc.custom_airport_of_depature;
                shipment_doc.custom_airport_of_destination = frm.doc.custom_airport_of_destination;   
                }

				frappe.set_route('Form', 'Shipment', shipment_doc.name);

			});
	}
}
})