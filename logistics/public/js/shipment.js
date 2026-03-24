frappe.ui.form.on('Shipment', {

	refresh(frm) {

		if (!frm.is_new()) {
            
			if(workflow_state == "Arrived")
            {
			frm.add_custom_button('Create Sales Invoice', () => {

				let sales_doc = frappe.model.get_new_doc('Sales Invoice');
				sales_doc.custom_shipment = frm.doc.name;

				frappe.set_route('Form', 'Sales Invoice', sales_doc.name);

			});
		}
			if(workflow_state == "Arrived" || workflow_state == "Shipped" )
            {
			frm.add_custom_button('Create Customs Clearance', () => {

				let customs_doc = frappe.model.get_new_doc('Customs Clearance');
				customs_doc.shipment = frm.doc.name;

				frappe.set_route('Form', 'Customs Clearance', customs_doc.name);

			});
			}
		}

		// 🔹 Run address logic if value exists
		if (frm.doc.custom_address) {

			erpnext.utils.get_address_display(
				frm,
				"custom_address",
				"custom_agent_address",
				false
			);
		}

		// 🔹 Run contact logic if value exists
		if (frm.doc.custom_contact) {

			get_custom_contact_display(frm, frm.doc.custom_contact);
		}
	},
onload: function(frm) {

        frm.set_value('pickup_from_type', 'Customer');
        frm.set_value('delivery_to_type', 'Company');
        frm.set_df_property('pickup_from_type', 'options', ['Customer']);
        frm.set_df_property('delivery_to_type', 'options', ['Company'])
},
	custom_address: function (frm) {
		if (frm.doc.custom_address) {
			erpnext.utils.get_address_display(frm, "custom_address", "custom_agent_address", false);
		} else {
			frm.set_value("custom_agent_address", "");
		}
	},
	custom_contact(frm) {

		if (frm.doc.custom_contact) {
			get_custom_contact_display(frm, frm.doc.custom_contact);
		} else {
			frm.set_value("custom_agent_contact", "");
		}

	}
});


function get_custom_contact_display(frm, contact_name) {

	frappe.call({
		method: "frappe.contacts.doctype.contact.contact.get_contact_details",
		args: { contact: contact_name },
		callback(r) {

			if (r.message) {

				let d = r.message;
				let contact_display = d.contact_display || "";

				if (d.contact_email) {
					contact_display += "<br>" + d.contact_email;
				}

				if (d.contact_phone) {
					contact_display += "<br>" + d.contact_phone;
				} else if (d.contact_mobile) {
					contact_display += "<br>" + d.contact_mobile;
				}

				frm.set_value("custom_agent_contact", contact_display);

			}
		}
	});

}